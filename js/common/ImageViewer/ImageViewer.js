import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import Animated, {Easing} from 'react-native-reanimated';

const {
    divide,
    set,
    cond,
    startClock,
    stopClock,
    clockRunning,
    block,
    spring,
    add,
    Value,
    Clock,
    call,
    timing,
} = Animated;

function runSpring(clock, value, callback) {
    const state = {
        finished: new Value(0),
        finished1: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0),
    };

    const config = {
        toValue: new Value(0),
        damping: 55,
        mass: 1,
        stiffness: 500,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    };
    const sets = [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.velocity, 30),

    ];
    return block([
        cond(clockRunning(clock), 0, [
            [
                ...sets,
                set(config.toValue, -100),
                startClock(clock),
            ],
        ]),
        spring(clock, state, config),
        cond(state.finished,
            [
                cond(state.finished1, [call([state.position], (position) => {
                        // callback();
                    }), stopClock(clock)],
                    [
                        stopClock(clock),
                        ...sets,
                        set(config.toValue, 500),
                        set(state.finished1, 1),
                        startClock(clock),
                    ]),
            ]),
        state.position,
    ]);
}

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    };

    const config = {
        duration: 1500,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease),
    };

    return block([
        cond(
            clockRunning(clock),
            [
                set(config.toValue, dest),
            ],
            [
                set(state.finished, 0),
                set(state.time, 0),
                set(state.position, value),
                set(state.frameTime, 0),
                set(config.toValue, dest),
                startClock(clock),
            ],
        ),
        timing(clock, state, config),
        cond(state.finished, [stopClock(clock)]),
        state.position,
    ]);
}

let _opacity = new Value(1);
export default class Example extends Component {
    constructor(props) {
        super(props);
        const clock = new Clock();
        this._trans = runSpring(clock, 10);
        // this.runOpacity();

    }



    componentDidMount() {

    }

    render() {
        const opacity = Animated.interpolate(this._trans, {
            inputRange: [400, 500],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View
                style={[styles.container, {opacity: opacity}]}>
                <Animated.View style={[styles.box, {top: this._trans}]}/>
            </Animated.View>
        );
    }

// {top: this._trans}
}

const BOX_SIZE = 100;

const styles = StyleSheet.create({
    text: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fb628c',
        backgroundColor: '#2e13ff',
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderColor: '#f900ff',
        alignSelf: 'center',
        backgroundColor: '#19ff75',
        margin: BOX_SIZE / 2,
    },
});