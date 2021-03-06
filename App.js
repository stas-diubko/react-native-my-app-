import React, { Component } from 'react';
import { Platform } from 'react-native';
import { NativeRouter, Route } from "react-router-native";
import NoteComponent from "./src/components/note-component/NoteComponent";
import TodoComponent from "./src/components/todo-component/ToDoComponent";
import MenuComponent from "./src/components/menu-component/MenuComponent";
import NewsComponent from './src/components/news-component/NewsComponent';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
    
    render() {
        return ( 
           <NativeRouter>
               <MenuComponent/>
                <Route exact path="/" component={NewsComponent} />
                <Route path="/todo" component={TodoComponent} />
                <Route path="/notes" component={NoteComponent} />
           </NativeRouter>
        );
    }
}
