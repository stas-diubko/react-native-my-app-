import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, TouchableHighlight, Modal, AsyncStorage, FlatList } from 'react-native';
import autoBind from 'react-autobind';

const uuidv1 = require('uuid/v1');

export default class ToDoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            todoText: '',
            storageTodo: []
        };
        autoBind(this);
    }

    componentDidMount() {
        this.getTodo();
    }

    getTodo = async () => {
        let dataTodo = await AsyncStorage.getItem('Todos');
        let dataTodoParsed = JSON.parse(dataTodo);
        this.setState({
            storageTodo: dataTodoParsed
        })
    }

    addTodo(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    onChangeText(text) {
        this.setState({
            todoText: text
        });
        
    }

    createTodo() {
        this.saveTodoToStore()
        this.setState({
            modalVisible: false
        });
    }

    saveTodoToStore = async () => {
        let todoArray = [];
        let todoObject = {};
        todoObject.text = this.state.todoText;
        todoObject.id = uuidv1();
        this.setState({
            todoText: ''
        })
        let dataTodo = await AsyncStorage.getItem('Todos');
        if (dataTodo) {
            let dataTodoParsed = JSON.parse(dataTodo);
            dataTodoParsed.unshift(todoObject)
            let todoArrayString = JSON.stringify(dataTodoParsed);
            await AsyncStorage.setItem('Todos', todoArrayString);
            this.getTodo();
        } else {
            todoArray.push(todoObject);
            let todoArrayString = JSON.stringify(todoArray);
            await AsyncStorage.setItem('Todos', todoArrayString);
            this.getTodo();
        }
    }

    removeTodo = async (id) => {
        let dataTodo = await AsyncStorage.getItem('Todos');
        let dataTodoParsed = JSON.parse(dataTodo);
        const resultTodos = dataTodoParsed.filter(item => item.id != id);
        let todoArrayString = JSON.stringify(resultTodos);
        await AsyncStorage.setItem('Todos', todoArrayString);
        this.getTodo();
    }

    TodoItem (text, id) {
        return (
          <View style={styles.todoItems}>
                <View style={styles.textData}>
                    <Text>{text}</Text>
                    <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => {
                            this.removeTodo(id);
                            }}>
                            <Text style={styles.removeTodo}>X</Text>
                    </TouchableHighlight>
                </View>
          </View>
        );
    }

    render() {
        
        return (
            <View style={styles.todoWrapper}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    >
                    <View style={styles.modalWrap}>
                        <View>
                        
                        <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => {
                            this.addTodo(!this.state.modalVisible);
                            }}>
                            <Text style={styles.inCloseModal}>X</Text>
                        </TouchableHighlight>
                        <View style={styles.textAreaContainer} >
                            <TextInput
                                onChangeText={text => this.onChangeText(text)}
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                placeholder="Type todo :)"
                                placeholderTextColor="grey"
                                numberOfLines={10}
                                multiline={true}
                            />
                        </View>
                        <View>
                        <TouchableHighlight
                            style={styles.createTodo}
                            onPress={this.createTodo}>
                            <Text style={styles.createTodoText}>Create</Text>
                        </TouchableHighlight>
                        </View>
                        </View>
                    </View>
                </Modal>

                <TouchableHighlight onPress={() => this.addTodo(true)} underlayColor="white" style={styles.addTodoButton}>
                    <View >
                        <Text style={styles.inAddButton}>+</Text>
                    </View>
                </TouchableHighlight>
                
                <FlatList
                    data={this.state.storageTodo || []}
                    extraData={this.state}
                    renderItem={( { item } ) => this.TodoItem(item.text, item.id)}
                    keyExtractor={(item) => item.id}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    todoWrapper: {
        position: 'relative',
        backgroundColor: 'lightgrey',
        height: '100%',
        padding: 10,
    },
    addTodoButton: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: 50,
        width: 50,
        borderRadius: 400,
        backgroundColor: 'grey',
        padding: 0,
        bottom: 90,
        right: 25,
        zIndex: 1
    },
    inAddButton: {
        color: '#fff',
        fontSize: 30,
        margin: 0
    },
    modalWrap: {
        position: 'relative',
        backgroundColor: 'rgba(46, 49, 49, 0.65)',
        height: '100%'
    },
    closeModal: {
        position: 'absolute',
        top: 10,
        right: 20
    },
    inCloseModal: {
        fontSize: 26,
        color: '#fff'
    },
    textAreaContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#fff',
        width: 300,
        padding: 5,
        marginTop: 100,
        marginLeft: 'auto',
        marginRight: 'auto'
      },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
    },
    createTodo: {
        height: 45,
        width: 280,
        marginTop: 10,
        borderRadius: 20,
        marginLeft: 'auto',
        marginRight: 'auto', 
        backgroundColor: 'darkgrey',
        alignItems: 'center',
    },
    createTodoText: {
        padding: 0,
        lineHeight: 45,
        fontSize: 18,
        color: '#fff'
    },
    todoItems: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 5,
        padding: 10
    },
    textData: {
        padding: 10
    },
    removeTodo: {
        color: '#000',
        fontSize: 24
    }
});