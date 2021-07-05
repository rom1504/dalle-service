import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {TextField} from "@material-ui/core";
import {isValidURL} from "./utils";

const useStyles = () => ({
  inputBackend: {
    minWidth: '220px',
  },
})

const BackendUrlInput = ({classes, setBackendValidUrl,setBackendInvalidUrl}) => {
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
    <TextField className={classes.inputBackend} id="standard-basic" label="Backend URL" value={backendUrl}
               onChange={onChange}/>
  )
}

export default withStyles(useStyles)(BackendUrlInput);