import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View, TouchableHighlight, Modal, FlatList, ScrollView} from 'react-native';
import autoBind from 'react-autobind';
import { CheckBox, Icon, Textarea } from 'native-base';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../helpers/storageHelper';
import { FadeInView } from '../../common/animated';
import TodoItem from './TodoItem';

export default class TodoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalSelectVisible: false,
            todoText: '',
            storageTodo: [],
            selectTodo: {},
            isStorageTodo: null,
            offset: 0,
            downScroll: false,
            todosForDeleting: [],
            isSelectedToDelete: false,
        };
        autoBind(this);
    }

    componentDidMount() {
        this.getTodo();
    }

    getTodo() {
        getStorageItem('Todos').then(dataTodo => {
            if(dataTodo) {
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
            }
        })
    }

    addTodo(visible) {
        this.setState({
            modalVisible: visible,
            todoText: ''
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
    
    removeTodos() {
        removeStorageItem('Todos', this.state.todosForDeleting).then(() => {
            this.setState({
                isSelectedToDelete: false,
                todosForDeleting: [] 
            });
            this.getTodo();
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

    selectTodosToDelete(id) {
        let deletingArray = this.state.todosForDeleting;
        if (deletingArray.includes(id)) {
            const result = deletingArray.filter(item => item != id);
            this.setState({
                todosForDeleting: result
            })
        } else {
            deletingArray.push(id);
            this.setState({
                todosForDeleting: deletingArray
            })
        }
        
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
          </View>
        );
    }

    onScrollItems(e) {
        let currentOffset = e.nativeEvent.contentOffset.y;
        if(currentOffset < 0) {
            currentOffset = 0
        }
        let isDownScroll = currentOffset > this.state.offset ? true : false;
        this.setState({offset: currentOffset, downScroll: isDownScroll});
    }

    render() {
        return (
            <View style={styles.todoWrapper}>
                <View style={
                    this.state.todosForDeleting.length > 0
                    ? styles.deletingIcon : styles.noneDisplay}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                            this.removeTodos();
                            }}
                        >
                            <Icon name='trash' style={styles.trashIcon}/>
                        </TouchableWithoutFeedback>
                </View>
                <View style={styles.contentWrap}>
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
                            <Textarea 
                                style={styles.textArea} 
                                rowSpan={5}
                                placeholder="Type todo :)"
                                value={this.state.todoText}
                                maxLength={150}
                                onChangeText={text => this.onChangeText(text) }
                            />
                        </View>
                            
                        <FadeInView toValue={1}>
                            <View>
                            <TouchableHighlight
                                onPress={this.createTodo} 
                                style={this.state.todoText.length > 0 ? styles.createTodo : styles.noneDisplay}
                            >
                                <Text style={styles.createTodoText}>Create</Text>
                            </TouchableHighlight>
                            </View> 
                        </FadeInView>
                        
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
                
                {
                    this.state.isStorageTodo !== false ? 
                    <FlatList
                        onScroll={e => this.onScrollItems(e)}
                        data={this.state.storageTodo}
                        extraData={this.state}
                        renderItem={( { item } ) => <TodoItem 
                                                        text={item.text}
                                                        id={item.id}
                                                        isDone={item.isDone}
                                                        removeTodo={() => this.selectTodosToDelete(item.id)}
                                                        selectTodo={() => this.selectTodo(item.id)}
                                                        resolveTodo={() => this.resolveTodo(item.id)}
                                                        isSelect={this.state.todosForDeleting.length > 0 ? true : false}
                                                    />}
                        keyExtractor={(item) => item.id}
                    /> : <View style={styles.noTodos}><Text style={styles.noTodosText}>No todos here yet</Text></View>
                }
               
            </View>
            <View  style={this.state.downScroll ? styles.noneDisplay : styles.addTodoButton}>
                <TouchableHighlight onPress={() => this.addTodo(true)} underlayColor="white">
                    <View >
                        <Icon name="add-circle" style={styles.addTodoButtonIcon} />
                    </View>
                </TouchableHighlight>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    todoWrapper: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
        height: '100%',
        paddingTop: 10,
        paddingBottom: 65,
        overflow: 'hidden'
    },
    contentWrap: {
        paddingLeft: 10,
        paddingRight: 10,
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
    },
    addTodoButton: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'flex-end',
        height: 40,
        right: 20,
        padding: 0,
        bottom: 100,
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
        borderRadius: 5,
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
        height: 30,
        width: '70%',
        marginTop: 10,
        borderRadius: 20,
        marginLeft: 'auto',
        marginRight: 'auto', 
        backgroundColor: 'darkgrey',
        alignItems: 'center',
    },
    createTodoText: {
        padding: 0,
        lineHeight: 30,
        fontSize: 18,
        color: '#fff'
    },
    todoItems: {
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 10,
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
    },
    iconsSize: {
        fontSize: 24
    },
    addTodoButtonIcon: {
        fontSize: 60,
        margin: 0,
    },
    deletingIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 1,
    },
    trashIcon: {
        fontSize: 40
    }
});