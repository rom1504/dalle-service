from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
import sys
import json

import argparse
from pathlib import Path
from tqdm import tqdm
import numpy as np

# torch

import torch

from einops import repeat

# vision imports

from PIL import Image
from torchvision.utils import make_grid, save_image

# dalle related classes and utils

from dalle_pytorch import DiscreteVAE, OpenAIDiscreteVAE, VQGanVAE1024, DALLE
from dalle_pytorch.tokenizer import tokenizer, HugTokenizer, YttmTokenizer, ChineseTokenizer

import base64
from io import BytesIO

# helper fns

def exists(val):
    return val is not None


# load DALL-E

dalle_path = Path("dalle_32.pt")

assert dalle_path.exists(), 'trained DALL-E must exist'

load_obj = torch.load(str(dalle_path))
dalle_params, vae_params, weights = load_obj.pop('hparams'), load_obj.pop('vae_params'), load_obj.pop('weights')

dalle_params.pop('vae', None) # cleanup later

vae = VQGanVAE1024()


dalle = DALLE(vae = vae, **dalle_params).cuda()

dalle.load_state_dict(weights)

batch_size = 4

top_k = 0.9

# generate images

image_size = vae.image_size



class DalleService(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        text_input = json_data["text"]
        num_images = json_data["num_images"]

        text = tokenizer.tokenize([text_input], dalle.text_seq_len).cuda()

        text = repeat(text, '() n -> b n', b = num_images)

        outputs = []

        for text_chunk in tqdm(text.split(batch_size), desc = f'generating images for - {text}'):
            output = dalle.generate_images(text_chunk, filter_thres = top_k)
            outputs.append(output)

        outputs = torch.cat(outputs)

        # save all images
        outputs_dir = "testing"

        outputs_dir = Path(outputs_dir) / text_input.replace(' ', '_')[:(100)]
        outputs_dir.mkdir(parents = True, exist_ok = True)

        response = []

        for i, image in tqdm(enumerate(outputs), desc = 'saving images'):
            np_image = np.moveaxis(image.cpu().numpy(), 0, -1)
            formatted = (np_image * 255).astype('uint8')

            img = Image.fromarray(formatted)

            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8") 
            response.append(img_str)
            save_image(image, outputs_dir / f'{i}.jpg', normalize=True)

        print(f'created {num_images} images at "{str(outputs_dir)}"')

        return response
    

class Health(Resource):
    def get(self):
        return "ok"


app = Flask(__name__)
api = Api(app)
api.add_resource(DalleService, '/dalle')
api.add_resource(Health, '/')

if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=int(sys.argv[1]), debug=False)
