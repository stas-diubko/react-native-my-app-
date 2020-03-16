import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View, TouchableHighlight, Modal, FlatList, ScrollView} from 'react-native';
import autoBind from 'react-autobind';

export default class NewsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    render() {
        return (
            <View>
                <Text>news component</Text>
            </View>
        )
    }
}