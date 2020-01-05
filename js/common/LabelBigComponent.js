import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';


class LabelBigComponent extends PureComponent {


    static defaultProps = {
        title: '高价',
        paddingHorizontal: 6,
        paddingVertical: Platform.OS === 'android' ? 1 : 2,
        fontSize: 13,
        marginRight: 5,
        marginTop: 0,
        contaiStyle:{},
        textStyle:{}

    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    render() {
        const {title, paddingHorizontal, fontSize, paddingVertical, marginRight, marginTop, onClick} = this.props;
        return <TouchableOpacity
            onPress={() => {
                onClick && onClick(title);
            }}
            activeOpacity={onClick ? 0.6 : 1}
            style={[{
                paddingHorizontal,
                paddingVertical,
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
                marginRight,
                marginTop,
                // borderWidth:1,
                // borderColor:'#f5f5f5',

            },this.props.contaiStyle]}>
            <Text numberOfLines={1} style={[{
                maxWidth:150,
                fontSize,
                opacity: 0.5,
                color:'black'
            },this.props.textStyle]}>{title}</Text>
        </TouchableOpacity>;
    }
}

// class
export default LabelBigComponent;
