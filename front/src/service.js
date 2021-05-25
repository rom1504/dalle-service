/* globals fetch */

import JsonBigint from 'json-bigint'

export default class Service {
  constructor (backend) {
    this.backend = backend
  }

  async callDalleService (text, numImages) {
    console.log('calling', text, numImages)
    const result = JsonBigint.parse(await (await fetch(this.backend + `/dalle`, {
      method: 'POST',
      body:JSON.stringify({
        text,
        'num_images': numImages
      })
    })).text())

    return result
  }
}
