# Dalle-service

This is a simple front + back making it easy to use [DALL-E models](https://github.com/lucidrains/DALLE-pytorch)

![image](https://user-images.githubusercontent.com/2346494/120942358-affaca80-c728-11eb-93c0-084e1c27435d.png)

## Running the back on google colab

If you want to run the backend on google colab, you can run [this notebook](https://colab.research.google.com/github/rom1504/dalle-service/blob/master/dalle_back.ipynb)

You can then use the gh pages front with an url such as https://rom1504.github.io/dalle-service?back=https://XXXX.loca.lt

## Running the back myself

First follow [back](back) (you may choose to use https://ngrok.com/ to expose your locally running backend)

Then put your backend url in https://rom1504.github.io/dalle-service/

You can share an url such as https://rom1504.github.io/dalle-service?back=https://yourbackend.com

## Runnning the back and the front

If you want to run everything yourself, you can go to [back](back) then to [front](front)

## What Dalle models can I use ?

You can either train your model yourself with [DALL-E](https://github.com/lucidrains/DALLE-pytorch)

Or use a pretrained one from https://github.com/robvanvolt/DALLE-models/tree/main/models/taming_transformer 
