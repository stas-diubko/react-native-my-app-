import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

export default class NoteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
       
        autoBind(this);
    }

    onSelectItem() {
        this.setState({
            isSelected: !this.state.isSelected
        })
    }

    render() {
        return (
            <View >
                 <TouchableWithoutFeedback 
                    onPress={ this.props.isSelect ? 
                        ()=> {
                            this.props.selectToDelete();
                            this.onSelectItem()
                        } 
                        : this.props.openNote}

                    onLongPress={
                        ()=> {
                            this.props.selectToDelete();
                            this.onSelectItem()
                        } 
                    } 
                 > 
                    <View style={this.state.isSelected ? styles.noteItemsDeleting : styles.noteItems}>
                            <View style={styles.textData}>
                                <Text numberOfLines={3}>{this.props.text}</Text>
                            </View>
                            <View style={styles.noteCreationDate}>
                                <Text style={styles.noteCreationDateText}>{this.props.updateingDate ? this.props.updateingDate : this.props.creationDate}</Text>
                            </View>   

                    </View>
                    
                </TouchableWithoutFeedback>
                
            </View>
           
        );
    }
}

const styles = StyleSheet.create({
    noteItems: {
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10,
        height: 110,
        
    },
    textData: {
        width: '95%',
        padding: 0,
        top: 14,
    },
    noteCreationDate: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        
    },
    noteCreationDateText: {
        color: 'grey',
    },
    deletingItems: {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },
    noteItemsDeleting: {
        position: 'relative',
        backgroundColor: 'lightgrey',
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10,
        height: 110,
    }
})