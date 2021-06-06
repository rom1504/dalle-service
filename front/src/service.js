/* globals fetch */

import JsonBigint from 'json-bigint'

export default class Service {
  constructor (backend) {
    this.backend = backend
  }

  async getDalleList () {
    const result = JsonBigint.parse(await (await fetch(this.backend + `/dalle-list`, {
    })).text())

    return result
  }

  async callDalleService (text, numImages, dalleName) {
    console.log('calling', text, numImages)
    const result = JsonBigint.parse(await (await fetch(this.backend + `/dalle`, {
      method: 'POST',
      body:JSON.stringify({
        text,
        'num_images': numImages,
        'dalle_name': dalleName
      })
    })).text())

    return result
  }
}
