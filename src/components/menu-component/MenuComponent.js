import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link, withRouter } from "react-router-native";
import autoBind from 'react-autobind';

class MenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'notes'
        };
        autoBind(this);
    }

    render() {
        return (
            <View style={styles.menuWrapper}>
                 <Link
                    to="/"
                >
                    <Text style={  this.props.location.pathname == '/' ? styles.underLineMenuButton : styles.menuItems}>News</Text>
                </Link>
                <Link
                    to="/notes"
                >
                    <Text style={ this.props.location.pathname == '/notes' ? styles.underLineMenuButton : styles.menuItems}>Notes</Text>
                </Link>
                <Link
                    to="/todo"
                >
                    <Text style={  this.props.location.pathname == '/todo' ? styles.underLineMenuButton : styles.menuItems}>Todos</Text>
                </Link>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    menuWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#000',
      justifyContent: 'flex-start',
      paddingTop: 10,
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
    }
});

export default withRouter(MenuComponent);