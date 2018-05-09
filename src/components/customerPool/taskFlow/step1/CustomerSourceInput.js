/**
 * @file customerPool/taskFlow/CustomerSourceInput.js
 *  客户池-自建任务表单-导入客户-客户来源输入
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 20,
  },
};

@Form.create()
export default class CustomerSourceInput extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    defaultValue: '',
  }

  render() {
    const {
      defaultValue,
      form: { getFieldDecorator },
    } = this.props;
    console.log('defaultValue>>>', defaultValue);
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="客户来源说明："
        >
          {getFieldDecorator('source', {
            initialValue: defaultValue,
            rules: [{
              required: true, message: '请填写对筛选客户的来源说明',
            }],
          })(
            <Input.TextArea
              placeholder="对筛选客户的来源说明"
              autosize={{ minRows: 3, maxRows: 5 }}
            />,
          )}
        </FormItem>
      </Form>
    );
  }
}
