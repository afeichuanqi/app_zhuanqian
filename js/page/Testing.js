import React, {Component} from 'react';
import {Modal, View, Dimensions, ScrollView, Text, TouchableOpacity} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { Transition, Transitioning } from 'react-native-reanimated';
const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block } = Animated

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    };

    const config = {
        duration: 5000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease),
    };

    return block([
        cond(clockRunning(clock), [
            // if the clock is already running we update the toValue, in case a new dest has been passed in
            set(config.toValue, dest),
        ], [
            // if the clock isn't running we reset all the animation params and start the clock
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        // we run the step here that is going to update position
        timing(clock, state, config),
        // if the animation is over we stop the clock
        cond(state.finished, debug('stop clock', stopClock(clock))),
        // we made the block return the updated position
        state.position,
    ]);
}

export class Testing extends Component {
    // we create a clock node
    clock = new Clock();
    // and use runTiming method defined above to create a node that is going to be mapped
    // to the translateX transform.
    transX = runTiming(this.clock, -120, 120);
    componentDidMount(): void {
        this.animation.animateNextTransition();
    }

    render() {
        return (
            <Transitioning.View
                transition={
                    <Transition.Sequence>
                        <Transition.Out type="scale" />
                        <Transition.Change interpolation="easeInOut" />
                        <Transition.In type="fade" />
                    </Transition.Sequence>
                }
                ref={ref => (this.animation = ref)}
            >
                <View style={{width:100,height:100, backgroundColor:'red'}}></View>


            </Transitioning.View>
        );
    }
}
