
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import BoardSelectTree from '../Edit/BoardSelectTree';
import styles from './modalCommon.less';
import logable from '../../decorators/logable';

export default class SelectTreeModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    summuryLib: PropTypes.object.isRequired,
    saveIndcatorToHome: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
    confirm: () => {},
  }

  constructor(props) {
    super(props);
    const { visible, summuryLib } = props;
    this.state = {
      modalVisible: visible,
      summuryLib: _.cloneDeep(summuryLib),
      btnStatus: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, summuryLib } = nextProps;
    const { visible: preVisible, summuryLib: preSummuryLib } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
      });
    }
    if (!_.isEqual(summuryLib, preSummuryLib)) {
      this.setState({
        summuryLib: _.cloneDeep(summuryLib),
        summuryKeys: summuryLib.checkedKeys,
      });
    }
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  closeSelectTreeModal() {
    const { modalKey, closeModal } = this.props;
    closeModal(modalKey);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
  saveSelectTreeModal() {
    const { summuryIndicator } = this.state;
    const { saveIndcatorToHome } = this.props;
    // 调用接口保存数据
    saveIndcatorToHome(summuryIndicator);
    // 隐藏Modal
    this.closeSelectTreeModal();
  }
  @autobind
  saveIndcator(type, indicators) {
    if (type === 'summury') {
      const btnStatus = indicators.length < 4;
      // console.warn('save summuryKeys', summuryKeys);
      // if (_.isEqual(summuryKeys, indicators)) {
      //   btnStatus = true;
      // }
      this.setState({
        summuryIndicator: indicators,
        btnStatus,
      });
    } else {
      this.setState({
        detailIndicator: indicators,
      });
    }
  }

  render() {
    const { modalVisible, summuryLib, btnStatus } = this.state;
    const { modalCaption } = this.props;
    const newSummury = _.cloneDeep(summuryLib);
    return (
      modalVisible ?
        <Modal
          title={modalCaption}
          visible={modalVisible}
          closeable
          onCancel={this.closeSelectTreeModal}
          maskClosable={false}
          wrapClassName={styles.selectTreeModal}
          footer={[
            <Button
              key="back"
              size="large"
              onClick={this.closeSelectTreeModal}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="large"
              disabled={btnStatus}
              onClick={this.saveSelectTreeModal}
            >
              确认
            </Button>,
          ]}
        >
          {
            modalVisible ?
              <BoardSelectTree
                data={newSummury}
                lengthLimit
                saveIndcator={this.saveIndcator}
              />
            :
              null
          }
        </Modal>
      :
        null
    );
  }
}
