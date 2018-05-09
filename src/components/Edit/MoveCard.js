import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon } from 'antd';
import { autobind } from 'core-decorators';

import styles from './MoveCard.less';

const ItemTypes = {
  CARD: 'card',
};

const cardSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const newMonitor = monitor;
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect =
      component.decoratedComponentInstance.findNodeRef().getBoundingClientRect();

    // Get vertical middle
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // 取出移动的左右距离
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;
    // 取出中间值
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    // 用左右移动的距离来进行排序
    // console.warn('hoverClientY', `${hoverClientX} , ${hoverMiddleX}`);
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    newMonitor.getItem().index = hoverIndex;
  },
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class MoveCard extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  @autobind
  setTagRef(node) {
    this.selectItem = node;
  }
  @autobind
  findNodeRef() {
    return this.selectItem;
  }
  render() {
    const {
      text,
      isDragging,
      connectDragSource,
      connectDropTarget,
      data,
      data: { parentName },
      onRemove,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return connectDragSource(connectDropTarget(
      <a
        className={styles.selectItem}
        style={{ opacity }}
        ref={this.setTagRef}
      >
        {
          parentName ?
            `${parentName} - ${text}`
          :
            `${text}`
        }
        <Icon type="close" onClick={() => onRemove(data)} />
      </a>,
    ));
  }
}
