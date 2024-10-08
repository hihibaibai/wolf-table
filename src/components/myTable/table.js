import {stylePrefix} from './config';
import OverLayer from '@/components/myTable/overLayer';
import ElementOperator from '@/components/myTable/elementOperator';
import Renderer from '@/components/myTable/renderer';
import ScrollBar from '@/components/myTable/scrollBar';
import {eventInit} from '@/components/myTable/event';
import Resizer from "@/components/myTable/resizer";
import Editor from "@/components/myTable/editor";
import Selector from "@/components/myTable/selector";

const defaultData = {
  rows: {},
  cols: {},
  rowHeight: 25,
  colWidth: 100,
  headerWidth: 50,
  headerHeight: 26,
  style: {
    bgColor: '#FFF',
    color: '#333',
    align: 'left',
    valign: 'middle',
    textWrap: false,
    bold: false,
    italic: false,
    fontFamily: 'Roboto',
    fontSize: 10,
    underline: false,
    strikethrough: false,
    border: {}
  },
  styles: [],
  borders: [],
  merges: [],
  cells: [],
};

export default class Table {
  width = 0;
  height = 0;
  data = {};
  canvas = {};
  canvasContext = {};
  overLayer = {};

  constructor(element, width, height, options) {
    this.width = width;
    this.height = height;
    this.data = null;
    this.canvas = {};
    this.canvasContext = {};
    let getElement = (element)=>{
      if (typeof element === 'string'){
        return document.querySelector(element)
      }
      if (typeof element === 'object' && (element instanceof Element || element instanceof HTMLDocument)){
        return element
      }
      console.warn("未找到对应div元素");
    }
    // 设置最外面的容器
    const container = getElement(element);
    ElementOperator.setClass(container, stylePrefix + '--container');
    ElementOperator.setWidth(container, width);
    ElementOperator.setHeight(container, height);
    ElementOperator.setPosition(container, 'relative');
    ElementOperator.setOverflow(element, 'hidden');

    // console.log(container);

    // 初始化数据
    this.data = JSON.parse(JSON.stringify(defaultData));

    // 初始化画布
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    const dpr = window.devicePixelRatio;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    // this.canvas.setAttribute('tabIndex', '1');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.scale(dpr, dpr);
    container.append(this.canvas);
    //初始化渲染器
    this.renderer = new Renderer(this.canvasContext, width, height);

    // 初始化行宽列高调整期
    this.resizer = new Resizer(container, width, height, this);

    // 初始化滚动条
    this.scrollBar = new ScrollBar(container, width, height, this);
    this.scrollBar.setData(this.data);

    // 在画布上放多个重叠的透明元素，这个元素负责点击事件之类的，在单元框被点击的时候，这些透明元素会变色来显示选中
    this.overLayer = new OverLayer(container, this, this.width, this.height);

    this.selector = new Selector(this);

    this.editor = new Editor(this);
    eventInit(this);
  }

  setData(data){
    this.data = data;
    this.scrollBar.setData(this.data);
    this.overLayer.setData(this.data);
    return this;
  }

  getData(){
    return this.data;
  }

  /**
   * 渲染表单
   */
  render(){
    this.renderer.render({data: this.data, viewport: this.scrollBar.getViewport()});
    return this;
  }

  static create(element, width, height, options) {
    return new Table(element, width, height, options);
  }

}