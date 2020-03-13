import React, { Component } from 'react';
import {
        StyleSheet,
        Text,
        View,
        TouchableHighlight,
        TouchableWithoutFeedback,
        Modal,
        FlatList,
        Animated
    } from 'react-native';
import { Icon, Textarea } from 'native-base';
import autoBind from 'react-autobind';
import moment from 'moment';
import uuidv1 from 'uuid/v1';

import { getStorageItem, setStorageItem, updateStorageItem, removeStorageItem } from '../../helpers/storageHelper';
import NoteItem from './NoteItem';
import { FadeInView } from '../../common/animated';

export default class NoteComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteText: '',
            storageNotes: [],
            modalNoteVisible: false,
            isStorageNote: true,
            modalNoteSelectVisible: false,
            selectNote: {},
            selectText: '',
            isSelectedToDelete: false,
            notesForDeleting: [],
            offset: 0,
            downScroll: false
        };
       
        autoBind(this);
    }

    componentDidMount() {
        this.getNote();
    }

    addNote(visible) {
        this.setState({
            modalNoteVisible: visible,
            noteText: ''
        });
    }

    onChangeTextArea(text) {
        this.setState({
            noteText: text
        });
    }

    onChangeTextAreaSelect(text){
        this.setState({
            selectText: text
        });
    }

    createNote() {
        this.saveNoteToStore();
        this.setState({
            modalNoteVisible: false
        });
    }

    getNote() {
        getStorageItem('Notes').then(dataNote => {
            if(dataNote) {
                this.setState({
                storageNotes: dataNote
            }, () => {
                    if(this.state.storageNotes.length > 0) {
                        this.setState({
                            isStorageNote: true
                        })
                    } else {
                        this.setState({
                            isStorageNote: false
                        })
                    }
                }) 
            }
        })
    }

    saveNoteToStore() {
        let noteArray = [];
        let noteObject = {};
        noteObject.text = this.state.noteText;
        noteObject.id = uuidv1();
        
        noteObject.creationDate = moment().format('lll');
        
        this.setState({
            noteText: ''
        })

        getStorageItem('Notes').then(dataNote => {
            if (dataNote) {
                dataNote.unshift(noteObject);
                setStorageItem('Notes', dataNote).then(() => {
                    this.getNote();
                })
            } else {
                noteArray.push(noteObject);
                setStorageItem('Notes', noteArray).then(() => {
                    this.getNote();
                })
            }
        })
    }

    openSelelectNote(id) {
        getStorageItem('Notes').then(data => {
            let foundNote = data.find((item) => item.id == id);
            this.setState({selectNote: foundNote, selectText: foundNote.text})
        }).then(() => {this.setState({modalNoteSelectVisible: true})})
    }

    closeSelectModal() {
        this.setState({
            modalNoteSelectVisible: false
        })
    }
    
    saveNoteAfterChanging() {
        let data = {
            id: this.state.selectNote.id,
            changedtext: this.state.selectText,
            lastUpdatingDate: moment().format('lll')
        }
        updateStorageItem('Notes', data).then(() => {
            this.getNote();
            this.closeSelectModal();
        })
    }

    selectToDelete(id) {
        let deletingArray = this.state.notesForDeleting;
        if (deletingArray.includes(id)) {
            const result = deletingArray.filter(item => item != id);
            this.setState({
                notesForDeleting: result
            })
        } else {
            deletingArray.push(id);
            this.setState({
                notesForDeleting: deletingArray
            })
        }
    }

    removeNotes() {
        removeStorageItem('Notes', this.state.notesForDeleting).then(() => {
            this.setState({
                isSelectedToDelete: false,
                notesForDeleting: [] 
            });
            this.getNote();
        })
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
            
                <View style={styles.noteWrapper}>
                <View style={
                    this.state.notesForDeleting.length > 0
                    ? styles.deletingIcon : styles.noneDisplay}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                            this.removeNotes();
                            }}
                        >
                            <Icon name='trash' style={styles.trashIcon}/>
                        </TouchableWithoutFeedback>
                </View>
                
                <View style={styles.contentWrap}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalNoteVisible}
                    >
                    <View style={styles.modalWrap}>
                        <View>
                        
                        <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => {
                            this.addNote(!this.state.modalNoteVisible);
                            }}>
                                <Icon name='close' style={styles.close}/>
                        </TouchableHighlight>
                        
                        <Textarea 
                            style={styles.textareaStyle} 
                            rowSpan={7} 
                            bordered
                            maxLength={350}
                            placeholder="Type your note :)" 
                            onChangeText={text => this.onChangeTextArea(text)}
                        />

                        <FadeInView toValue={1}>
                            <TouchableHighlight
                                style={this.state.noteText.length > 0 ? styles.createNote : styles.noneDisplay}
                                onPress={this.createNote}>
                                <Text style={styles.createNoteText}>Create</Text>
                            </TouchableHighlight>
                        </FadeInView>
                        
                        </View>
                    </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalNoteSelectVisible}
                    > 
                    <View style={styles.modalWrap}>
                        <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => this.closeSelectModal()
                            }>
                                <Icon name='close'  style={styles.close}/>
                        </TouchableHighlight>
                        <View  style={styles.textareaStyle}>
                            <Textarea
                                rowSpan={7}
                                maxLength={350}
                                value={this.state.selectText}
                                onChangeText={text => this.onChangeTextAreaSelect(text)}
                            />
                            <Text style={styles.noteCreationDateTextWrap}>Created at: <Text style={styles.noteCreationDateText}>{this.state.selectNote.creationDate}</Text></Text>
                            
                            {this.state.selectNote.lastUpdatingDate ? <Text style={styles.noteCreationDateTextWrap}>Last updated at: <Text style={styles.noteCreationDateText}>{this.state.selectNote.lastUpdatingDate}</Text></Text> : null}
                        </View>
                        <FadeInView toValue={1}>
                            <TouchableHighlight
                                style={this.state.selectNote.text !== this.state.selectText ? styles.createNote : styles.noneDisplay}
                                onPress={this.saveNoteAfterChanging}>
                                <Text style={styles.createNoteText}>Save</Text>
                            </TouchableHighlight>
                        </FadeInView>
                    </View>
                </Modal>
                
                {
                    this.state.isStorageNote ? 
                         <FlatList
                            onScroll={e => this.onScrollItems(e)}
                            onPress={this.openSelelectNote}
                            data={this.state.storageNotes}
                            extraData={this.state}
                            renderItem={( { item } ) => <NoteItem 
                                                            text={item.text}
                                                            id={item.id}
                                                            creationDate={item.creationDate}
                                                            updateingDate={item.lastUpdatingDate}
                                                            openNote={()=>this.openSelelectNote(item.id)}
                                                            selectToDelete={() => this.selectToDelete(item.id)}
                                                            isSelect={this.state.notesForDeleting.length > 0 ? true : false}
                                                        />}
                            keyExtractor={(item) => item.id}
                        />            
                    : <View style={styles.noNotes}><Text style={styles.noNotesText}>No notes here yet</Text></View>
                }
                </View>
                    <View style={this.state.downScroll ? styles.noneDisplay : styles.addNoteButtonWrap}>
                        <TouchableHighlight onPress={() => this.addNote(true)} underlayColor="white">
                            <View >
                                <Icon name="add-circle" style={styles.addNoteButtonIcon} />
                            </View>
                        </TouchableHighlight>
                    </View>
            </View>
            
            
        )
    }
}

