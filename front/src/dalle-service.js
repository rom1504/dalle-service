/* globals customElements */
import { LitElement, html, css } from 'lit-element'
import Service from './service'

class DalleService extends LitElement {
  constructor () {
    super()
    this.backendHost = 'http://mozart-rbeaumont-default-gpu.service.am6.consul.prod.crto.in:1234'
    this.service = new Service(this.backendHost)
    this.text = "The Heather dress from Diane von Furstenberg has a certain charm that aligns perfectly with the brand's feminine aesthetic. Comfortable in crisp stretch cotton-poplin, the midi-length style comes in pink with a yellow palm tree print covering the loose-fit silhouette. As intended by the creator of the iconic wrap dress, this design can be dressed up or down with ease for any event.    "
    this.numImages = 4
    this.imagesDalle = []
  }

  static get properties () {
    return {
      imagesDalle: { type: Array },
      text: { type: String },
      numImages: { type: Number }
    }
  }

  firstUpdated () {
    const searchElem = this.shadowRoot.getElementById('searchBar');
    searchElem.addEventListener('keyup', e => {if (e.keyCode === 13) {this.generate()}})
  }

  async generate () {
    const results = await this.service.callDalleService(this.text, this.numImages)
    console.log(results)
    this.imagesDalle = results
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
    #logoFull {
      width: 8%;
      margin-right:3%;
      vertical-align:middle;
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
    //      <input type="text" value=${this.numImages} @change=${e => {this.numImages = parseInt(e.target.value)}}/>
    //     <button type="button" @click=${() => this.generate()}>Generate</button> <br />
    return html`
    <div id="all">
    <div id="searchLine">
    <img src="assets/logo_full.png" id="logoFull" />
      <span id="inputSearchBar">
        <input id="searchBar" type="text" value=${this.text} @input=${e => {this.text = e.target.value}}/>
        <img src="assets/search.png" id="textSearch" @click=${e => { this.generate() }} />
      </span>
     
    </div>
    <div id="filter">
      Product Gen ! <br />
      Take some prompt examples from <a href="https://www.mytheresa.com/en-gb/clothing/dresses.html">My theresa</a> website.<br />
      The default prompt comes from <a href="https://www.mytheresa.com/en-gb/diane-von-furstenberg-heather-printed-stretch-cotton-midi-dress-1850994.html?catref=category">this product</a>
    </div>

    <div id="products">
    ${this.imagesDalle.map (image => this.renderImage(image))}
    </div>
    </div>
    `
  }
}

customElements.define('dalle-service', DalleService)
