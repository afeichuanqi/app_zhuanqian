import React, {PureComponent} from 'react';
import {Platform, StyleSheet, View, TextInput,Text} from 'react-native';


class LabelBigComponent extends PureComponent {


    static defaultProps = {
        title: '高价',
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
        const {title} = this.props;
        return <View style={{
            paddingHorizontal:6,
            paddingVertical:2,
            backgroundColor:'#e8e8e8',
            borderRadius:2,
            marginRight:5,
            // paddingBottomW
        }}>
            <Text style={{
                fontSize:12,
                // color:''
                opacity:0.5,
                fontWeight:'100',
            }}>{title}</Text>
        </View>;


    }


}
// class
export default LabelBigComponent;
