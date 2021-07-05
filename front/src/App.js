import React, {useEffect, useState} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {Grid, TextField, Typography} from "@material-ui/core";
import {callDalleService, getAvailableModels} from "./backend_api";
import GeneratedImageList from "./GeneratedImageList";
import TextPromptInput from "./TextPromptInput";
import {PulseLoader} from "react-spinners";

import "./App.css";
import AvailableModelsInput from "./AvailableModelsInput";
import BackendUrlInput from "./BackendUrlInput";

const useStyles = () => ({
  root: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    margin: '100px 0px 100px 0px',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: '30px',
  },
  subtitle: {
    marginBottom: '60px',
  },
  gallery: {
    marginTop: '30px',
    padding: '10px',
  },
});


const App = ({classes}) => {
  const [backendUrl, setBackendUrl] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isFetchingImgs, setIsFetchingImgs] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const maxImagesPerQuery = 5;

  const isBackendUrlValid = backendUrl !== ''

  useEffect(() => {
      if (isBackendUrlValid) {
        getAvailableModels(backendUrl).then((modelsList) => {
          setModels(modelsList)
          if (modelsList.length > 0) {
            setSelectedModel(modelsList[0])
          }
        })
      }
    }
    , [backendUrl]);


  function onModelSelected(event) {
    setSelectedModel(event.target.value)
  }

  function enterPressedCallback(promptText) {
    console.log('API call to DALL-E web service with the following prompt', promptText);
    setIsFetchingImgs(true)
    callDalleService(backendUrl, promptText, maxImagesPerQuery, selectedModel).then((generatedImgs) => {
      setGeneratedImages(generatedImgs)
      setIsFetchingImgs(false)
    })
  }


  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h3">
          DALL-E Playground <span role="img" aria-label="sparks-emoji">✨</span>
        </Typography>
      </div>

      <div className={classes.subtitle}>
        <Typography variant="body1">
          Put your DALL-E backend URL to start
        </Typography>
      </div>

      <Grid container justify="center" alignItems="center" direction="column">
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <BackendUrlInput setBackendValidUrl={setBackendUrl} setBackendInvalidUrl={() => {
                setModels([])
                setSelectedModel('')
              }}/>
            </Grid>

            <Grid item>
              <AvailableModelsInput models={models} selectedModel={selectedModel} onModelSelected={onModelSelected}
                                    disabled={!isBackendUrlValid}/>
            </Grid>

            <Grid item>
              <TextPromptInput enterPressedCallback={enterPressedCallback} disabled={isFetchingImgs || !isBackendUrlValid}/>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <div className={classes.gallery}>
            {!isFetchingImgs && <GeneratedImageList generatedImages={generatedImages}/>}
            {isFetchingImgs && <PulseLoader sizeUnit={"px"} size={20} color="purple" loading={isFetchingImgs}/>}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(useStyles)(App);