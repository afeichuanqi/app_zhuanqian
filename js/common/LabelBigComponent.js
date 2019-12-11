import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';


class LabelBigComponent extends PureComponent {


    static defaultProps = {
        title: '高价',
        paddingHorizontal: 6,
        paddingVertical: 3,
        fontSize: 12,
        marginRight: 5,
        marginTop: 0,
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
        const {title, paddingHorizontal, fontSize, paddingVertical, marginRight, marginTop} = this.props;
        return <View style={{
            paddingHorizontal,
            paddingVertical,
            backgroundColor: '#f3f3f3',
            borderRadius: 4,
            marginRight,
            marginTop,
        }}>
            <Text style={{
                fontSize,
                opacity: 0.5,
                color:'black'
            }}>{title}</Text>
        </View>;
    }
}

// class
export default LabelBigComponent;
