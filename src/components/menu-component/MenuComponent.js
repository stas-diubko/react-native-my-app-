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
                    <Text style={ this.props.location.pathname == '/' ? styles.underLineMenuButton : styles.menuItems}>Notes</Text>
                </Link>
                <Link
                    to="/todo"
                >
                    <Text style={  this.props.location.pathname == '/todo' ? styles.underLineMenuButton : styles.menuItems}>Todos</Text>
                </Link>
                <Link
                    to="/news"
                >
                    <Text style={  this.props.location.pathname == '/news' ? styles.underLineMenuButton : styles.menuItems}>News</Text>
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

export default withRouter(MenuComponent);