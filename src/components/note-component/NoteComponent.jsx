import React, { Component } from './node_modules/react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default class NoteComponent extends Component {

    render() {
        return (
            <View style={styles.noteWrapper}>
                <Text>Note Component</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    noteWrapper: {
      backgroundColor: '#f0f0f0',
      height: '100%',
      padding: 10,
    }
});