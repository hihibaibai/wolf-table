import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";
import colorPlatte from "./colorPlatte";

const icon =
		'      <svg width="18" height="18" style="display: block;margin: auto">\n' +
  '        <path fill="#000000" fill-rule="evenodd" d="M7,1.5 L5,1.5 L0.5,13.5 L2.5,13.5 L3.62,10.5 L8.37,10.5 L9.49,13.5 L11.49,13.5 L7,1.5 L7,1.5 Z M4.38,8.5 L6,3.17 L7.62,8.5 L4.38,8.5 L4.38,8.5 Z" transform="translate(2 1)"/>\n' +
  '      </svg>';


export default class TextColor{
	constructor(value) {
		this.tag = 'textColor';
		this.value = value;
		this.el = this.element();
    this.colorPlatte = new colorPlatte(value);
    this.el._.append(this.colorPlatte.el._);
		this.change = () => {};
	}

	element() {
		const { tip } = this;
    const placeholder = document.createElement("div");
    placeholder.innerHTML = icon;
    const node = placeholder.firstElementChild;
		return h('div', `${stylePrefix}-toolbar-btn`)
				.on('click',(event) =>{
					this.value = !this.value;
					if (this.value){
						this.activeElementCss();
					}
					else {
						this.deactiveElementCss();
					}
				})
				.css({
					width:'20px',
					height:'20px',
					backgroundColor:'#000',
          margin:'6px'
				})
				.append(node)
				// .on('mouseenter', (evt) => {
				// 	tooltip(tip, evt.target);
				// })
				// .attr('data-tooltip', tip);
	}

	activeElementCss(){
		this.el.css('background-color','rgba(0,0,0,0.08)');
    let colorPlatte = this.el._.getElementsByTagName("path")[0];
    colorPlatte.setAttribute('fill','#888')
    console.log(colorPlatte)
	}

	deactiveElementCss(){
		this.el.css('background-color','rgba(0,0,0,0)');

	}
}