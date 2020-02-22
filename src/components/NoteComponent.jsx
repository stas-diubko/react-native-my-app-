import React, { Component } from 'react';
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
      backgroundColor: 'lightgrey',
      height: '100%',
      padding: 10,
    }
});