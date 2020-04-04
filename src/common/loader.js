import React from 'react';
import autoBind from 'react-autobind';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
         
        }
        
        autoBind(this);
    }

    render() {
        return (
            <View style={this.props.inFlatArticle ? styles.loaderContainerInFlat : styles.loaderContainer}>
                <ActivityIndicator style={this.props.isActiveLoader ? null : styles.loaderNotActive} size={this.props.size ? this.props.size : 'large'} color={this.props.color ? this.props.color : '#000'} /> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderContainer: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 1
    },
    loaderContainerInFlat: {
        marginBottom: 0
    },
    loaderNotActive: {
        display: 'none',
    }
});
