import React, {Component} from 'react';
import {Platform, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import search from '../res/svg/search.svg';
import SvgUri from 'react-native-svg-uri';


class SearchComponent extends Component {


    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.value !== nextState.value) {
            return true;
        }
        return false;
    }

    static defaultProps = {
        placeholder: '搜索任务ID',
        onFocus: () => {

        },
    };

    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }


    render() {
        const {placeholder, onFocus, height} = this.props;
        return <TouchableOpacity
            activeOpacity={1}
            onPress={this.props.onFocus}
            style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
            <TextInput
                ref={ref => this.textInput = ref}
                style={[styles.textInput, {height}]}
                onChangeText={text => {
                    this.setState({
                        value: text,
                    });
                }}
                // editable={false}
                placeholder={placeholder}
                keyboardType={'web-search'}
                placeholderTextColor={'#7b798d'}
                returnKeyType={'search'}
                onFocus={this._onFocus}
                clearButtonMode={'while-editing'}
                multiline={false}
                // secureTextEntry={true}
                autoCapitalize={'none'}
            />
            {/*<View>*/}
            {/*    */}
            {/*</View>*/}
            <SvgUri style={{
                position: 'absolute',
                left: 10,
                opacity: 0.2,
            }} width={19} height={19} svgXmlData={search}/>
        </TouchableOpacity>;

    }

    _onFocus = () => {
        const {onFocus} = this.props;
        console.log(typeof (eval(onFocus)) == 'function');
        if (typeof (eval(onFocus)) == 'function') {
            this.props.onFocus();
            this.textInput.blur();
        }

    };
}

export default SearchComponent;
const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        flexDirection: 'row',
        height: 10,
        backgroundColor: 'white',
        borderBottomColor: '#cdcdcd',
        borderBottomWidth: .3,
        paddingLeft: 2,
    },

    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 30,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 35,
        // marginHorizontal: 5,
        borderRadius: 7,
        opacity: 1,
        // color: 'white',
        backgroundColor: '#f2f2f2',
        paddingVertical: 0,
    },
});
