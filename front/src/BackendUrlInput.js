import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Grid, TextField} from "@material-ui/core";
import {isValidURL} from "./utils";
import {PulseLoader} from "react-spinners";

const useStyles = () => ({
  inputBackend: {
    minWidth: '220px',
  },
})

const BackendUrlInput = ({classes, setBackendValidUrl, setBackendInvalidUrl, isLoadingModels}) => {
  const [backendUrl, setBackendUrl] = useState('');

  function onChange(event) {
    const newBackendUrl = event.target.value
    setBackendUrl(newBackendUrl)
    if (isValidURL(newBackendUrl)) {
      setBackendValidUrl(newBackendUrl)
    } else {
      setBackendInvalidUrl()
    }
  }

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <TextField className={classes.inputBackend} id="standard-basic" label="Backend URL" value={backendUrl}
                   onChange={onChange}/>
      </Grid>
      <Grid item>
        <PulseLoader sizeUnit={"px"} size={5} color="purple" loading={isLoadingModels}/>
      </Grid>
    </Grid>
  )
}

export default withStyles(useStyles)(BackendUrlInput);