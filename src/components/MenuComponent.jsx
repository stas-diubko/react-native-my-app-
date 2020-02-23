import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import autoBind from 'react-autobind';

export default class MenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'notes'
        };
        autoBind(this);
    }

    setPageNameToState(name) {
        this.setState({
            currentPage: name
        })
    }

    render() {
        return (
            <View style={styles.menuWrapper}>
                <Link
                    to="/"
                    onPress={()=> {this.setPageNameToState('notes')}}
                >
                    <Text style={ this.state.currentPage == 'notes' ? styles.underLineMenuButton : styles.menuItems}>Notes</Text>
                </Link>
                <Link
                    to="/todo"
                    onPress={()=> {this.setPageNameToState('todos')}}
                >
                    <Text style={ this.state.currentPage == 'todos' ? styles.underLineMenuButton : styles.menuItems}>Todos</Text>
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
      color: 'grey',
      fontSize: 18,
      marginLeft: 15,
      marginBottom: 10
    },
    underLineMenuButton: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 15,
        marginBottom: 10,
        // textDecorationLine: 'underline'
    }
});