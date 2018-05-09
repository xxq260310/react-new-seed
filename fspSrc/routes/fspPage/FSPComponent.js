import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import store from 'store';
import { fspRoutes } from '../../../src/config';
import api from '../../../src/api';
import Loading from '../../layouts/Loading';

import styles from './fspComponent.less';

import { os } from '../../../src/helper';

function findRoute(pathname) {
  return os.findBestMatch(pathname, fspRoutes, 'path');
}

export default class FSPComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { location: { pathname, state } } = props;
    this.getRouteConfig(pathname, state);
    this.getFspData();
    this.state = {
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname, state } } = nextProps;
    const { location } = this.props;
    if (location.pathname !== pathname || location.state !== state) {
      this.getRouteConfig(pathname, state);
      this.getFspData();
      this.setState({
        loading: true,
      });
      this.timeoutId = setTimeout(() => this.setState({ loading: false }), 10000);
    }
  }

  componentWillUnmount() {
    return this.timeoutId && clearTimeout(this.timeoutId);
  }

  @autobind
  onLoad() {
    this.setState({
      loading: false,
    });
  }

  @autobind
  getRouteConfig(pathname, state) {
    const routeConfig = findRoute(pathname);
    const localUrl = store.get(pathname);
    this.url = !localUrl ? routeConfig.url : localUrl;
    this.action = routeConfig.action;
    // 设置fsp页面容器的id，这个属性因为fsp原因，暂时需要
    this.containerId = routeConfig.containerId;
    // 修正后端接口，因为有些接口为动态接口
    if (state && state.url) {
      this.url = state.url;
      store.set(pathname, state.url);
    }
  }

  @autobind
  getFspData() {
    // 如果请求的是html文档
    if (this.action === 'loadInTab') {
      // 请求html数据并进行插入
      api
        .getFspData(this.url)
        .then((data) => {
          // 这里之所以使用juery来处理，是因为浏览器在识别innerHTML嵌套插入script元素时，不能正确识别
          // 所以使用juery方法提前将字符串处理为node元素
          const node = $(data);

          // 由于上面获取的node元素可能为数组，原生DOM插入方法不支持直接插入多个node元素
          // 所以这里同样借助juery的方法
          const jqelem = $(this.elem);
          jqelem.empty();
          jqelem.attr('id', this.containerId);
          jqelem.append(node);
          this.setState({
            loading: false,
          });
        });
    }
  }

  render() {
    return (
      <div className={styles.fspContainer}>
        <Loading loading={this.state.loading} />
        {
          this.action === 'loadInTab' ?
            <div className={styles.fspContent} ref={ref => this.elem = ref} /> :
            <iframe className={styles.iframe} onLoad={this.onLoad} src={this.url} frameBorder="0">
              你的浏览器不支持iframe,请升级或者更换浏览器
            </iframe>
        }
      </div>
    );
  }
}

FSPComponent.propTypes = {
  location: PropTypes.object.isRequired,
};
