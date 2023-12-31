import selector from './index.selector';

function move(t) {
  const {_editor, _selector, _renderer} = t;
  // console.log('_editor', _editor, _selector);
  if (_editor && _selector) {
    const {_focusArea, _focus} = _selector;
    if (_editor.visible && _focusArea) {
      const {_rect, _target} = _focusArea;
      const {viewport} = _renderer;
      if (_rect && _target && viewport && viewport.inAreas(..._focus)) {
        _editor.rect(_rect).target(_target).show();
      }
      else {
        _editor.rect({x: -100, y: -100, width: 0, height: 0}).hide();
      }
    }
  }
}

function reset(t) {
  // debugger
  const {_selector} = t;
  if (_selector) {
    const {_focusRange, _focusArea} = _selector;
    if (_focusRange && _focusArea) {
      // debugger
      const {_rect, _target} = _focusArea;
      const {startRow, startCol} = _focusRange;
      const cell = t.getCell(startRow, startCol);
      // 下面这行会录入更改的函数
      let type = 'text';
      if (cell instanceof Object && cell.type) {
        type = cell.type;
      }
      const _editors = t._editors;
      // 这里的editor应该是./table/editor/text/index.js这个文件里面的
      const editor = _editors.get(type);
      if (cell && cell instanceof String) {
        editor._value = cell;
      }
      else if (cell) {
        editor._value = cell[2].value;
      }
      console.log('startRow', startRow)
      console.log('startCol', startCol)
      editor.changer((value) => {
        let currentStyle = {};
        if (t.toolbarStyle){
          currentStyle = Object.assign({}, t.toolbarStyle.getCurrentStyle());
        }
        else {
          currentStyle = t._data.style;
        }
        // 下面的这个方法会浅拷贝传进去的值，所以这里得做一个新的塞进去
        let style = t.addStyle(currentStyle);
        console.log('styleIndex', style, 'style', t.style(style))
        if (style != null) {
          t.setCell(startRow, startCol, {value: value, style: style}).render();
        }
        else {
          t.setCell(startRow, startCol, {value: value}).render();

        }
        // if (value !== null) {
        // _selector.clearCopy();
        // const { _ranges } = _selector;
        // _ranges.forEach((it) => {
        //     if (it) {
        //         it.each((r, c) => {
        //             t.setCell(r, c, value);
        //         });
        //     }
        // });
        // t.render();
        // selector.setCellValue(t, value);
        // }
      });
      editor.moveChanger((direction) => {
        const {_selector} = t;
        if (direction !== 'none' && _selector) {
          selector.move(t, true, direction, 1);
          t._canvas.focus();
        }
      });
      t._editor = editor;
      if (editor && _rect && _target) {
        console.log('row:', startRow, ', col:', startCol, ', rect:', _rect);
        if (cell) {
          editor.value(cell[2].value);
        }
        editor.cellIndex(startRow, startCol).rect(_rect).target(_target).show();
      }
    }
  }
}

export default {
  move,
  reset,
};
