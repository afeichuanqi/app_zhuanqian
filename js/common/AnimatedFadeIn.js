import React from 'react';
import {Animated} from 'react-native';

import propTypes from 'prop-types';

export default class AnimatedFadeIn extends React.PureComponent {
    static propTypes = {
        startValue: propTypes.number,
        endValue: propTypes.number,
        duration: propTypes.number,

    };
    static defaultProps = {
        startValue: 0,
        endValue: 1,
        duration: 800,

    }

    constructor(props) {
        super(props);
        this.state = {

        };
        this.fadeInOpacity=new Animated.Value(0),  // 透明度初始值设为0
        this.fadeInAnimated = Animated.timing(                       // 随时间变化而执行动画
            this.fadeInOpacity,            // 动画中的变量值
            {
                useNativeDriver: true,
                toValue: 1,                        // 透明度最终变为1，即完全不透明
                duration: this.props.duration,                   // 让动画持续一段时间
            }
        );
    }

    componentDidMount() {

        this.fadeInAnimated.start();

    }

    render() {

        const {startValue, endValue} = this.props;
        const rotateZ = this.fadeInOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [startValue, endValue]
        });
        return (
                <Animated.View                       // 使用专门的可动画化的View组件
                    style={{
                        ...this.props.style,
                        opacity: rotateZ,          // 将透明度指定为动画变量值
                    }}
                >
                    {this.props.children}
                </Animated.View>

        );
    }
}
