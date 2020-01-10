import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class LabelBigComponent extends PureComponent {


    static defaultProps = {
        title: '高价',
        paddingHorizontal: 6,
        paddingVertical: Platform.OS === 'android' ? 1 : 2,
        fontSize: wp(2.9),
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
            },this.props.contaiStyle]}>
            <Text numberOfLines={1} style={[{
                maxWidth:wp(15),
                fontSize,
                opacity: 0.5,
                color:'black',
            },this.props.textStyle]}>{title}</Text>
        </TouchableOpacity>;
    }
}

// class
export default LabelBigComponent;
