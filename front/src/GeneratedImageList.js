import React from 'react';
import {Grid} from "@material-ui/core";

const ImageObject = ({imgData, alt}) => <img src={`data:image/png;base64,${imgData}`} alt={alt}/>

const GeneratedImageList = ({generatedImages}) => {
  return (
    <Grid container justify="center" alignItems="center" spacing={3}>
      {generatedImages2.map((generatedImg, index) => {
        return (
          <Grid item id={index}>
            <ImageObject imgData={generatedImg} alt={index}/>
          </Grid>
        )
      })
      }
    </Grid>
  )
}

export default GeneratedImageList;
