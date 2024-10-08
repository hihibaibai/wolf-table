export default class ScrollBar {
  vScrollBar;
  hScrollBar;
  vWeight;
  vWeightHeight;
  hWeight;
  hWeightWidth;
  table;
  tableWidth;
  tableHeight;
  data;
  viewport = [0,0,0,0];// 这个是控制的是可以滚动部分的区域，冻结部分不在这里的

  constructor(container, width, height, table) {
    let {data} = table;
    this.tableWidth = width;
    this.tableHeight = height;
    this.vWeightHeight = height + data.rowHeight * 3;
    this.hWeightWidth = width + data.colWidth * 3;
    this.createVerticalScrollBar(container,height);
    this.createHorizontalScrollBar(container,width);
    this.setData(data);
    const handleMouseWheelEvent = (e)=>{
      // 这里绑定滚轮滚动事件，scrollTop改变后会出发滚动条的scroll事件，改变滚动条高宽的函数统一在那边改
      if (e.deltaY > 0) {
        this.vScrollBar.scrollTop = this.vScrollBar.scrollTop + data.rowHeight*3;
      }
      else {
        this.vScrollBar.scrollTop = this.vScrollBar.scrollTop - data.rowHeight*3;
      }
      if (e.deltaX > 0) {
        this.hScrollBar.scrollLeft = this.hScrollBar.scrollLeft + data.colWidth*3;
      }
      else {
        this.hScrollBar.scrollLeft = this.hScrollBar.scrollLeft - data.colWidth*3;
      }
    }
    container.addEventListener('wheel', handleMouseWheelEvent);
    const handleScrollEvent = (e) => {
      // 这里要注意，滚轮滚动的时候，这个函数也会触发
      console.log(e);
      let scrollTop = this.vScrollBar.scrollTop;
      let scrollLeft = this.hScrollBar.scrollLeft;
      let windowHeight = parseInt(this.vScrollBar.style.height);
      let windowWidth = parseInt(this.hScrollBar.style.width);
      let contentHeight = this.vWeightHeight;
      let contentWidth = this.hWeightWidth;
      if (scrollTop + windowHeight >= contentHeight) {
        this.vWeightHeight = this.vWeightHeight + data.rowHeight*3;
        this.vWeight.style.setProperty('height', `${this.vWeightHeight}px`);
      }
      if (scrollLeft + windowWidth >= contentWidth) {
        this.hWeightWidth = this.hWeightWidth + data.colWidth*3;
        this.hWeight.style.setProperty('width', `${this.hWeightWidth}px`);
      }
      // 这里要更新viewport
      let heightStartIndex = this.getTopHeightIndex(scrollTop);
      let widthStartIndex = this.getLeftWidthIndex(scrollLeft);
      let hRange = this.viewport[3] - this.viewport[1];
      this.viewport[1] = heightStartIndex;
      this.viewport[3] = this.viewport[1] + hRange;
      let wRange = this.viewport[2] - this.viewport[0];
      this.viewport[0] = widthStartIndex;
      this.viewport[2] = widthStartIndex + wRange;
      table.render();
      table.selector.renderSelect();
    }
    this.vScrollBar.addEventListener('scroll', handleScrollEvent);
    this.hScrollBar.addEventListener('scroll', handleScrollEvent);
  }

  createVerticalScrollBar(container, height) {
    let element = document.createElement('div');
    element.style.setProperty('height', `${height}px`);
    element.style.setProperty('display', 'block');
    element.style.setProperty('width', '15px');
    element.style.setProperty('bottom', '0');
    element.style.setProperty('overflow-x', 'hidden');
    element.style.setProperty('overflow-y', 'scroll');
    element.style.setProperty('position', 'absolute');
    element.style.setProperty('right', '0');
    element.style.setProperty('background-color', '#f4f5f8');
    element.style.setProperty('opacity', '0');
    let weight = document.createElement('div');
    weight.style.setProperty('height', `${this.vWeightHeight}px`);// 这个值需要在外面确定好
    weight.style.setProperty('width', '1px');
    weight.style.setProperty('background', '#ddd');
    this.vWeight = weight;
    element.append(weight);
    container.append(element);
    element.addEventListener('mouseover', () => {
      element.style.setProperty('opacity', '0.8');
    });
    element.addEventListener('mouseout', () => {
      element.style.setProperty('opacity', '0');
      // element.style.setProperty('opacity', '1');
    });
    this.vScrollBar = element;
  }

  createHorizontalScrollBar(container, width) {
    let element = document.createElement('div');
    element.style.setProperty('width', `${width}px`);
    element.style.setProperty('display', 'block');
    element.style.setProperty('height', '15px');
    element.style.setProperty('right', '0');
    element.style.setProperty('overflow-x', 'scroll');
    element.style.setProperty('overflow-y', 'hidden');
    element.style.setProperty('position', 'absolute');
    element.style.setProperty('bottom', '0');
    element.style.setProperty('background-color', '#f4f5f8');
    element.style.setProperty('opacity', '0');
    let weight = document.createElement('div');
    weight.style.setProperty('width', `${this.hWeightWidth}px`);// 这个值需要在外面确定好
    weight.style.setProperty('height', '1px');
    weight.style.setProperty('background', '#ddd');
    this.hWeight = weight;
    element.append(weight);
    container.append(element);
    element.addEventListener('mouseover', () => {
      element.style.setProperty('opacity', '0.8');
    });
    element.addEventListener('mouseout', () => {
      element.style.setProperty('opacity', '0');
    });
    this.hScrollBar = element;
  }

  setData(data) {
    this.data = data;
    // 计算初始viewport
    const viewportHeight = parseInt(this.vScrollBar.style.height);
    const viewportWidth = parseInt(this.hScrollBar.style.width);
    let i = 0;
    let height = 0;
    let width = 0;
    while (true) {
      if (data.rows[i]) {
        height = height + data.rows[i];
      }
      else {
        height = height + data.rowHeight;
      }
      i++;
      if (height >= viewportHeight) {
        break;
      }
    }
    this.viewport[3] = i;
    i = 0;
    while (true) {
      if (data.cols[i]) {
        width = width + data.cols[i];
      }
      else {
        width = width + data.colWidth;
      }
      i++;
      if (width >= viewportWidth) {
        break;
      }
    }
    this.viewport[2] = i;
  }

  getViewport() {
    return this.viewport;
  }

  getTopHeightIndex(height){
    let {rows,rowHeight} = this.data;
    let i = 0;
    let heightOffset = 0;
    while (true) {
      if (height <= heightOffset) {
        break;
      }
      if (rows[i]) {
        heightOffset = heightOffset + rows[i];
        i++;
      }
      else {
        heightOffset = heightOffset + rowHeight;
        i++;
      }
    }
    return i;
  }

  getLeftWidthIndex(width) {
    let {cols,colWidth} = this.data;
    let i = 0;
    let widthOffset = 0;
    while (true) {
      if (width <= widthOffset) {
        break;
      }
      if (cols[i]) {
        widthOffset = widthOffset + cols[i];
        i++;
      }
      else {
        widthOffset = widthOffset + colWidth;
        i++;
      }
    }
    return i;
  }

  /**
   * 这里的xOffset和yOffset并不只是数据部分的，也包括header部分的.
   * 返回值中的placemen可能的值为row-header,col-header,body,all这4种
   * @param xOffset
   * @param yOffset
   * @returns {{x: number, y: number, placement: string}}
   */
  getCellIndexByXYOffset(xOffset, yOffset) {
    let cellPosition = {};
    let {headerWidth,headerHeight} = this.data;
    let width = xOffset - headerWidth;
    let height = yOffset - headerHeight;
    if (width < 0) {
      width = 0;
    }
    if (height < 0) {
      height = 0;
    }
    if (xOffset < headerWidth && yOffset < headerHeight) {
      return cellPosition;
    }
    if (xOffset < headerWidth && yOffset > headerHeight) {
      cellPosition.placement = 'row-header';
      cellPosition.y = this.getTopHeightIndex(height);
      cellPosition.y = cellPosition.y - 1 < 0 ? 0 : cellPosition.y - 1;
    }
    if (xOffset > headerWidth && yOffset < headerHeight) {
      cellPosition.placement = 'col-header';
      cellPosition.x = this.getLeftWidthIndex(width);
      cellPosition.x = cellPosition.x - 1 < 0 ? 0 : cellPosition.x - 1;
    }
    if (xOffset > headerWidth && yOffset > headerHeight) {
      cellPosition.placement = 'body';
      cellPosition.x = this.getLeftWidthIndex(width);
      cellPosition.x = cellPosition.x - 1 < 0 ? 0 : cellPosition.x - 1;
      cellPosition.y = this.getTopHeightIndex(height);
      cellPosition.y = cellPosition.y - 1 < 0 ? 0 : cellPosition.y - 1;
    }
    return cellPosition;
  }

  getXYOffsetWidthHeightByCell(xIndex,yIndex) {
    let leftValue = 0;
    let topValue = 0;
    let widthValue = 0;
    let heightValue = 0;
    let widthCount = 0;
    let heightCount = 0;
    let x = this.viewport[0];
    let y = this.viewport[1];
    while (this.tableWidth - widthCount >= 0) {
      let cellWidth = 0;
      if (this.data.cols[x]) {
        cellWidth = this.data.cols[x];
      } else {
        cellWidth = this.data.colWidth;
      }
      if (x === xIndex) {
        leftValue = widthCount;
        widthValue = cellWidth;
        break;
      }
      widthCount = widthCount + cellWidth;
      x++;
    }
    while (this.tableHeight - heightCount >= 0) {
      let cellHeight = 0;
      if (this.data.rows[y]) {
        cellHeight = this.data.rows[y];
      } else {
        cellHeight = this.data.rowHeight;
      }
      if (y === yIndex) {
        topValue = heightCount;
        heightValue = cellHeight;
        break;
      }
      heightCount = heightCount + cellHeight;
      y++;
    }
    // console.log(leftValue, topValue, widthValue, heightValue);
    if (widthValue === 0 || heightValue === 0) {
      return null;
    }
    return {leftValue, topValue, widthValue, heightValue};
  }

  getXYOffsetWidthHeightByIndexRange(sx, sy, ex, ey) {
    // console.log(sx,sy,ex,ey)
    let leftValue = 0;
    let topValue = 0;
    let widthValue = 0;
    let heightValue = 0;
    let widthCount = 0;
    let heightCount = 0;
    let x = this.viewport[0];
    let y = this.viewport[1];
    while (this.tableWidth - widthCount >= 0) {
      let cellWidth = 0;
      if (this.data.cols[x]) {
        cellWidth = this.data.cols[x];
      } else {
        cellWidth = this.data.colWidth;
      }
      if (x < sx) {
        leftValue = leftValue + cellWidth;
      }
      if (x >= sx) {
        widthValue = widthValue + cellWidth;
      }
      if (x >= ex) {
        break;
      }
      widthCount = widthCount + cellWidth;
      x++;
    }
    while (this.tableHeight - heightCount >= 0) {
      let cellHeight = 0;
      if (this.data.rows[y]) {
        cellHeight = this.data.rows[y];
      } else {
        cellHeight = this.data.rowHeight;
      }
      if (y < sy) {
        topValue = topValue + cellHeight;
      }
      if (y >= sy) {
        heightValue = heightValue + cellHeight;
      }
      if (y >= ey) {
        break;
      }
      heightCount = heightCount + cellHeight;
      y++;
    }
    // console.log(leftValue, topValue, widthValue, heightValue);
    return {leftValue, topValue, widthValue, heightValue};
  }
};