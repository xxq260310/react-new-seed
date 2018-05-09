import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';

import MoveCard from './MoveCard';

const style = {
  width: '100%',
};

@DragDropContext(HTML5Backend)
export default class MoveContainer extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    isSum: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    onDnd: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const data = props.data;
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: data,
    };
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (!_.isEqual(props, nextProps)) {
      const data = nextProps.data;
      this.setState({
        cards: data,
      });
    }
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];
    const { onDnd } = this.props;
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }), () => {
      onDnd(this.state.cards);
    });
  }

  render() {
    const { cards } = this.state;
    const { onRemove } = this.props;
    return (
      <div style={style}>
        {cards.map((card, i) => (
          <MoveCard
            data={card}
            key={`${card.key}Card`}
            index={i}
            text={card.name}
            moveCard={this.moveCard}
            onRemove={onRemove}
          />
        ))}
      </div>
    );
  }
}
