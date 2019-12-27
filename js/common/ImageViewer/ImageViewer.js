import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';

const {
    Clock,
    Value,
    set,
    cond,
    startClock,
    clockRunning,
    stopClock,
    block,
    spring,
    SpringUtils,
    debug
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(1),
        position: new Value(0),
        time: new Value(0),
        velocity: new Value(0),
    };

    const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
        ...SpringUtils.makeDefaultConfig(),
        bounciness: 20,
        speed: 8,
    });

    return block([
        cond(
            clockRunning(clock),
            [
                // if the clock is already running we update the toValue, in case a new dest has been passed in

            ],
            [
                state.finished,
                [
                    set(state.finished, 0),
                    set(state.position, value),
                    set(config.toValue, dest),
                    startClock(clock),
                ],
            ],
        ),
        spring(clock, state, config),
        // cond(state.finished, stopClock(clock)),
        state.position,
    ]);
}

export default class AnimatedBox extends Component {
    clock = new Clock();
    transX = new Value(0);

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    console.log('');
                    // const state = {
                    //     finished: new Value(0),
                    //     position: new Value(0),
                    //     time: new Value(0),
                    //     velocity: new Value(0),
                    // };
                    //
                    // const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
                    //     ...SpringUtils.makeDefaultConfig(),
                    //     bounciness: 20,
                    //     speed: 8,
                    // });

                    this.transX = runTiming
                }}
                style={{flex: 1}}>
                <Animated.View
                    style={[{width: 100, height: 100, backgroundColor: 'red'}, {transform: [{scale: this.transX}]}]}
                />
            </TouchableOpacity>
        );
    }
}
