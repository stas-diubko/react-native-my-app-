import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Linking} from 'react-native';
import autoBind from 'react-autobind';
import { Icon } from 'native-base';
import { Loader } from '../../common/loader';

let statements = ['Think every moment', 'Always smile', 'Be in a good mood', 'Read more', 'Learn more', 'Change the globe']
export default class NewsItemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    render() {
        let stripe = this.props.author && this.props.source ? this.props.source.length > 20 || this.props.author.length > 20 ? null : ' | ' : null
        
        let itemContent = this.props.isLoader ? 
            <View style={styles.loaderStyle}>
                <Loader 
                    isActiveLoader={true}
                    inFlatArticle={true}
                />
            </View>
        :
        <View style={styles.newsItemWrapper} >
                {this.props.itemImage ? <Image style={styles.imageStyles} source={{uri: this.props.itemImage}}/> : <View style={styles.imgCover}><Text style={styles.coverText}>{statements[this.getRandomInt(statements.length)]}</Text></View>}
                <View style={this.props.author ? this.props.author.length > 20 || this.props.source.length > 20 ? styles.sourceAndAuthorStyleLong : styles.sourceAndAuthorStyle : styles.sourceAndAuthorStyle }>
                    <View >
                        {this.props.source ? <Text style={styles.itemsLine}><Text style={styles.headLinesAuthor}>{this.props.source}</Text></Text> : null}
                    </View>
                    <View>
                        {this.props.author ? <Text style={styles.itemsLine}><Text style={styles.headLinesAuthor}>{stripe}{this.props.author}</Text></Text> : null} 
                    </View>
                </View>
                <View style={styles.itemPreview}>
                    {this.props.title ? <Text style={styles.itemsLine}><Text style={styles.headLines}>{this.props.title}</Text></Text> : null}
                    {this.props.description ? <Text style={styles.itemsLine}><Text style={styles.headLines}></Text>{this.props.description}</Text> : null}
                </View>
                <View style={styles.linkWrap}>
                    {this.props.publishTime ? <Text style={styles.itemsLine}><Text style={styles.publishTimeStyle}>{this.props.publishTime}</Text></Text> : null}
                    {this.props.link ? <Text style={styles.itemsLine} onPress={() => Linking.openURL(this.props.link)}> <Icon name='link' /> </Text> : null}
                </View>
            </View> 

        return itemContent
    }
}

const styles = StyleSheet.create({
    newsItemWrapper: {
        backgroundColor: '#fff',
        marginBottom: 20,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7,
        paddingRight: 12,
        paddingLeft: 12
    },
    publishTimeStyle: {
        color: 'grey'
    },
    sourceAndAuthorStyle: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 12,
        paddingLeft: 12,
       
    },
    sourceAndAuthorStyleLong: {
        paddingRight: 12,
        paddingLeft: 12,
       
    },
    headLinesAuthor: {
        color: 'grey',
        fontWeight: 'bold'
    },
    loaderStyle: {
        marginBottom: 15,
        padding: 0
    },
    imgCover: {
        width: '100%',
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        marginBottom: 10
    },
    coverText: {
        color: '#fff',
        fontSize: 30
    }
})