const styles = StyleSheet.create({
    noteWrapper: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
        height: '100%',
        paddingTop: 10,
       
        paddingBottom: 65,
    },
    contentWrap: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    addNoteButtonWrap: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'flex-end',
        height: 40,
        right: 20,
        width: '100%',
        padding: 0,
        bottom: 100,
        zIndex: 1,
    },
    addNoteButtonIcon: {
        fontSize: 60,
        margin: 0,
    },
    close: {
        color: '#fff'
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
    textareaStyle: {
        backgroundColor: '#fff',
        marginTop: 100,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '92%',
        borderRadius: 5,
        padding: 5
    },
    createNote: {
        height: 30,
        width: '70%',
        marginTop: 10,
        borderRadius: 20,
        marginLeft: 'auto',
        marginRight: 'auto', 
        backgroundColor: 'darkgrey',
        alignItems: 'center',
    },
    createNoteText: {
        padding: 0,
        lineHeight: 30,
        fontSize: 18,
        color: '#fff'
    },
    noneDisplay: {
        display: 'none'
    },
    saveButtonAfterChange: {
        width: 80,
        marginLeft: 15,
        marginTop: 10
    },
    textAreaSelectWrap: {
        backgroundColor: '#fff'
    },
    noteCreationDateText: {
        color: 'darkgrey',
    },
    noteCreationDateTextWrap: {
        marginLeft: 10,
        color: 'grey'
    },
    deletingIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 1,
    },
    noneDisplay: {
        display: 'none'
    },
    noNotes: {
        marginRight: 'auto',
        marginLeft: 'auto'
    }, 
    noNotesText: {
        fontSize: 20
    },
    trashIcon: {
        fontSize: 40
    }
});