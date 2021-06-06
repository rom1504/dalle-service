/* globals customElements */
import { LitElement, html, css } from 'lit-element'
import Service from './service'

class DalleService extends LitElement {
  constructor () {
    super()
    this.backendHost = '' // put something here
    this.service = new Service(this.backendHost)
    this.text = "pink shoes"
    this.numImages = 4
    this.imagesDalle = []
    this.loading = false
    this.service.getDalleList().then(l => {
      this.models = l
      this.currentModel = this.models[0]
    })
  }

  static get properties () {
    return {
      imagesDalle: { type: Array },
      loading: { type: Boolean },
      loadingSeconds: { type: Number },
      text: { type: String },
      numImages: { type: Number },
      models: { type: Array },
      currentModel: { type: String }
    }
  }

  firstUpdated () {
    const searchElem = this.shadowRoot.getElementById('searchBar');
    searchElem.addEventListener('keyup', e => {if (e.keyCode === 13) {this.generate()}})
  }

  async generate () {
    this.loading = true
    this.loadingSeconds = 10
    const i = setInterval(() => this.loadingSeconds-=1, 1000)
    const results = await this.service.callDalleService(this.text, this.numImages, this.currentModel)
    console.log(results)
    this.imagesDalle = results
    this.loading = false
    clearInterval(i)
  }

  renderImage (image) {
    return html`<img src="data:image/png;base64, ${image}" />`
  } 

  static get styles () {
    return css`
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
        -webkit-transition-delay: 9999s;
    }

    #searchBar, #searchBar:hover, #searchBar:focus, #searchBar:valid {
      border-radius: 25px;
      border-color: #ddd;
      background-color:white;
      border-width:1px;
      width:60%;
      padding:15px;
      outline: none;
      border-style: solid;
      font-size:16px;
      font-family:arial, sans-serif;
    }
    #searchBar:hover, #searchBar:focus {
      box-shadow: 0px 0px 7px  #ccc;
    }
    #all {
      margin-left:2%;
      margin-right:2%;
      margin-top:2%;
    }
    #inputSearchBar:hover > #searchBar {
      box-shadow: 0px 0px 7px  #ccc !important;
    }
    #textSearch {
      width: 22px;
      margin-left:1.5%;
      vertical-align:middle;
      cursor:pointer;
    }
    #products {
      margin-top:50px;
      width:80%;
      float:right;
    }
    #filter {
      margin-top:50px;
      width:19%;
      float:left;
    }

    `
  }

  render () {
    return html`
    <div id="all">
    <div id="searchLine">
      <span id="inputSearchBar">
        <input id="searchBar" type="text" value=${this.text} @input=${e => {this.text = e.target.value}}/>
        <img src="assets/search.png" id="textSearch" @click=${e => { this.generate() }} />
        <select @input=${e => {this.currentModel = e.target.value}}>
        ${this.models.map(model => html`<option value=${model} ?selected=${model === this.currentModel}>${model}</option>`)}</select>
        Backend url: <input type="text" value=${this.backendHost} @input=${e => {this.backendHost = e.target.value}}/>
      </span>
     
    </div>
    <div id="filter">
      Dalle Text to Image ! <br />
    </div>

    <div id="products">
    ${this.loading ? `loading, please wait ${this.loadingSeconds} seconds...` : ''}
    ${this.imagesDalle.map (image => this.renderImage(image))}
    </div>
    </div>
    `
  }
}

customElements.define('dalle-service', DalleService)
