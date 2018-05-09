/**
 * @description 自定义滚动条事件，为了滚动事件的可以冒泡
 * @author sunweibin
 */

class Scroll {
  constructor(dom, options) {
    this.options = options || { step: 200, f: 0.2 };
    // 滚动设置DOM对象
    this.dom = dom;
    // 每次滚动位移
    this.step = this.options.step;
    // 缓动系数
    this.f = this.options.f;
    // 滚动计时
    this.interval = 10;
    this.intervalID = null;
    // 判断是否FireFox
    this.isFF = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
    // 往上滚还是往下滚
    this.upOrDown = '';
    // 调用初始化方法
    this.init();
  }

  // 滚动
  doScroll() {
    const dom = this.dom;
    clearInterval(this.intervalID);
    // 目标位置
    const tar = dom.scrollTop + (this.step * (this.upOrDown === 'up' ? -1 : 1));
    this.intervalID = setInterval(() => {
      // 缓动
      this.dom.scrollTop += (tar - dom.scrollTop) * this.f;
      if (tar === dom.scrollTop) {
        clearInterval(this.intervalID);
      }
    }, this.interval);
  }

  // 滚动事件处理
  handleScroll(e) {
    if (this.isFF) {
      this.upOrDown = e.detail < 0 ? 'up' : 'down';
    } else {
      this.upOrDown = e.wheelDelta > 0 ? 'up' : 'down';
    }
    this.doScroll();
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    // if (e.preventDefault) {
    //   e.preventDefault();
    // } else {
    //   e.returnValue = false;
    // }
  }

  // 添加事件处理
  addEvent() {
    const isFF = this.isFF;
    const dom = this.dom;
    const eventType = isFF ? 'DOMMouseScroll' : 'mousewheel';
    dom.addEventListener(eventType, this.handleScroll.bind(this), false);
  }

  // 初始化
  init() {
    this.addEvent();
  }
}

export default Scroll;
