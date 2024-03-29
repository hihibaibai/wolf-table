export default class ezPrint{
  constructor(options) {
    this.iframe = {};
    this.iframeDocument = {};
    this.body = {};
    this.loadNumber = 0; // 确认图片是否加载完成的数字
    this.loadImage = []; // 所有的图片的
    this.readyForPrint = false;
    this.iframe = document.createElement('iframe');
    if (options){
      this.margin = options.margin?options.margin:20;
    }
    else {
      this.margin = 0;
    }
    let iframe = this.iframe;
    // iframe.setAttribute('style','position:absolute;width:0;height:0;left:-5000px;top:-5000px')
    iframe.setAttribute('style','position:absolute;width:794px;height:1123px')

    document.getElementsByTagName('body')[0].appendChild(this.iframe);

    if (navigator.userAgent.includes("Firefox")){
      this.iframe.contentWindow.onload = () =>{
        this.iframeDocument = iframe.contentDocument;
        this.iframeDocument.firstChild.width;
        console.log(this.iframeDocument);
        let document = this.iframeDocument;
        let bodyTag = this.iframeDocument.body;
        this.body = bodyTag;
        let headTag = this.iframeDocument.head;
        this.headTag = headTag;

        let PPI = getPPI();
        // debugger
        let pageWidthInPx = Math.round(210*(PPI/25.4));
        let pageHeightInPx = Math.round(297*(PPI/25.4));
        document.firstChild.style.width=pageWidthInPx;
        document.firstChild.style.height=pageHeightInPx-1;

        let style = document.createElement('style');
        style.innerText=
            'body {' +
            ` width:${pageWidthInPx-this.margin*2}px;`+
            ` height:${pageHeightInPx-this.margin*2-1}px;`+
            ` padding:${this.margin}px;`+
            ' margin: 0;' +
            '}' +
            'table {' +
            // ` width:${pageWidthInPx-this.margin*2}px;`+
            // ` height:${pageHeightInPx-this.margin*2-1}px;`+
            ` border-spacing: 0;`+
            // ' background-color: black;'+
            '}' +
            'table.content-container {' +
            '    page-break-after:always;' +
            '}' +
            'thead.content-header {' +
            '    display:table-header-group;' +
            '}' +
            'tfoot.content-footer {' +
            ' position: absolute;' +
            ' bottom: 0;' +
            ' right: 0;' +
            ' display:table-footer-group;' +
            '}' +
            '@page {' +
            ' size:A4;' +
            ' margin:0;'+
            '}'
        headTag.appendChild(style);
      }
    }
    /*else {
      this.iframeDocument = iframe.contentDocument;
      this.iframeDocument.firstChild.width;
      console.log(this.iframeDocument);
      let bodyTag = this.iframeDocument.body;
      this.body = bodyTag;
      let headTag = this.iframeDocument.head;
      this.headTag = headTag;
      let PPI = getPPI();
      // debugger
      let pageWidthInPx = Math.round(210*(PPI/25.4));
      let pageHeightInPx = Math.round(297*(PPI/25.4));
      this.iframeDocument.firstChild.style.width=pageWidthInPx;
      this.iframeDocument.firstChild.style.height=pageHeightInPx-1;

      let style = this.iframeDocument.createElement('style');
      style.innerText=
          'body {' +
          ` width:${pageWidthInPx-40}px;`+
          ` height:${pageHeightInPx-40-1}px;`+
          ' margin: 0;' +
          '}' +
          'table {' +
          ` width:${pageWidthInPx}px;`+
          ` height:${pageHeightInPx-1}px;`+
          ` border-spacing: 0;`+
          // ' background-color: black;'+
          '}' +
          'table.content-container {' +
          ' page-break-after:always;' +
          '}' +
          'thead.content-header {' +
          '    display:table-header-group;' +
          '}' +
          'tfoot.content-footer {' +
          ' position: absolute;' +
          ' bottom: 0;' +
          ' right: 0;' +
          ' display:table-footer-group;' +
          '}' +
          '@page {' +
          ' size:A4;' +
          ' margin:0' +
          '}'
      headTag.appendChild(style);
    }*/

    this.iframe.contentWindow.onafterprint = (event) =>{
      // console.log(event)
      // document.getElementsByTagName('body')[0].removeChild(this.iframe);
    }
    return this;
  }

  /**
   * 下面这个函数会把传入的变量塞到tbody里面去。
   * 允许传入的是base64的字符串，或者Image对象
   */
  setPrintContent(content){
    let tableTag = this.iframeDocument.createElement('table');
    let theadTag = this.iframeDocument.createElement('thead');
    let tfootTag = this.iframeDocument.createElement('tfoot');
    let tbodyTag = this.iframeDocument.createElement('tbody');

    theadTag.classList.add("content-header");
    tfootTag.classList.add("content-footer");
    tableTag.classList.add("content-container");

    let headContent = this.iframeDocument.createElement('div');
    // headContent.innerText = '这个是表头的内容';
    let bodyContent = this.iframeDocument.createElement('div');
    if (content instanceof Array){
      if (content.length>0){
        console.log(content);
        if (typeof content[0] === 'string'){
          // for (let i = 0; i < content.length; i++) {
          //   let imageUrl = content[i];
          // }
          // for (const imageUrl of content) {
          // }
          for (const imageUrl of content) {
            let imageObj = new Image();
            imageObj.src=imageUrl;
            console.log(imageUrl)
            this.loadImage.push(imageUrl);
            imageObj.onload = () =>{
              this.loadCompleteCallback();
            }
            imageObj.width=794-this.margin;
            imageObj.height=1122-this.margin;
            bodyContent.appendChild(imageObj);
          }
        }
      }
    }
    if (content instanceof Image){
      this.loadImage.push(content.src);
      content.onload = ()=>{
        this.loadCompleteCallback();
      }
      content.width=794-this.margin;
      content.height=1122-this.margin;
      bodyContent.appendChild(content);
    }
    if ( typeof content === "string"){
      let imageObj = new Image();
      console.log(content)
      imageObj.src=content;
      this.loadImage.push(content);
      imageObj.onload = () =>{
        this.loadCompleteCallback();
      }
      imageObj.width=794-this.margin;
      imageObj.height=1122-this.margin;
      bodyContent.appendChild(imageObj);
    }

    let footContent = this.iframeDocument.createElement('div');
    // footContent.innerText = '这个是表尾内容';
    theadTag.appendChild(this.iframeDocument.createElement('tr').appendChild(this.iframeDocument.createElement('th').appendChild(headContent)))
    tfootTag.appendChild(this.iframeDocument.createElement('tr').appendChild(this.iframeDocument.createElement('td').appendChild(footContent)))
    tbodyTag.appendChild(this.iframeDocument.createElement('tr').appendChild(this.iframeDocument.createElement('td').appendChild(bodyContent)))

    tableTag.appendChild(theadTag);
    tableTag.appendChild(tfootTag);
    tableTag.appendChild(tbodyTag);

    this.body.appendChild(tableTag)
    console.log(this.iframeDocument.body.clientWidth)
    console.log(this.iframeDocument.body.clientHeight)
  }

  print(){
    console.log(1)
    if (this.readyForPrint){
      this.iframe.contentWindow.print();
    }
  }

  loadCompleteCallback(){
    this.loadNumber ++;
    if (this.loadNumber == this.loadImage.length){
      this.readyForPrint = true;
    }
  }

}

function getPPI(){
  // create an empty element
  let div = document.createElement('div');
// give it an absolute size of one inch
  div.style.width='1in';
// append it to the body
  let body = document.getElementsByTagName('body')[0];
  body.appendChild(div);
// read the computed width
  let ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
// remove it again
  body.removeChild(div);
// and return the value
  return parseFloat(ppi);
}