import base64
import json
import sys
from io import BytesIO
from pathlib import Path
from typing import Dict

import torch
from torchvision.utils import save_image
from dalle_pytorch import VQGanVAE, DALLE
from dalle_pytorch.tokenizer import tokenizer
from tqdm import tqdm
import numpy as np
from PIL import Image
from einops import repeat
from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api

BATCH_SIZE = 4
TOP_K = 0.9

vae = VQGanVAE()
image_size = vae.image_size


def load_dalle_models() -> Dict:
    models = json.load(open("pretrained_models.json"))
    loaded_models = {}
    for name, model_path in models.items():
        assert Path(model_path).exists(), f'Trained DALL-E {model_path} does not exist'
        load_obj = torch.load(model_path)
        dalle_params, _, weights = load_obj.pop('hparams'), load_obj.pop('vae_params'), load_obj.pop('weights')
        dalle_params.pop('vae', None)
        dalle = DALLE(vae=vae, **dalle_params).cuda()
        dalle.load_state_dict(weights)
        loaded_models[name] = dalle

    return loaded_models


dalle_loaded_models = load_dalle_models()


class AvailableModels(Resource):
    def get(self):
        return list(dalle_loaded_models.keys())


class ImageGenerationService(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        text_prompt = json_data["text"]
        num_images = json_data["num_images"]
        model_name = json_data["model_name"]
        model = dalle_loaded_models[model_name]

        text = tokenizer.tokenize([text_prompt], model.text_seq_len).cuda()
        text = repeat(text, '() n -> b n', b=num_images)

        outputs = []
        for text_chunk in tqdm(text.split(BATCH_SIZE), desc=f'generating images for - {text}'):
            output = model.generate_images(text_chunk, filter_thres=TOP_K)
            outputs.append(output)

        outputs = torch.cat(outputs)

        # save all images
        outputs_dir = "testing"
        outputs_dir = Path(outputs_dir) / text_prompt.replace(' ', '_')[:100]
        outputs_dir.mkdir(parents=True, exist_ok=True)

        generated_images = []
        for i, image in tqdm(enumerate(outputs), desc='saving images'):
            np_image = np.moveaxis(image.cpu().numpy(), 0, -1)
            formatted = (np_image * 255).astype('uint8')

            img = Image.fromarray(formatted)

            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            generated_images.append(img_str)
            save_image(image, outputs_dir / f'{i}.jpg', normalize=True)

        print(f'Created {num_images} images at "{str(outputs_dir)}"')
        return generated_images


class Health(Resource):
    def get(self):
        return "ok"


app = Flask(__name__)
api = Api(app)
api.add_resource(AvailableModels, '/available-models')
api.add_resource(ImageGenerationService, '/dalle')
api.add_resource(Health, '/')

if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=int(sys.argv[1]), debug=False)
