export default class ElementOperator{
  static showElement(element) {
    element.style.display = 'block';
  }

  static hideElement(element) {
    element.style.display = 'none';
  }

  static setWidth(element, width) {
    element.style.setProperty('width',width);
  }

  static setHeight(element, height) {
    element.style.setProperty('height', height);
  }

  static setLeft(element, left) {
    element.style.setProperty('left', left);
  }

  static setRight(element, right) {
    element.style.setProperty('right', right);
  }

  static setTop(element, top) {
    element.style.setProperty('top', top);
  }

  static setBottom(element, bottom) {
    element.style.setProperty('bottom', bottom);
  }

  static setPointerEvents(element, pointerEvents) {
    element.style.setProperty('pointer-events', pointerEvents);
  }
  static setPosition(element, position) {
    element.style.setProperty('position', position);
  }

  static setOverflow(element, overflow) {
    element.style.setProperty('overflow', overflow);
  }

  static setClass(element, className) {
    element.className = className;
  }
}