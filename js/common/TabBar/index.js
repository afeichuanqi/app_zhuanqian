/* @flow */
/*
  详情页弹窗tab
  考虑到性能，和首页tab分开写
  考虑到性能，tab子元素宽度未采用测量的方式，改由字数计算
*/
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import Animated from 'react-native-reanimated';
import TabBarItem from './TabBarItem';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type Props = {
  style?: Object,
  routes: Array<Object>,
  index: number,
  sidePadding?: number | null,
  titleMarginHorizontal: number,
  position: any,
  handleIndexChange: Function,
  activeStyle: Object,
  inactiveStyle: Object,
  contentContainerStyle?: Object,
  bounces?: boolean,
  centerActiveItem?: boolean,
  indicatorStyle: Object,
};

class TabBar extends Component<Props> {
  static defaultProps = {
    style: {},
    contentContainerStyle: {},
    bounces: true,
    centerActiveItem: true,
    sidePadding: null,
  }

  tabBarRef: AnimatedFlatList
  inputRange: Array<number>
  outputRangeTitleWidth: Array<number>
  inactiveFontColors: Array<number>
  scale: number
  scrollX: any
  offset: Array<number>
  outputRangeIndicatorWidth: Array<number>
  outputRangeIndicatorTranslateX: Array<number>

  constructor(props: Props) {
    super(props);
    const {
      routes, sidePadding: sidePaddingProps, activeStyle, inactiveStyle, titleMarginHorizontal,
    } = this.props;
    const middlePadding = titleMarginHorizontal / 2;
    const sidePadding = sidePaddingProps || (middlePadding);
    this.scale = activeStyle.fontSize / inactiveStyle.fontSize;
    this.inputRange = routes.map((v, i) => i);
    this.outputRangeIndicatorWidth = [];
    this.outputRangeTitleWidth = routes.map((v, i) => {
      const lettersNum = (v.title.match(/[a-z]|[A-z]/g) || []).length;
      const fontWidth = (v.title.length - lettersNum) * inactiveStyle.fontSize + lettersNum * inactiveStyle.fontSize * 0.67;
      this.outputRangeIndicatorWidth.push(fontWidth);
      if (i === 0 || i === routes.length - 1) {
        return fontWidth + sidePadding + middlePadding;
      }
      return fontWidth + titleMarginHorizontal;
    });
    this.offset = this.outputRangeTitleWidth.reduce((arr, value, index) => [...arr, arr[index] + value], [0]);
    this.offset.pop();
    this.outputRangeIndicatorTranslateX = this.outputRangeIndicatorWidth
      .reduce((arr, value, index) => [...arr, arr[index] + value + titleMarginHorizontal], [sidePadding]);
    this.outputRangeIndicatorTranslateX.pop();
    this.scrollX = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps: Object) {
    const { index, centerActiveItem } = this.props;
    if (!centerActiveItem) {
      return;
    } if (nextProps.index !== index && this.tabBarRef) {
      this.tabBarRef._component.scrollToIndex({ index: nextProps.index, viewPosition: 0.5 });
    }
  }

  shouldComponentUpdate(nextProps: Object) {
    const { routes, position } = this.props;
    if (JSON.stringify(nextProps.routes) !== JSON.stringify(routes)
      || nextProps.position !== position) {
      return true;
    }
    return false;
  }

  onLayout = () => {
    const { index, centerActiveItem } = this.props;
    if (!centerActiveItem) {
      return;
    } if (this.tabBarRef) {
      this.tabBarRef._component.scrollToIndex({ index, viewPosition: 0.5, animated: false });
    }
  }

  tabBar = (v: any) => {
    this.tabBarRef = v;
  }

  renderItem = ({ item, index }: { item: Object, index: number }) => {
    const {
      sidePadding, titleMarginHorizontal, handleIndexChange, activeStyle, inactiveStyle, position,
    } = this.props;
    const middlePadding = titleMarginHorizontal / 2;
    return (
      <TabBarItem
        item={item}
        index={index}
        key={item.key}
        activeStyle={activeStyle}
        inactiveStyle={inactiveStyle}
        position={position}
        onPress={handleIndexChange}
        middlePadding={middlePadding}
        width={this.outputRangeTitleWidth[index]}
        inputRange={this.inputRange}
        isFirst={index === 0}
        isLast={index === this.inputRange.length - 1}
        sidePadding={sidePadding || middlePadding}
      />
    );
  }

  render() {
    const {
      style, routes, contentContainerStyle, bounces, indicatorStyle, position,
    } = this.props;
    const translateX = this.inputRange.length > 1 ? Animated.interpolate(position, {
      inputRange: this.inputRange,
      outputRange: this.outputRangeIndicatorTranslateX,
      extrapolate: 'clamp',
    }) : this.outputRangeIndicatorTranslateX[0];
    const width = this.inputRange.length > 1 ? Animated.interpolate(position, {
      inputRange: this.inputRange,
      outputRange: this.outputRangeIndicatorWidth,
      extrapolate: 'clamp',
    }) : this.outputRangeIndicatorWidth[0];
    return (
      <View style={style}>
        <AnimatedFlatList
          renderItem={this.renderItem}
          data={routes}
          ref={this.tabBar}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          horizontal
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }])}
          onLayout={this.onLayout}
          initialNumToRender={5}
          scrollEventThrottle={1}
          removeClippedSubviews={false}
          getItemLayout={(data, i) => ({ length: this.outputRangeTitleWidth[i], offset: this.offset[i], index: i })}
          bounces={bounces}
          keyExtractor={(item, index) => `tab-bar-${index}`}
        />
        <Animated.View style={[indicatorStyle, { transform: [{ translateX: Animated.sub(translateX, this.scrollX), scaleX: this.scale }], width }]} />
      </View>
    );
  }
}

module.exports = TabBar;
