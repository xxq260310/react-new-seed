/**
 * @fileOverview IECharts/wrapper.js
 * @author sunweibin
 * @description copy别人的然后进行修改
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Resize from 'element-resize-detector';


function wrapECharts(ECharts) {
  class IECharts extends PureComponent {

    static propTypes = {
      className: PropTypes.string,
      style: PropTypes.object,
      theme: PropTypes.string,
      group: PropTypes.string,
      option: PropTypes.object.isRequired,
      initOpts: PropTypes.object,
      notMerge: PropTypes.bool,
      lazyUpdate: PropTypes.bool,
      loading: PropTypes.bool,
      optsLoading: PropTypes.object,
      onReady: PropTypes.func,
      resizable: PropTypes.bool,
      onEvents: PropTypes.object,
      onDispatch: PropTypes.object,
    }

    static defaultProps = {
      className: 'react-echarts',
      style: {
        width: '100%',
        height: '100%',
      },
      notMerge: false,
      lazyUpdate: false,
      onReady: () => { },
      loading: false,
      resizable: false,
      onEvents: {},
      onDispatch: {},
      initOpts: {},
      optsLoading: {},
      group: '',
      theme: '',
    }

    constructor(props) {
      super(props);
      this.state = {
        fnResize: null,
        resize: null,
        instance: null,
      };
    }

    // componentWillMount() {
    // const that = this;
    // }
    componentDidMount() {
      this.myInit();
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.instance && (this.props.loading !== nextProps.loading)) {
        if (nextProps.loading) {
          this.state.instance.showLoading('default', this.props.optsLoading);
        } else {
          this.state.instance.hideLoading();
        }
      }
    }
    shouldComponentUpdate(nextProps) {
      return (!this.state.instance
        || !_.isEqual(nextProps.option, this.props.option)
        || (nextProps.group !== this.props.group)
      );
      // return (that.state.init || !_isEqual(nextProps.option, that.props.option));
    }

    // componentWillUpdate(nextProps, nextState) {
    // const that = this;
    // }
    componentDidUpdate() {
      if (this.props.option) {
        this.myupdate();
        this.myresize();
      }
    }
    componentWillUnmount() {
      if (this.state.resize && this.state.resize.uninstall) {
        // const dom = ReactDOM.findDOMNode(this);
        const dom = this.chartBox;
        this.state.resize.uninstall(dom);
      }
      if (this.state.fnResize && this.state.fnResize.cancel) {
        this.state.fnResize.cancel();
      }
      if (this.state.instance) {
        this.state.instance.dispose();
      }
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.dispose();
      // }
    }
    @autobind
    myInit() {
      const that = this;
      // let instance = that._getInstance();
      // if (!instance) {
      if (!that.state.instance) {
        const dom = this.chartBox;
        // const dom = ReactDOM.findDOMNode(that);
        let instance = ECharts.getInstanceByDom(dom);
        if (!instance) {
          instance = ECharts.init(dom, that.props.theme, that.props.initOpts);
        }
        if (that.props.loading) {
          instance.showLoading('default', that.props.optsLoading);
        } else {
          instance.hideLoading();
        }
        instance.group = that.props.group;
        that.mybind(instance);
        // Resize(dom, that._resize);
        let resize = null;
        const fnResize = that.state.fnResize || _.debounce(that.myresize, 250, {
          leading: true,
          trailing: true,
        });
        if (that.props.resizable) {
          resize = that.state.resize || Resize({
            strategy: 'scroll',
          });
          resize.listenTo(dom, () => fnResize());
        }
        that.props.onReady(instance);
        that.setState({
          resize,
          fnResize,
          instance,
        });
      }
    }
    @autobind
    myupdate() {
      const that = this;
      that.state.instance.setOption(that.props.option, that.props.notMerge, that.props.lazyUpdate);
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.setOption(that.props.option, that.props.notMerge, that.props.lazyUpdate);
      // }
    }
    @autobind
    myresize() {
      const that = this;
      if (that.state.instance) {
        that.state.instance.resize();
      }
      // const instance = that._getInstance()
      // if (instance) {
      //   instance.resize();
      // }
    }
    /**
     * 提供当前echarts实例给外部
     */
    @autobind
    getChartsInstance() {
      return this.state.instance;
    }
    @autobind
    mygetInstance() {
      return ECharts.getInstanceByDom(this.chartBox);
      // return ECharts.getInstanceByDom(ReactDOM.findDOMNode(that));
    }
    @autobind
    mybind(instance) {
      const that = this;
      const on = (name, func) => {
        if (typeof func === 'function') {
          const newfunc = func.bind(instance);
          instance.off(name, newfunc);
          instance.on(name, newfunc);
        }
      };
      const dispatchAction = (payload) => {
        instance.dispatchAction(payload);
      };
      const events = Object.keys(that.props.onEvents);
      for (let i = 0; i < events.length; i++) {
        if (Array.hasOwnProperty.call(that.props.onEvents, events[i])) {
          on(events[i].toLowerCase(), that.props.onEvents[events[i]]);
        }
      }

      const payload = that.props.onDispatch;
      dispatchAction(payload);
    }
    render() {
      const that = this;
      const { className, style } = that.props;

      return (
        <div className={className} style={style} ref={(input) => { this.chartBox = input; }} />
      );
    }
  }

  return IECharts;
}

export default wrapECharts;
