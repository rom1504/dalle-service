import React from 'react';
import {Grid} from "@material-ui/core";

const ImageObject = ({imgData, alt}) => <img src={`data:image/png;base64,${imgData}`} alt={alt}/>

const GeneratedImageList = ({generatedImages}) => {
  return (
    <Grid container spacing={2}>
      {generatedImages.map((generatedImg, index) => {
        return (
          <Grid item id={index} xs={3}>
            <ImageObject imgData={generatedImg} alt={index}/>
          </Grid>
        )
      })
      }
    </Grid>
  )
}

export default GeneratedImageList;