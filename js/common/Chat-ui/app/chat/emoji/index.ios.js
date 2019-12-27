import React, {PureComponent} from 'react';
import {View, Text,ScrollView, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, Image} from 'react-native';
import ViewPagerAndroidContainer from '../components/android-container';
import ViewPagerAndroid from '@react-native-community/viewpager';
import Control from './control';
import {EMOJIS_DATA, DEFAULT_EMOJI} from '../../source/emojis';

const {width, height} = Dimensions.get('window');

export default class EmojiPanel extends PureComponent {
    constructor(props) {
        super(props);
        const {allPanelHeight, isIphoneX, iphoneXBottomPadding} = props;
        this.totalHeight = allPanelHeight + (isIphoneX ? iphoneXBottomPadding : 0);
        this.state = {
            pageIndex: 0,
        };
        this.total = 0;
    }

    componentWillReceiveProps(nextProps, prveProps) {
    }

    switchComponent(e) {
        if (Platform.OS === 'ios') {
            let {x} = e.nativeEvent.contentOffset;
            let cardIndex = Math.round(x / width);
            if (x >= width / 2 && x < width / 2 + 10) {
                this.scroll.scrollTo({x: width * cardIndex, y: 0, animated: true});
            }
            this.setState({pageIndex: cardIndex});
        } else {
            let {position, offset} = e.nativeEvent;
            if (offset === 0) {
                this.setState({pageIndex: position});
            }
        }
    }

    render() {
        const {allPanelHeight, HeaderHeight} = this.props;
        const ContainerComponent = Platform.select({ios: ScrollView, android: ViewPagerAndroid});
        this.total = 0;
        return (
            <Animated.View style={[styles.container, {
                position: 'absolute',
                height: this.totalHeight,
                backgroundColor: '#f5f5f5',
                top: this.props.emojiHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, height - HeaderHeight - this.totalHeight],
                }),
                opacity: this.props.emojiHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
            }]}>
                <ViewPagerAndroidContainer style={{height: allPanelHeight, width}}>
                    {/* 视图容器 */}
                    <ContainerComponent
                        ref={e => {
                            this.scroll = e;
                        }}
                        onScroll={(e) => this.switchComponent(e)}
                        onPageScroll={(e) => this.switchComponent(e)}
                        horizontal
                        style={{flex: 1}}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        automaticallyAdjustContentInsets={false}
                        scrollEventThrottle={200}
                    >
                        {
                            DEFAULT_EMOJI.map((item, index) => {
                                    this.total += 1;
                                    if (index === 0) {
                                        return <View key={index} style={{
                                            width,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            paddingHorizontal: 20,
                                            marginTop: 18,
                                        }}>
                                            {
                                                item.map((list, i) =>
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        key={i}
                                                        style={{
                                                            width: (width - 40) / 8,
                                                            height: 45,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            paddingTop: 15,
                                                            paddingHorizontal: 20,
                                                        }}
                                                        onPress={() => {
                                                            this.props.onPress(list,index);
                                                        }
                                                        }
                                                    >
                                                        <Image source={list.value === '/{del}' ? null : EMOJIS_DATA[list.value]}
                                                               resizeMode={'contain'} style={{width: 30, height: 30}}/>
                                                    </TouchableOpacity>,
                                                )
                                            }
                                        </View>;
                                    }else {

                                        return <View key={index} style={{
                                            width,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            paddingHorizontal: 2,
                                            marginTop: 0,
                                            paddingVertical:20,
                                        }}>
                                            {
                                                item.map((list, i) =>{
                                                    return <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        key={i}
                                                        style={{
                                                            width: (Dimensions.get('window').width - 20)/4,
                                                            height: 30,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginHorizontal:2,
                                                            backgroundColor:'white',
                                                            // paddingHorizontal: 20,
                                                            marginBottom:5,
                                                        }}
                                                        onPress={() => {
                                                            this.props.onPress(list,index);
                                                        }
                                                        }
                                                    >
                                                        <Text style={{fontSize:12, opacity:0.8,color:'black'}}>{list.value}</Text>
                                                    </TouchableOpacity>
                                                }

                                                )
                                            }
                                        </View>;
                                    }

                                },
                            )
                        }
                    </ContainerComponent>
                    <View style={{height: 30}}>
                        <Control index={this.state.pageIndex} total={this.total}/>
                    </View>
                    {/* <View style={{height: 40, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center'}}> */}
                    {/* <View style={{width: 40, height: 40, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', padding: 5}}> */}
                    {/* /!*<Image source={defaultEmoji.default} style={{flex: 1}} resizeMode={'contain'} />*!/ */}
                    {/* </View> */}
                    {/* </View> */}
                </ViewPagerAndroidContainer>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
});
