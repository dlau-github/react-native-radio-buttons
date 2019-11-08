'use strict';
import React from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  options: PropTypes.array.isRequired,
  testOptionEqual: PropTypes.func,
  renderOption: PropTypes.func,
  renderContainer: PropTypes.func,
  onSelection: PropTypes.func,
};

class RadioButtons extends React.Component {

  static getDerivedStateFromProps({selectedOption, selectedIndex}, state) {
    const newState = {};
    if (selectedOption !== state.selectedOption) {
      newState.selectedOption = selectedOption
    }

    if (selectedIndex !== state.selectedIndex) {
      newState.selectedIndex = selectedIndex
    }

    if (newState.selectedIndex || newState.selectedOption) {
      return newState;
    }

    // Return null to indicate no change to state.
    return null;
  }

  constructor() {
    super();
    this.state = {
      selectedOption: null,
      selectedIndex: null,
    };
  }

  copySelectedOptionFromProps({selectedOption, selectedIndex}) {
    this.setState({
      selectedOption,
      selectedIndex,
    });
  }

  componentDidMount() {
    this.copySelectedOptionFromProps(this.props);
  }

  selectOption(selectedOption, selectedIndex) {
    this.setState({
      selectedOption,
      selectedIndex,
    });
    this.props.onSelection(selectedOption, selectedIndex);
  }

  render() {
    const {selectedOption, selectedIndex} = this.state;

    const children = this.props.options.map(function (option, index) {
      const isSelected = selectedIndex === index || this.props.testOptionEqual(selectedOption, option);
      const onSelection = this.selectOption.bind(this, option, index);

      return this.props.renderOption(option, isSelected, onSelection, index);
    }.bind(this));

    return this.props.renderContainer(children);
  }

  static getTextOptionRenderer(normalStyle, selectedStyle, extractText) {
    return function renderOption(option, selected, onSelect, index) {
      const style = selected ? selectedStyle : normalStyle;
      const label = extractText ? extractText(option) : option;
      return (
        <TouchableWithoutFeedback onPress={onSelect} key={index}>
          <Text style={style}>{label}</Text>
        </TouchableWithoutFeedback>
      );
    };
  }

  static getViewContainerRenderer(style) {
    return function renderContainer(options) {
      return <View style={style}>{options}</View>;
    };
  }
}

RadioButtons.renderHorizontalContainer = RadioButtons.getViewContainerRenderer({
  flexDirection: 'row',
});

RadioButtons.renderVerticalContainer = RadioButtons.getViewContainerRenderer({
  flexDirection: 'column'
});

RadioButtons.defaultProps = {
  testOptionEqual(a, b) {
    return a === b;
  },
  renderOption: RadioButtons.getTextOptionRenderer({}, {fontWeight: 'bold'}),
  renderContainer: RadioButtons.renderVerticalContainer,
  onSelection(option) {
  }
};
RadioButtons.propTypes = propTypes;

module.exports = RadioButtons;
