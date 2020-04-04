import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  TouchableHighlight
} from "react-native";

const Item = ({ title, onSelect }) => (
  <View style={styles.item}>
    <TouchableHighlight onPress={() => onSelect(title)}>
        <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  </View>
);

const SelectionItem = (props) => {
    return (
         <SafeAreaView style={styles.container}>
            <SectionList
              sections={props.data}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => <Item title={item} onSelect={(data) => {props.onSelectItem(data)}} />
              }
              renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.header}>{title}</Text>
              )}
            />
        </SafeAreaView>
    )
}

export default SelectionItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    fontSize: 20,
    backgroundColor: '#fff',
    marginBottom: 2,
    padding: 3,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  header: {
    fontSize: 20,
    backgroundColor: 'lightgrey',
    marginBottom: 5,
    padding: 3,
    color: 'grey',
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  title: {
    fontSize: 20
  }
});
