import React, {PureComponent} from 'react';
import {Platform, StyleSheet, View, TextInput, Text} from 'react-native';


class LabelBigComponent extends PureComponent {


    static defaultProps = {
        title: '高价',
        paddingHorizontal: 6,
        paddingVertical:3,
        fontSize: 12,
        marginRight:5,
        marginTop:0,
        onFocus: () => {

        },
    };

    constructor(props) {
        super(props);
    }


    componentWillUnmount() {
    }

    componentDidMount(): void {


    }

    render() {
        const {title, paddingHorizontal, fontSize,paddingVertical,marginRight,marginTop} = this.props;
        return <View style={{
            paddingHorizontal,
            paddingVertical,
            backgroundColor: '#f2f2f2',
            borderRadius: 2,
            marginRight,
            marginTop,
            // paddingBottomW
        }}>
            <Text style={{
                fontSize,
                opacity: 0.5,
                // fontWeight: '100',
            }}>{title}</Text>
        </View>;


    }


}

// class
export default LabelBigComponent;
