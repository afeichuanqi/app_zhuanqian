import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {bottomTheme} from '../appSet';

const {timing} = Animated;
export default class RadioComponent extends PureComponent {
    state = {
        Checked: this.props.Checked,
    };
    animations = {
        left: new Animated.Value(0),
    };
    _radioClick = () => {
        const {Checked} = this.state;

        if (!Checked) {
            // 滑动
            this.btn.setNativeProps({
                backgroundColor: bottomTheme,
            });
            this._anim = timing(this.animations.left, {
                duration: 200,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
            }).start(() => {
                this.setState({
                    Checked: true,
                });
                this.props.select(true);

            });
        } else {
            // 滑动
            this.btn.setNativeProps({
                backgroundColor: '#ececec',
            });
            this._anim = timing(this.animations.left, {
                duration: 200,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
            }).start(() => {
                this.setState({
                    Checked: false,
                });
                this.props.select(false);

            });
        }
    };
    setChecked = (check) => {
        if (check) {
            this.btn.setNativeProps({
                backgroundColor: bottomTheme,
            });
            this._anim = timing(this.animations.left, {
                duration: 200,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
            }).start(() => {
                this.setState({
                    Checked: true,
                });
                // this.props.select(this.state.Checked);

            });
        } else {
            this.btn.setNativeProps({
                backgroundColor: '#ececec',
            });
            this._anim = timing(this.animations.left, {
                duration: 200,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
            }).start(() => {
                this.setState({
                    Checked: false,
                });
                // this.props.select(this.state.Checked);

            });
        }

    };


    render() {
        const left = Animated.interpolate(this.animations.left, {
            inputRange: [0, 1],
            outputRange: [0, 30],
            extrapolate: 'clamp',
        });
        return <TouchableOpacity
            ref={ref => this.btn = ref}
            activeOpacity={1}
            onPress={this._radioClick}
            style={{
                width: 60, height: 30, borderRadius: 20, backgroundColor: '#ececec', borderWidth: 1,
                borderColor: '#e8e8e8',
            }}>
            <Animated.View style={{
                height: 30, width: 30, backgroundColor: 'white', borderRadius: 20, shadowColor: '#d9d9d9',
                shadowRadius: 5,
                shadowOpacity: 1,
                shadowOffset: {w: 1, h: 1},
                elevation: 3,
                left,
            }}/>

        </TouchableOpacity>;
    }
}
