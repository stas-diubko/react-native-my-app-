import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Linking, Picker } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";
import autoBind from 'react-autobind';
import { API_KEY } from 'react-native-dotenv';
import send from '../../helpers/requestHelper';
import NewsItemComponent from './NewsItem';
import { Loader } from '../../common/loader';
import { Toaster } from '../../common/toaster';
import moment from 'moment';

export default class NewsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            articles: [],
            isLoad: false,
            isVisibleTost: false,
            textToast: null,
            currentCountry: 'ua',
            isModalVisible: false,
            category: 'general',
            setRefreshing: false
        };
        autoBind(this);
    }

    componentDidMount() {
        // this.getNetInfo()
        this.getNews()
    }

    getNetInfo = () => {
        NetInfo.fetch().then(data => {
            console.log("Connection type", data);
          });
    }

    setActiveLoader = (isLoad) => {
        this.setState({
            isLoad
        })
    }

    setActiveToast = (isShow, text) => {
        this.setState({
            isVisibleTost: isShow,
            textToast: text
        }, () => {{
            this.setState({
                isVisibleTost: false,
                textToast: null
            })
        }})
    }

    getNews = () => {
        this.setActiveLoader(true)
        const { page, articles } = this.state;
        send.send('GET', `top-headlines?country=${this.state.currentCountry}&category=${this.state.category}&apiKey=${API_KEY}&page=${this.state.page}&pageSize=${this.state.pageSize}`).then(data => {
            if(data.data.status === 'ok') {
                this.setActiveLoader(false)
                this.setState({
                    articles: articles.concat(data.data.articles),
                    page: page + 1
                })
            } else {
                this.setActiveLoader(false);
                this.setActiveToast(true, 'something went wrong :(');
            }
        }).catch(error => {
            this.setActiveLoader(false);
            this.setActiveToast(true, error);
        })
    }

    fetchResult = () => {
        this.getNews();
    }

    toggleModal = (data) => {
        this.setState({
            isModalVisible: data
        })
    }

    setFilterCountry = (country) => {
        this.setState({
            currentCountry: country,
            articles: []
        }, () => {
            this.getNews();
        })
    }

    setFilterCategory = (category) => {
        this.setState({
            category,
            articles: []
        }, () => {
            this.getNews();
        })
    }

    render() {
        let pickerCountry =  <Picker
                                selectedValue={this.state.currentCountry}
                                style={styles.pickerStyle}
                                onValueChange={(itemValue) => this.setFilterCountry(itemValue)}>
                                <Picker.Item label="UA" value="ua" />
                                <Picker.Item label="USA" value="us" />
                                <Picker.Item label="GB" value="gb" />
                                <Picker.Item label="RU" value="ru" />
                            </Picker> 
                            

        let pickerCategory = <Picker
                                enabled={false}
                                selectedValue={this.state.category}
                                style={styles.pickerStyleCategory}
                                onValueChange={(itemValue) => this.setFilterCategory(itemValue)}>
                                <Picker.Item label="General" value="general" />
                                <Picker.Item label="Business" value="business" />
                                <Picker.Item label="Science" value="science" />
                                <Picker.Item label="Sports" value="sports" />
                                <Picker.Item label="Technology" value="technology" />
                            </Picker>
                            
        return (
            <View style={styles.newsWrapper} >
                <Loader 
                    isActiveLoader={this.state.isLoad}
                />
                <Toaster
                    visible={this.state.isVisibleTost}
                    message={this.state.textToast}
                />
                <View style={styles.flatWrap}>
                    <FlatList
                        data={this.state.articles}
                        extraData={this.state}
                        onEndReached={this.fetchResult}
                        onEndReachedThreshold={0.7}
                        renderItem={( { item } ) => <NewsItemComponent 
                                                        itemImage={item.urlToImage}
                                                        source={item.source.name}
                                                        title={item.title}
                                                        author={item.author}
                                                        description={item.description}
                                                        link={item.url}
                                                        publishTime={moment(item.publishedAt).fromNow()}
                                                    />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.bottomWrap}>
                    <View style={styles.pickersWrap}>
                        {pickerCountry}
                        {pickerCategory}
                    </View>
                    <View>
                         <View>
                            <Text style={styles.bottomText} onPress={() => Linking.openURL('https://newsapi.org/')}>
                                Powered by News API
                            </Text>
                        </View>
                    </View>
                   
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    newsWrapper: {
        backgroundColor: '#f0f0f0',
        height: '100%',
        paddingTop: 10,
        paddingBottom: 42
    },
    searchIcon: {
        color: '#fff'
    },
    searchIconWrap: {
        marginLeft: 20
    },
    bottomWrap: {
        height: 40,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: '#000'
    },
    bottomText: {
        fontWeight: 'bold',
        color: '#fff'
    },
    flatWrap: {
        height: '93%'
    },
    loaderSearchWrap: {
        marginLeft: 5,
        height: 35,
        width: 35
    },
    modalWrap: {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        height: '100%'
    },
    pickerStyle: {
        height: 40,
        width: 80,
        color: '#fff',
        backgroundColor: '#000',
        marginRight: 5,
        padding: 0,
        overflow: 'visible'
    },
    pickerStyleCategory: {
        height: 40,
        width: 120,
        color: '#fff',
        backgroundColor: '#000',
        padding: 0,
        overflow: 'visible'
    },
    pickersWrap: {
        display: 'flex',
        flexDirection: 'row'
    }
})