import React, { Component } from 'react';
import { TouchableWithoutFeedback, TextInput, StyleSheet, Text, View, TouchableHighlight, Modal, AsyncStorage, FlatList, ScrollView } from 'react-native';
import autoBind from 'react-autobind';
import { CheckBox, Icon } from 'native-base';
import moment from 'moment';
import uuidv1 from 'uuid/v1';

import { getStorageItem, setStorageItem } from '../../helpers/storageHelper';

export default class TodoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalSelectVisible: false,
            todoText: '',
            storageTodo: [],
            selectTodo: {},
            isStorageTodo: null
        };
        autoBind(this);
    }

    componentDidMount() {
        this.getTodo();
    }

    getTodo() {
        getStorageItem('Todos').then(dataTodo => {
            this.setState({
                storageTodo: dataTodo
            }, () => {
                if(this.state.storageTodo.length > 0) {
                    this.setState({
                        isStorageTodo: true
                    })
                } else {
                    this.setState({
                        isStorageTodo: false
                    })
                }
               
            })
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

    saveTodoToStore() {
        let todoArray = [];
        let todoObject = {};
        todoObject.text = this.state.todoText;
        todoObject.id = uuidv1();
        todoObject.isDone = false;
        todoObject.creationDate = moment().format('lll');
        
        this.setState({
            todoText: ''
        })

        getStorageItem('Todos').then(dataTodo => {
            if (dataTodo) {
                dataTodo.unshift(todoObject);
                setStorageItem('Todos', dataTodo).then(() => {
                    this.getTodo();
                })
            } else {
                todoArray.push(todoObject);
                setStorageItem('Todos', todoArray).then(() => {
                    this.getTodo();
                })
            }
        })
    }

    removeTodo(id) {
        getStorageItem('Todos').then(data => {
            const resultTodos = data.filter(item => item.id != id);
            setStorageItem('Todos', resultTodos).then(() => {
                this.getTodo();
            })
        })
    }

    resolveTodo(id) {
        getStorageItem('Todos').then(data => {
            let index = data.findIndex((item) => item.id == id)
            data[index].isDone = !data[index].isDone;
            setStorageItem('Todos', data).then(() => {
                this.getTodo();
            })
        })
    }

    selectTodo(id) {
        getStorageItem('Todos').then(data => {
            let foundTodo = data.find((item) => item.id == id);
            this.setState({selectTodo: foundTodo, modalSelectVisible: !this.state.modalSelectVisible})
        })
    }

    TodoItem(text, id, isDone) {
        return (
          <View style={styles.todoItems}>
                   <View style={styles.textData}>
                <TouchableWithoutFeedback
                    onPress={() => {
                    this.selectTodo(id);
                    }}>
                        <Text style={isDone ? styles.throughText : null} numberOfLines={1}>{text}</Text>
                </TouchableWithoutFeedback>
                    
                </View>
             
                <View style={styles.resolveTodoWrap}>
                    <CheckBox style={isDone ? styles.resolveTodoChecked : styles.resolveTodo} onPress={()=>this.resolveTodo(id)} checked={isDone} />
                </View>
                
                <View style={styles.removeTodo}>
                    <TouchableWithoutFeedback
                        style={styles.removeTodo}
                        onPress={() => {
                        this.removeTodo(id);
                        }}
                    >
                        <Icon name='trash' />
                </TouchableWithoutFeedback>
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
                                <Icon name='close'  style={styles.close}/>
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
                            style={this.state.todoText.length > 0 ? styles.createTodo : styles.noneDisplay}
                            onPress={this.createTodo}>
                            <Text style={styles.createTodoText}>Create</Text>
                        </TouchableHighlight>
                        </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalSelectVisible}
                    >
                    <View style={styles.modalWrap}>
                        <View>
                        
                        <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => {this.setState({modalSelectVisible: !this.state.modalSelectVisible})
                            }}>
                                <Icon name='close' style={styles.close} />
                        </TouchableHighlight>

                        <ScrollView style={styles.selectText} contentContainerStyle={{flexGrow:1, justifyContent: 'space-between'}}>
                            <Text>{this.state.selectTodo.text}</Text>
                            <Text style={styles.selectTextDate} >{this.state.selectTodo.creationDate}</Text>
                        </ScrollView>
                        
                        </View>
                    </View>
                </Modal>
                <View  style={styles.addTodoButtonWrap}>
                    <TouchableHighlight onPress={() => this.addTodo(true)} underlayColor="white" style={styles.addTodoButton}>
                        <View >
                            <Text style={styles.inAddButton}>Create todo</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                
                {
                    this.state.isStorageTodo !== false ? <FlatList
                        data={this.state.storageTodo}
                        extraData={this.state}
                        renderItem={( { item } ) => this.TodoItem(item.text, item.id, item.isDone)}
                        keyExtractor={(item) => item.id}
                    /> : <View style={styles.noTodos}><Text style={styles.noTodosText}>No todos here yet</Text></View>
                }
               

            </View>
        )
    }
}

const styles = StyleSheet.create({
    todoWrapper: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
        height: '100%',
        paddingBottom: 125,
        paddingLeft: 10,
        paddingRight: 10,
        overflow: 'hidden'
    },
    addTodoButtonWrap: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: '100%',
        padding: 0,
        bottom: 75,
        zIndex: 1,
    },
    addTodoButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        padding: 5,
        borderRadius: 400,
        backgroundColor: '#000',
    },
    inAddButton: {
        color: '#fff',
        fontSize: 20,
        margin: 0
    },
    modalWrap: {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        height: '100%'
    },
    closeModal: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
    close: {
        color: '#fff'
    },
    inCloseModal: {
        fontSize: 26,
        color: '#fff'
    },
    textAreaContainer: {
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '90%',
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
        position: 'relative',
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        height: 50
    },
    textData: {
        width: '80%',
        padding: 0,
        height: 20,
        top: 14,
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
        borderColor: '#000'
    },
    resolveTodoChecked: {
        backgroundColor: '#000',
        borderColor: '#000'
    },
    resolveTodoWrap: {
        position: 'absolute',
        right: 50,
        top: 16,
    },
    selectText: {
        display: 'flex',
        flexDirection:'column',
        minHeight: 200,
        maxHeight: '70%',
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '90%',
        paddingTop: 10,
        paddingLeft: 15,
        marginTop: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    selectTextDate: {
        color: 'grey',
        paddingBottom: 20,
    },
    noTodos: {
        marginTop: 10,
        marginRight: 'auto',
        marginLeft: 'auto'
    }, 
    noTodosText: {
        fontSize: 20
    },
    noneDisplay: {
        display: 'none'
    }
});