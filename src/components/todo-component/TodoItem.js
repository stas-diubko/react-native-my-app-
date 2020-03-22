import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';
import { CheckBox, Icon, Textarea } from 'native-base';

export default class TodoItem extends Component {
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
            <View 
                style={this.state.isSelected ? styles.todoItemsDeleting : styles.todoItems}
            >

                <View style={styles.resolveTodoWrap}>
                    <CheckBox style={this.props.isDone ? styles.resolveTodoChecked : styles.resolveTodo} onPress={()=>this.props.resolveTodo()} checked={this.props.isDone} />
                </View>

                <View style={styles.textData}>
                    <TouchableWithoutFeedback
                    
                        onPress={this.props.isSelect ? () => {
                            this.props.removeTodo()
                            this.onSelectItem()
                        }
                            : 
                            () => {
                                this.props.selectTodo();
                                } }

                        onLongPress={() => {
                                    this.props.removeTodo();
                                    this.onSelectItem()
                                }      
                            }
                        >
                            <Text style={this.props.isDone ? styles.throughText : null} numberOfLines={1}>{this.props.text}</Text>
                    </TouchableWithoutFeedback>
                        
                </View>
                
          </View>
        );
    }
}

const styles = StyleSheet.create({
    todoItems: {
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 40,
        height: 50,
        
    },
    textData: {
        width: '90%',
        padding: 0,
        height: '100%',
        top: 14,
        marginLeft: 10
    },
    throughText: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    removeTodo: {
        position: 'absolute',
        right: 10,
        top: 11
    },
    resolveTodo: {
        borderColor: '#000',
        width: 17,
        height: 17
    },
    resolveTodoChecked: {
        backgroundColor: '#000',
        borderColor: '#000',
        width: 17,
        height: 17,
    },
    resolveTodoWrap: {
        position: 'absolute',
        left: 5,
        top: 16,
    },
    iconsSize: {
        fontSize: 24
    },
    todoItemsDeleting: {
        position: 'relative',
        backgroundColor: 'lightgrey',
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 40,
        height: 50
    }
})