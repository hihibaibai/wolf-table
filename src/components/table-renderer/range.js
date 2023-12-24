import { expr2xy, xy2expr } from './alphabet';
/**
 * the range spendColfied by a start position and an end position,
 * the smallest range must contain at least one cell.
 * Range is not a merged cell, but it can be merged as a single cell
 * @author myliang
 */
export default class Range {
    /**
     * @param startRow index of row of the start position
     * @param startCol index of col of the start position
     * @param endRow index of row of the end position
     * @param endCol index of col of the end position
     */
    constructor(startRow, startCol, endRow, endCol) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        // No body necessary
    }
    get start() {
        return [this.startRow, this.startCol];
    }
    get end() {
        return [this.endRow, this.endCol];
    }
    // count of rows contained in this range
    get rows() {
        return this.endRow - this.startRow;
    }
    // count of cols contained in this range
    get cols() {
        return this.endCol - this.startCol;
    }
    get multiple() {
        return this.cols > 0 || this.rows > 0;
    }
    /**
     * check whether or not the row-index contained in the row of range
     * @param {int} index
     * @returns {boolean}
     */
    containsRow(index) {
        return this.startRow <= index && index <= this.endRow;
    }
    /**
     * check whether or not the index contained in the col of range
     * @param {int} index
     * @returns {boolean}
     */
    containsCol(index) {
        return this.startCol <= index && index <= this.endCol;
    }
    /**
     * check whether or not the range contains a cell position(row, col)
     * @param {int} row row-index
     * @param {int} col col-index
     * @returns {boolean}
     */
    contains(row, col) {
        return this.containsRow(row) && this.containsCol(col);
    }
    /**
     * check whether or not the range within the other range
     * @param {Range} other
     * @returns {boolean}
     */
    within(other) {
        return (this.startRow >= other.startRow &&
            this.startCol >= other.startCol &&
            this.endRow <= other.endRow &&
            this.endCol <= other.endCol);
    }
    position(other) {
        if (this.startRow <= other.startRow && this.endRow >= other.endRow) {
            // left | right
            if (other.startCol > this.endCol)
                return 'right';
            else if (other.endCol < this.startCol)
                return 'left';
        }
        else if (this.startCol <= other.startCol && this.endCol >= other.endCol) {
            // up | down
            if (other.startRow > this.endRow)
                return 'down';
            else if (other.endRow < this.startRow)
                return 'up';
        }
        return 'none';
    }
    intersectsRow(startRow, endRow) {
        return this.startRow <= endRow && startRow <= this.endRow;
    }
    intersectsCol(startCol, endCol) {
        return this.startCol <= endCol && startCol <= this.endCol;
    }
    /**
     * check whether or not the range intersects the other range
     * @param {Range} other
     * @returns {boolean}
     */
    intersects({ startRow, startCol, endRow, endCol }) {
        return (this.intersectsCol(startCol, endCol) &&
            this.intersectsRow(startRow, endRow));
    }
    /**
     * the self intersection the other resulting in the new range
     * @param {Range} other
     * @returns {Range} the new range
     */
    intersection(other) {
        return new Range(other.startRow < this.startRow ? this.startRow : other.startRow, other.startCol < this.startCol ? this.startCol : other.startCol, other.endRow > this.endRow ? this.endRow : other.endRow, other.endCol > this.endCol ? this.endCol : other.endCol);
    }
    /**
     * the self union the other resulting in the new range
     * @param {Range} other
     * @returns {Range} the new range
     */
    union(other) {
        return new Range(other.startRow < this.startRow ? other.startRow : this.startRow, other.startCol < this.startCol ? other.startCol : this.startCol, other.endRow > this.endRow ? other.endRow : this.endRow, other.endCol > this.endCol ? other.endCol : this.endCol);
    }
    // Returns Array<CellRange> that represents that part of this that does not intersect with other
    // difference
    difference(other) {
        const ret = [];
        if (!this.intersects(other))
            return ret;
        const { startRow, startCol, endRow, endCol } = this;
        const nOther = this.intersection(other);
        return [
            new Range(startRow, startCol, nOther.startRow - 1, endCol), // top
            new Range(nOther.endRow + 1, startCol, endRow, endCol), // bottom
            new Range(nOther.startRow, startCol, nOther.endRow, nOther.startCol - 1), // left
            new Range(nOther.startRow, nOther.endCol + 1, nOther.endRow, endCol), // right
        ].filter((it) => it.rows >= 0 && it.cols >= 0);
    }
    touches(other) {
        return ((other.startRow === this.startRow &&
            other.endRow === this.endRow &&
            (other.endCol + 1 === this.startCol ||
                this.endCol + 1 === other.startCol)) ||
            (other.startCol === this.startCol &&
                other.endCol === this.endCol &&
                (other.endRow + 1 === this.startRow ||
                    this.endRow + 1 === this.startCol)));
    }
    eachRow(callbackFn, max) {
        let { endRow } = this;
        if (max && endRow > max)
            endRow = max;
        for (let row = this.startRow; row <= endRow; row += 1) {
            callbackFn(row);
        }
        return this;
    }
    eachCol(callbackFn, max) {
        let { endCol } = this;
        if (max && endCol > max)
            endCol = max;
        for (let col = this.startCol; col <= endCol; col += 1) {
            callbackFn(col);
        }
        return this;
    }
    /**
     * @param {Function} callbackFn (rowIndex, colIndex) => {}
     * @returns this
     */
    each(callbackFn) {
        this.eachRow((row) => {
            this.eachCol((col) => callbackFn(row, col));
        });
        return this;
    }
    clone() {
        return new Range(this.startRow, this.startCol, this.endRow, this.endCol);
    }
    toString() {
        let ref = xy2expr(this.startCol, this.startRow);
        if (this.multiple) {
            ref += `:${xy2expr(this.endCol, this.endRow)}`;
        }
        return ref;
    }
    equals(other) {
        return (this.startRow === other.startRow &&
            this.startCol === other.startCol &&
            this.endRow === other.endRow &&
            this.endCol === other.endCol);
    }
    static create(row, col, row1, col1) {
        if (row1 !== undefined && col1 !== undefined) {
            let [startRow, startCol, endRow, endCol] = [row, col, row1, col1];
            if (row > row1) {
                startRow = row1;
                endRow = row;
            }
            if (col > col1) {
                startCol = col1;
                endCol = col;
            }
            return new Range(startRow, startCol, endRow, endCol);
        }
        return new Range(row, col, row, col);
    }
    static with(ref) {
        const refs = ref.split(':');
        const [col, row] = expr2xy(refs[0]);
        if (refs.length === 1) {
            return this.create(row, col);
        }
        const [col1, row1] = expr2xy(refs[1]);
        return this.create(row, col, row1, col1);
    }
}
export function eachRanges(refs, callbackFn) {
    if (refs && refs.length > 0) {
        refs.forEach((ref) => {
            callbackFn(Range.with(ref));// 这里的Range.with()函数会返回一个Range对象 也就是本文件的default class
        });
    }
}
export function findRanges(refs, filter) {
    if (refs && refs.length > 0) {
        for (let ref of refs) {
            const r = Range.with(ref);
            if (filter(r))
                return r;
        }
    }
    return null;
}
