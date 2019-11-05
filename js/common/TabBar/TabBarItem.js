/* @flow */
import React, { PureComponent } from 'react';
import Animated from 'react-native-reanimated';

type Props = {
  item: Object,
  index: number,
  position: any,
  onPress: Function,
  width: number,
  isFirst: boolean,
  isLast: boolean,
  activeStyle: Object,
  inactiveStyle: Object,
  sidePadding: number,
  middlePadding: number,
};

class TabBarItem extends PureComponent<Props> {
  render() {
    const {
      item, index, position, onPress, width, activeStyle, inactiveStyle, sidePadding, isFirst, isLast, middlePadding,
    } = this.props;
    const inputRange = isFirst ? [0, 1] : isLast ? [index - 1, index] : [index - 1, index, index + 1];
    const R = inputRange.length > 1 ? Animated.round(
      Animated.interpolate(position, {
        inputRange,
        outputRange: isFirst
          ? [activeStyle.color[0], inactiveStyle.color[0]] : isLast
            ? [inactiveStyle.color[0], activeStyle.color[0]] : [inactiveStyle.color[0], activeStyle.color[0], inactiveStyle.color[0]],
        extrapolate: 'clamp',
      }),
    ) : activeStyle.color[0];
    // const G = inputRange.length > 1 ? Animated.round(
    //   Animated.interpolate(position, {
    //     inputRange,
    //     outputRange: isFirst
    //       ? [activeStyle.color[1], inactiveStyle.color[1]] : isLast
    //         ? [inactiveStyle.color[1], activeStyle.color[1]] : [inactiveStyle.color[1], activeStyle.color[1], inactiveStyle.color[1]],
    //     extrapolate: 'clamp',
    //   }),
    // ) : activeStyle.color[1];
    // const B = inputRange.length > 1 ? Animated.round(
    //   Animated.interpolate(position, {
    //     inputRange,
    //     outputRange: isFirst
    //       ? [activeStyle.color[2], inactiveStyle.color[2]] : isLast
    //         ? [inactiveStyle.color[2], activeStyle.color[2]] : [inactiveStyle.color[2], activeStyle.color[2], inactiveStyle.color[2]],
    //     extrapolate: 'clamp',
    //   }),
    // ) : activeStyle.color[2];
    const color = Animated.color(R, R, R);
    const scaleActive = activeStyle.fontSize / inactiveStyle.fontSize;
    const scale = inputRange.length > 1 ? Animated.interpolate(position, {
      inputRange,
      outputRange: isFirst ? [scaleActive, 1] : isLast ? [1, scaleActive] : [1, scaleActive, 1],
      extrapolate: 'clamp',
    }) : scaleActive;

    return (
      <Animated.Text
        onPress={() => onPress(index)}
        suppressHighlighting
        style={{
          padding: 0,
          includeFontPadding: false,
          fontSize: inactiveStyle.fontSize,
          width,
          color,
          transform: [{ scale }],
          textAlign: 'center',
          paddingLeft: isFirst ? sidePadding - middlePadding : 0,
          paddingRight: isLast && index !== 0 ? sidePadding - middlePadding : 0,
        }}
      >
        {item.title}
      </Animated.Text>
    );
  }
}

module.exports = TabBarItem;
