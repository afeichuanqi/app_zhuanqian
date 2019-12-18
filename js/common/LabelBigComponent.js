import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';


class LabelBigComponent extends PureComponent {


    static defaultProps = {
        title: '高价',
        paddingHorizontal: 6,
        paddingVertical: Platform.OS === 'android' ? 0 : 3,
        fontSize: 13,
        marginRight: 5,
        marginTop: 0,

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
            style={{
                paddingHorizontal,
                paddingVertical,
                backgroundColor: '#f3f3f3',
                borderRadius: 4,
                marginRight,
                marginTop,
            }}>
            <Text style={{
                fontSize,
                opacity: 0.7,
                color: 'black',
            }}>{title}</Text>
        </TouchableOpacity>;
    }
}

// class
export default LabelBigComponent;
