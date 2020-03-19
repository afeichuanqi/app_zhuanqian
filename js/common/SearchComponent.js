import React, {Component} from 'react';
import {Platform, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import search from '../res/svg/search.svg';
import SvgUri from 'react-native-svg-uri';
import phone_input_clear from '../res/svg/phone_input_clear.svg';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
        onSubmitEditing: () => {

        },
    };

    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    setValue = (text) => {
        this.setState({
            value: text,
        });
    };
    getValue = () => {
        return this.state.value;
    };

    componentWillUnmount() {
    }

    componentDidMount(): void {


    }


    render() {
        const {placeholder, height} = this.props;
        const {value} = this.state;
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
                value={value}
                placeholder={placeholder}
                keyboardType={'web-search'}
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                returnKeyType={'search'}
                multiline={false}
                blurOnSubmit={true}
                autoCapitalize={'none'}
                onSubmitEditing={this.props.onSubmitEditing}
            />

            <SvgUri style={{
                position: 'absolute',
                left: 10,
                opacity: 1,
                top:hp(1.5)
            }} width={hp(2)} height={hp(2)} svgXmlData={search}/>
            {value.length > 0 && <TouchableOpacity
                onPress={this._clearInput}
                style={{position: 'absolute', top: hp(1.5), right: 10}}
                activeOpacity={0.7}>
                <SvgUri width={hp(2)}
                        height={hp(2)}
                        fill={'rgba(0,0,0,0.6)'}
                        svgXmlData={phone_input_clear}/>
            </TouchableOpacity>}

        </TouchableOpacity>;

    }

    _clearInput = () => {
        this.props.clearInput();
        this.setState({
            value: '',
        });
    };
    // _onFocus = () => {
    //     const {onFocus} = this.props;
    //     if (typeof (eval(onFocus)) == 'function') {
    //         this.props.onFocus();
    //         this.textInput.blur();
    //     }
    //
    // };
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
        height: hp(4),
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: hp(4),
        // marginHorizontal: 5,
        borderRadius: 7,
        opacity: 0.8,
        // color: 'white',
        backgroundColor: '#f2f2f2',
        paddingVertical: 0,
        fontSize:hp(1.9),
    },
});
