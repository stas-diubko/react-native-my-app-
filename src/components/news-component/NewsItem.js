import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Linking} from 'react-native';
import autoBind from 'react-autobind';
import { Icon } from 'native-base';
export default class NewsItemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    render() {
        return (
            <View style={styles.newsItemWrapper} >
                {this.props.itemImage ? <Image style={styles.imageStyles} source={{uri: this.props.itemImage}}/> : null}
                <View style={styles.itemPreview}>
                    {this.props.source ? <Text style={styles.itemsLine}><Text style={styles.headLines}>Source: </Text>{this.props.source}</Text> : null}
                    {this.props.author ? <Text style={styles.itemsLine}><Text style={styles.headLines}>Author: </Text>{this.props.author}</Text> : null}
                    {this.props.title ? <Text style={styles.itemsLine}><Text style={styles.headLines}>{this.props.title}</Text></Text> : null}
                    {this.props.description ? <Text style={styles.itemsLine}><Text style={styles.headLines}></Text>{this.props.description}</Text> : null}
                </View>
                <View style={styles.linkWrap}>
                    {this.props.publishTime ? <Text style={styles.itemsLine}><Text style={styles.publishTimeStyle}>{this.props.publishTime}</Text></Text> : null}
                    {this.props.link ? <Text style={styles.itemsLine} onPress={() => Linking.openURL(this.props.link)}> <Icon name='link' /> </Text> : null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    newsItemWrapper: {
        backgroundColor: '#fff',
        marginBottom: 25,
        borderRadius: 10
    },
    itemPreview: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingRight: 12,
        paddingLeft: 12
    },
    imageStyles: {
        width: '100%', 
        height: 200,
        marginBottom: 10
    },
    headLines: {
        fontWeight: 'bold',
    },
    itemsLine: {
        fontSize: 16,
        marginBottom: 7,
        color: '#000'
    },
    linkStyle: {
        color: '#000',
        fontSize: 16
    },
    linkWrap: {
        display: 'flex',
        // alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7,
        paddingRight: 12,
        paddingLeft: 12
    },
    publishTimeStyle: {
        color: 'grey'
    }
})