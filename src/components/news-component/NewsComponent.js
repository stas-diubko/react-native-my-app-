import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Linking, TouchableWithoutFeedback, Modal, TouchableHighlight } from 'react-native';

import autoBind from 'react-autobind';
import { Icon } from 'native-base';
import { API_KEY } from 'react-native-dotenv';
import send from '../../helpers/requestHelper';
import NewsItemComponent from './NewsItem';
import { Loader } from '../../common/loader';
import { Toaster } from '../../common/toaster';
import moment from 'moment';
import { articles } from './testArticles';
import SelectionItem from './SelectionItem';
import NetInfo from "@react-native-community/netinfo";

const DATA_COUNTRIES = [
    {
      title: "Countries",
      data: ["Ukraine", "USA", "Great Britain", "Russia"]
    }
];

const DATA_CATEGORIES = [
    {
      title: "Categories",
      data: ["General", "Business", "Science", "Sports", "Technology", "Entertainment"]
    }
];

export default class NewsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            articles: [], //articles,
            isFullList: false,
            isLoad: false,
            isVisibleTost: false,
            textToast: null,
            currentCountryCode: 'ua',
            currentCountry: 'Ukraine',
            isModalVisible: false,
            category: 'general',
            currentCategory: 'General',
            setRefreshing: false,
            isOpenModal: false,
            categoryInModal: '',
            countryInModal: '',
            categoryCodeInModal: '',
            countryCodeInModal: '',
            currentAbbreviatedCountry: 'UA',
            abbreviatedCountryInModal: ''
        };
        autoBind(this);
    }

    componentDidMount() {
        this.getNews()
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
        NetInfo.fetch().then(state => {
            if(state.isConnected) {
                if(this.state.articles.length == 0) {
                    this.setActiveLoader(true)
                }
                if(this.state.isFullList){
                    return;
                }
                const { page } = this.state;
                send.send('GET', `top-headlines?country=${this.state.currentCountryCode}&category=${this.state.category}&apiKey=${API_KEY}&page=${this.state.page}&pageSize=${this.state.pageSize}`).then(data => {
                    if(data.data.status === 'ok') {
                        this.setActiveLoader(false)
                        let tempArticle = this.state.articles.filter(item => !item.isLoader)
                        let readyArticle = tempArticle.concat(data.data.articles)
                        if(readyArticle.length < data.data.totalResults) {
                            readyArticle.push({"isLoader": true})
                        } else {
                            this.setState({
                                isFullList: true
                            })
                        }
                        this.setState({
                            articles: readyArticle,
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
            } else {
                return this.setActiveToast(true, 'Check internet connection');
            }
            
        });
    }

    fetchResult = () => {
        this.getNews();
    }

    toggleModal = (data) => {
        this.setState({
            isModalVisible: data
        })
    }

    setCountry = (countryCode, country, abbreviatedCountry ) => {
        this.setState({
            countryCodeInModal: countryCode,
            countryInModal: country,
            abbreviatedCountryInModal: abbreviatedCountry
        })
    }

    setCategory = (categoryCode, category) => {
        this.setState({
            categoryCodeInModal: categoryCode,
            categoryInModal: category
        })
    }

    setFilterCountry = (country) => {
        switch(country) {
            case 'Ukraine':
                this.setCountry('ua', 'Ukraine', 'UA')
                break
          
            case 'USA':
                this.setCountry('us', 'USA', 'USA')
                break
            case 'Great Britain':
                this.setCountry('gb', 'Great Britain', 'GB')
                break
            case 'Russia':
                this.setCountry('ru', 'Russia', 'RU')
                break
          
            default:
              break
          }
    }

    setFilterCategory = (category) => {
        switch(category) {
            case 'General':
                this.setCategory('general', 'General')
                break
            case 'Business':
                this.setCategory('business', 'Business')
                break
            case 'Science':
                this.setCategory('science', 'Science')
                break
            case 'Sports':
                this.setCategory('sports', 'Sports')
                break
            case 'Technology':
                this.setCategory('technology', 'Technology')
                break
            case 'Entertainment':
                this.setCategory('entertainment', 'Entertainment')
                break
            default:
              break
          }
    }

    openDialog = (isOpenModal) => {
        this.setState({
            categoryInModal: this.state.currentCategory,
            countryInModal: this.state.currentCountry,
            categoryCodeInModal: this.state.category,
            countryCodeInModal: this.state.currentCountryCode,
            abbreviatedCountryInModal: this.state.currentAbbreviatedCountry,
            isOpenModal
        })
        
    }

    onSearch = () => {
        this.setState({
            articles: [],
            page: 1,
            pageSize: 10,
            currentCountryCode: this.state.countryCodeInModal,
            currentCountry: this.state.countryInModal,
            category: this.state.categoryCodeInModal,
            currentCategory: this.state.categoryInModal,
            currentAbbreviatedCountry: this.state.abbreviatedCountryInModal,
            isOpenModal: false
        }, () => {
            this.getNews()
        })
    }

    render() {

        return (
            <View style={styles.newsWrapper} >
                <Loader 
                    isActiveLoader={this.state.isLoad}
                />
                <Toaster
                    visible={this.state.isVisibleTost}
                    message={this.state.textToast}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isOpenModal}
                >
                    <View style={styles.modalWrap}>
                        <TouchableHighlight
                            style={styles.closeModal}
                            onPress={() => {
                            this.openDialog(false);
                            }}>
                                <Icon name='close' style={styles.close}/>
                        </TouchableHighlight>
                        <View>
                            <SelectionItem data={DATA_COUNTRIES} onSelectItem={(data)=>this.setFilterCountry(data)} selectedItemOnOpen={this.state.countryInModal}/>
                            <SelectionItem data={DATA_CATEGORIES} onSelectItem={(data)=>this.setFilterCategory(data)} selectedItemOnOpen={this.state.categoryInModal}/>
                            <TouchableWithoutFeedback onPress={() => {this.onSearch()}}>
                                <View style={styles.sarchModalIcon}>
                                    <View>
                                        <Icon style={styles.selectItemSearch} name='search' />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
                <View style={styles.flatWrap}>
                    <FlatList
                        data={this.state.articles}
                        extraData={this.state}
                        onEndReached={this.fetchResult}
                        onEndReachedThreshold={0.7}
                        renderItem={( { item } ) => <NewsItemComponent 
                                                        itemImage={item.urlToImage ? item.urlToImage : null}
                                                        source={item.source ? item.source.name : null}
                                                        title={item.title ? item.title : null}
                                                        author={item.author ? item.author : null}
                                                        description={item.description ? item.description : null}
                                                        link={item.url ? item.url : null}
                                                        publishTime={item.publishedAt ? moment(item.publishedAt).fromNow() : null}
                                                        isLoader={item.isLoader ? item.isLoader : null}
                                                    />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.bottomWrap}>
                    <View style={styles.pickersWrap}>
                        <TouchableWithoutFeedback onPress={() => { this.openDialog(true) }}>
                            <View style={styles.searchBottomWrap}>
                                <Icon style={styles.selectItem} name='search' />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.selectItemWrap}>
                            <Text style={styles.selectItem}>{this.state.currentAbbreviatedCountry}</Text>
                        </View>
                        <View style={styles.selectItemWrap}>
                            <Text style={styles.selectItem}>{this.state.currentCategory}</Text>
                        </View>
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
        position: 'relative'
    },
    searchIcon: {
        color: '#fff'
    },
    searchIconWrap: {
        marginLeft: 20
    },
    bottomWrap: {
        position:'absolute',
        bottom: 40,
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
        height: '90%'
    },
    loaderSearchWrap: {
        marginLeft: 5,
        height: 35,
        width: 35
    },
    modalWrap: {
        paddingTop: 35,
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
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    selectItem: {
        color: '#fff',
        fontWeight: 'bold'
    },
    selectItemWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginLeft: 5
    },
    close: {
        color: '#fff',
    },
    closeModal: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
    selectItemModal: {
        marginLeft: 25,
        fontSize: 20,
        color: '#fff'
    },
    sarchModalIcon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    selectItemSearch: {
        color: '#fff',
        fontSize: 28,
        marginRight: 15
    },
    searchBottomWrap: {
        marginRight: 10
    }
})