import {stylePrefix} from "../../table/config";
import {h} from "../../table/element";

const icon =
    '    <svg width="18" height="18" style="display: block;margin: auto">\n' +
    '      <path fill="#010101" fill-rule="evenodd" d="M2.8875,3.06 C2.8875,2.6025 2.985,2.18625 3.18375,1.8075 C3.3825,1.42875 3.66,1.10625 4.02,0.84 C4.38,0.57375 4.80375,0.3675 5.29875,0.22125 C5.79375,0.075 6.33375,0 6.92625,0 C7.53375,0 8.085,0.0825 8.58,0.25125 C9.075,0.42 9.49875,0.6525 9.85125,0.95625 C10.20375,1.25625 10.47375,1.6125 10.665,2.02875 C10.85625,2.44125 10.95,2.895 10.95,3.38625 L8.6925,3.38625 C8.6925,3.1575 8.655,2.94375 8.58375,2.74875 C8.5125,2.55 8.4,2.38125 8.25,2.2425 C8.1,2.10375 7.9125,1.99125 7.6875,1.91625 C7.4625,1.8375 7.19625,1.8 6.88875,1.8 C6.5925,1.8 6.3375,1.83375 6.11625,1.8975 C5.89875,1.96125 5.71875,2.05125 5.57625,2.1675 C5.43375,2.28375 5.325,2.41875 5.25375,2.5725 C5.1825,2.72625 5.145,2.895 5.145,3.0675 C5.145,3.4275 5.32875,3.73125 5.69625,3.975 C5.71780203,3.98908066 5.73942012,4.00311728 5.76118357,4.01733315 C6.02342923,4.18863185 6.5,4.5 7,5 L4,5 C4,5 3.21375,4.37625 3.17625,4.30875 C2.985,3.9525 2.8875,3.53625 2.8875,3.06 Z M14,6 L0,6 L0,8 L7.21875,8 C7.35375,8.0525 7.51875,8.105 7.63125,8.15375 C7.90875,8.2775 8.12625,8.40875 8.28375,8.53625 C8.44125,8.6675 8.54625,8.81 8.6025,8.96 C8.65875,9.11375 8.685,9.28625 8.685,9.47375 C8.685,9.65 8.65125,9.815 8.58375,9.965 C8.51625,10.11875 8.41125,10.25 8.2725,10.35875 C8.13375,10.4675 7.95375,10.55375 7.74,10.6175 C7.5225,10.68125 7.27125,10.71125 6.97875,10.71125 C6.6525,10.71125 6.35625,10.6775 6.09,10.61375 C5.82375,10.55 5.59875,10.445 5.41125,10.3025 C5.22375,10.16 5.0775,9.9725 4.9725,9.74375 C4.8675,9.515 4.78125,9.17 4.78125,9 L2.55,9 C2.55,9.2525 2.61,9.6875 2.72625,10.025 C2.8425,10.3625 3.0075,10.66625 3.21375,10.9325 C3.42,11.19875 3.6675,11.4275 3.94875,11.6225 C4.23,11.8175 4.53375,11.9825 4.86375,12.11 C5.19375,12.24125 5.535,12.33875 5.89875,12.39875 C6.25875,12.4625 6.6225,12.4925 6.9825,12.4925 C7.5825,12.4925 8.13,12.425 8.6175,12.28625 C9.105,12.1475 9.525,11.94875 9.87,11.69375 C10.215,11.435 10.48125,11.12 10.6725,10.74125 C10.86375,10.3625 10.95375,9.935 10.95375,9.455 C10.95375,9.005 10.875,8.6 10.72125,8.24375 C10.68375,8.1575 10.6425,8.075 10.59375,7.9925 L14,8 L14,6 Z" transform="translate(2 3)"/>\n' +
    '    </svg>';

export default class StrikeThrough {
  constructor(toolbar) {
    this.tag = 'strikeThrough';
    this.value = toolbar.style.strikethrough;
    this.active = false;
    this.el = this.element();
    this.change = (value) => {
      toolbar.style.strikethrough = value;
      toolbar.styleChanged();
    };
  }

  element() {
    const {tip} = this;
    const placeholder = document.createElement("div");
    placeholder.innerHTML = icon;
    const node = placeholder.firstElementChild;
    return h('div', `${stylePrefix}-toolbar-btn`)
        .on('click', (event) => {
          if (this.active) {
            this.deactiveElementCss();
          } else {
            this.activeElementCss();
          }
        })
        .css({
          width: '20px',
          height: '20px',
          backgroundColor: '#000',
          margin: '6px'
        })
        .append(node)
    // .on('mouseenter', (evt) => {
    // 	tooltip(tip, evt.target);
    // })
    // .attr('data-tooltip', tip);
  }

  // 这个函数是用来更新绑定的值与对应的状态的。
  updateValue(style){
    this.value = style.strikethrough;
    if (this.value){
      this.active = true;
      this.el.css('background-color', 'rgba(0,0,0,0.08)');
    }
    else {
      this.active = false;
      this.el.css('background-color', 'rgba(0,0,0,0)');
    }
  }

  activeElementCss() {
    this.active = !this.active;
    this.el.css('background-color', 'rgba(0,0,0,0.08)');
    this.change(true);
  }

  deactiveElementCss() {
    this.active = !this.active;
    this.el.css('background-color', 'rgba(0,0,0,0)');
    this.change(false);
  }
}