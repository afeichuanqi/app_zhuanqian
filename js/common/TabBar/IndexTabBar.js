/* @flow */
/*
  首页美食推荐tab
  考虑到性能，和详情页弹窗tab分开写
  考虑到性能，tab子元素宽度未采用测量的方式，改由字数计算
*/
import React, { Component } from 'react';
import { ScrollView, View, Platform } from 'react-native';
import TabBarItem from './TabBarItem';
import TabBarIndicator from './TabBarIndicator';

type Props = {
  style?: Object,
  routes: Array<Object>,
  sidePadding?: number | null,
  titleMarginHorizontal: number,
  position: any,
  handleIndexChange: Function,
  indicatorStyle: Object,
  activeStyle: Object,
  inactiveStyle: Object,
  contentContainerStyle?: Object,
};

class TabBar extends Component<Props> {
  static defaultProps = {
    style: {},
    contentContainerStyle: {},
    sidePadding: null,
  }

  tabBarRef: ScrollView | null
  container: View | null
  inputRange: Array<number>
  outputRangeScrollViewTranslateX: Array<number>
  outputRangeIndicatorWidth: Array<number>
  outputRangeIndicatorTranslateX: Array<number>
  outputRangeTitleWidth: Array<number>
  scale: number


  constructor(props: Props) {
    super(props);
    const {
      routes, sidePadding: sidePaddingProps, activeStyle, inactiveStyle, titleMarginHorizontal,
    } = this.props;
    const middlePadding = titleMarginHorizontal / 2;
    const sidePadding = sidePaddingProps || (middlePadding);
    this.scale = activeStyle.fontSize / inactiveStyle.fontSize;
    this.inputRange = routes.map((v, i) => i);
    this.outputRangeScrollViewTranslateX = [];
    this.outputRangeIndicatorWidth = routes.map(v => v.title.length * inactiveStyle.fontSize * (Platform.OS === 'ios' ? 1 : 1.02));
    this.outputRangeTitleWidth = this.outputRangeIndicatorWidth.map((v, i) => {
      if (i === 0 || i === this.outputRangeIndicatorWidth.length - 1) {
        return v + sidePadding + middlePadding;
      }
      return v + titleMarginHorizontal;
    });
    this.outputRangeIndicatorTranslateX = this.outputRangeIndicatorWidth
      .reduce((arr, value, index) => [...arr, arr[index] + value + titleMarginHorizontal], [sidePadding]);
    this.outputRangeIndicatorTranslateX.pop();
  }

  shouldComponentUpdate(nextProps: Object) {
    const { routes, position } = this.props;
    if (JSON.stringify(nextProps.routes) !== JSON.stringify(routes)
      || nextProps.position !== position) {
      return true;
    }
    return false;
  }

  render() {
    const {
      style, routes, position, handleIndexChange, indicatorStyle, activeStyle, inactiveStyle, contentContainerStyle,
      sidePadding: sidePaddingProps, titleMarginHorizontal,
    } = this.props;
    const middlePadding = titleMarginHorizontal / 2;
    return (
      <View style={style}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          horizontal
          bounces={false}
        >
          {
            routes.map((item, index) => (
              <TabBarItem
                item={item}
                index={index}
                key={item.key}
                activeStyle={activeStyle}
                inactiveStyle={inactiveStyle}
                position={position}
                onPress={handleIndexChange}
                width={this.outputRangeTitleWidth[index]}
                inputRange={this.inputRange}
                isFirst={index === 0}
                middlePadding={middlePadding}
                isLast={index === this.inputRange.length - 1}
                sidePadding={sidePaddingProps || middlePadding}
              />
            ))
          }
          {
            routes.length > 0 && (
              <TabBarIndicator
                inputRange={this.inputRange}
                position={position}
                style={indicatorStyle}
                scale={this.scale}
                outputRangeWidth={this.outputRangeIndicatorWidth}
                outputRangeTranslateX={this.outputRangeIndicatorTranslateX}
              />
            )
          }
        </ScrollView>
      </View>
    );
  }
}

module.exports = TabBar;
