import { h } from '../../element';
import { borderWidth, stylePrefix } from '../../config';
import Editor from '..';
import { cellValueString } from '../../data';
export default class TextEditor {
    constructor() {
        this._target = null;
        this._rect = null;
        this._visible = false;
        this._moveChanger = () => { };
        this._changer = () => { };
        this._ = h('div', `${stylePrefix}-editor`);
        this._text = h('textarea', '');
        this._textMeasure = h('div', 'measure');
        this._editing = false;
        this._.append(this._text, this._textMeasure);
        this._text
            .on('keydown', (evt) => {
            keydownHandler(this, evt);
        })
            .on('input', ({ target }) => {
            const { value } = target;
            this._editing = true;
            this._value = value;
            // debugger
            this._changer(value);
            resizeSize(this);
        });
    }
    get visible() {
        return this._visible;
    }
    target(target) {
        target.append(this._);
        this._target = target;
        return this;
    }
    cellIndex(r, c) {
        return this;
    }
    value(value) {
        this._value = value;
        this._text.value(cellValueString(value) || '');
        resizeSize(this);
        return this;
    }
    changed() {
        // this._changer(this._value);
        this.hide();
    }
    rect(rect) {
        if (rect) {
            this._visible = true;
            this._rect = rect;
            const { x, y, width, height } = rect;
            this._.css({
                left: x - borderWidth / 2,
                top: y - borderWidth / 2,
                width: width - borderWidth,
                height: height - borderWidth,
            }).show();
            setTimeout(() => {
                const { _value } = this;
                let position = 0;
                if (_value !== null) {
                    position = cellValueString(_value).length;
                }
                const el = this._text.element();
                el.focus();
                el.setSelectionRange(position, position);
            }, 0);
        }
        return this;
    }
    show() {
        this._.show();
        return this;
    }
    hide() {
        this._visible = false;
        this.value('');
        this._.hide();
        this._editing = false;
        return this;
    }
    moveChanger(value) {
        this._moveChanger = value;
        return this;
    }
    changer(value) {
        this._changer = value;
        return this;
    }
}
function resizeSize(editor) {
    const { _, _value, _rect, _textMeasure, _target } = editor;
    if (typeof _value !== 'string')
        return;
    // const txts = _value.split('\n');
    let measureHtml = _value.replace('\n', '<br/>');
    if (_value.endsWith('\n'))
        measureHtml += 'T';
    _textMeasure.html(measureHtml);
    if (_rect && _target) {
        const padding = parseInt(_textMeasure.computedStyle().getPropertyValue('padding'));
        const toffset = _target.offset();
        const maxWidth = toffset.width - _rect.x - borderWidth;
        const maxHeight = toffset.height - _rect.y - borderWidth;
        _.css('max-width', `${maxWidth}px`);
        _textMeasure.css('max-width', `${maxWidth - padding * 2}px`);
        const { width, height } = _textMeasure.rect();
        const minWidth = _rect.width - borderWidth;
        if (width > minWidth) {
            _.css({ width: width });
        }
        if (height > _rect.height && height <= maxHeight) {
            _.css({ height: height });
        }
        else if (height < _rect.height) {
            _.css({ height: _rect.height - borderWidth });
        }
    }
}
function keydownHandler(editor, evt) {
    const { code, shiftKey, metaKey, altKey, ctrlKey, target } = evt;
    const moveChanger = (direction) => {
        editor._moveChanger(direction);
        editor.hide();
    };
    // console.log('code:', code, shiftKey, ctrlKey);
    if (code === 'Enter') {
        if (ctrlKey || metaKey || altKey) {
            target.value += '\n';
            editor.value(target.value);
        }
        else if (shiftKey) {
            // move to up cell
            moveChanger('up');
        }
        else {
            // move to down cell
            moveChanger('down');
        }
        evt.preventDefault();
    }
    else if (code === 'Tab' && !ctrlKey && !metaKey && !altKey) {
        if (shiftKey) {
            // move to left cell
            moveChanger('left');
        }
        else {
            // move to right cell
            moveChanger('right');
        }
        evt.preventDefault();
        // evt.stopPropagation();
    }
}
