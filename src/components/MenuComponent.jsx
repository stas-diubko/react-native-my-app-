import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

export default class MenuComponent extends Component {

    render() {
        return (
            <View style={styles.menuWrapper}>
                <Link
                    to="/"
                    underlayColor="#f0f4f7"
                >
                    <Text style={styles.menuItems}>Notes</Text>
                </Link>
                <Link
                    to="/todo"
                    underlayColor="#f0f4f7"
                >
                    <Text style={styles.menuItems}>Todos</Text>
                </Link>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    menuWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#000',
      justifyContent: 'flex-start',
      paddingTop: 30,
    },
    menuItems: {
      color: '#fff',
      fontSize: 18,
      marginLeft: 15,
      marginBottom: 10
    }
});