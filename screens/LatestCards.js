import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  PushNotificationIOS
} from "react-native";

import {
  Container,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Icon,
  Fab
} from "native-base";

import Moment from "moment";
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';
import { ActivityIndicator } from "react-native-paper";
import ThemeColors from "../constants/ThemeColors";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-community/async-storage";

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';
import cardIcon from '../assets/private/phone-book-contacts.png';

import RequestHandler from "../utils/RequestHandler";


const windowObject = Dimensions.get("window")
const screenObject = Dimensions.get("screen")

const Properties ={
  window:windowObject,
  screen:screenObject,
};

const height = Dimensions.get("window").height / 3;



export default class LatestCards extends Component {
  
constructor(props) {
    super(props);

    this.state = {
      loadingLatestCards:true,
      latestCards: null,
      loadingLatestCardsErrors:null,

    };
  }

  render() {
    return (
      <View style={styles.main}>
      <StatusBar backgroundColor="#003d33" hidden={false} />
      <View style={styles.headerView}>
          <View style={styles.iconGroup}>
            
              <Text  underlineColorAndroid="transparent" placeholderTextColor="transparent" style={[styles.titleContainer,{marginHorizontal:10}]}>
                Holilink
              </Text>
             
            <View style={{flexDirection:'row', justifyContent:'space-between', padding: 10 }}>
              

              <TouchableOpacity style={{}} onPress={()=>{this.showProfile()}}>
                <Icon
                    name="ios-menu" size={24} color={"#fff"} style={{ marginTop: 5}}
                  />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{marginBottom:35/*,backgroundColor:'#f0f0f0'*/}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >


           { this._renderLatestCards() }
          </ScrollView>
        </View>
        <View style={styles.bottom}>
            <TouchableOpacity style={styles.fab} onPress={()=>{this._scanQrcode()}}>
                <FontAwesome  name='qrcode' size={24} color='#fff'/>
            </TouchableOpacity>
        </View>
      </View>
    );
  }


 _navigate = async (route,params={})=>{
        let {navigation} = this.props;

        navigation.navigate(route,params)
    }

    _scanQrcode = async ()=>{
        console.log("NEW PRODUCT ORDER");
        let {navigation} = this.props; 

        navigation.navigate("ScanQrcode",{
          //product: product
        });
    }
    

_showLatestCardDetails = async (latestCard) => {
    let {navigation} = this.props;

    navigation.navigate("ShowLatestCardDetails",{
      latestCard: latestCard
    })
  }



  _renderLatestCards() {
        if (this.state.latestCards != null && this.state.latestCards != undefined && this.state.latestCards.length > 0) {
          
          return (
            this.state.latestCards.map( (latestCardItem,index) => {
                return(
                   <ListItem avatar key={index} onPress={()=> {                
                     this._showCardDetails(latestCardItem);
                     console.log("LATEST CARDS ITEM WAS PRESSED: ", latestCardItem);
                   }}>

                      <Left>
                        {
                          this._renderCardThumbnail(latestCardItem)
                        }
                      </Left>

                      <Body>
                        <Text numberOfLines={1} style={styles._h_w_names}>#{latestCardItem.uid}</Text>
                        <Text numberOfLines={1} style={styles._h_w_names}>{latestCardItem.last_name} {latestCardItem.first_name}</Text>

                      </Body>
                      <Right>
                        
                      </Right>
                  </ListItem>
                );
            })
          );
        } else {
          const height =
            Dimensions.get("window").height / 3
            if(this.state.loadingLatestCards){
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <ActivityIndicator color="#912455" size="large"/>
                </View>
              );
            }else if(this.state.latestCardsEmpty){
              return (
              <Text style={{color:'orange',fontSize:16,fontWeight:'bold',textAlign:'center',paddingHorizontal:12, marginTop:screenObject.height/3}}>
                      Aucune carte recente!
                    </Text>
              )
            }
        }
    }


_renderCardThumbnail = (card) => {
        if (card.thumbnail_url !== null){
            return(
                <Thumbnail source={{uri: card.thumbnail_url}}   style={styles._h_w_avatar} />

            )
        }
        else{
            return(
                <Thumbnail source={cardIcon}   style={styles._h_w_avatar} />

            )
        }
    }

  

  componentDidMount = async () => {
    
    //this.positionStatus();
    
    let data = await AsyncStorage.getItem("@latest_cardss");
    if (data != null){
      await this.getLatestCardsFromAsyncStorage();
    }else{
      await this.fetchLatestCards();
    }
    
    
    //await this.savePortfoliosOnAsyncStorage();

    
  }



  componentWillUnmount(){
        //LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
  }


  fetchLatestCards = async () => {

    console.log("FETCH LATESTCARDS");
    await this.setState({
      loadingLatestCardItems:true
    })

    RequestHandler.getLatestCards(
      this.getLatestCardsSuccess,
      this.getLatestCardsFailure
    );
    console.log("LATESTCARDS DATE:", this.state.latestCards);

  }


  saveLatestCardsOnAsyncStorage= async () => {
    let latestCards = this.state.latestCards;
    if (latestCards != null && latestCards != undefined){
      await AsyncStorage.setItem("@latest_cards", JSON.stringify(latestCards));
    }

    
  }

  getLatestCardsFromAsyncStorage = async () => {
        let data = await AsyncStorage.getItem("@latest_cards");
        this.setState({
          latestCards: JSON.parse(data)
        })

        console.log("GET LATESTCARDS FROM STORAGE: ", this.state.latestCards);

  }

  getLatestCardsSuccess = response => {
    this.setState({
      latestCards: response,
      loadingLatestCardItems:false
    });

    console.log("FETCH DATA: ", response);
    //this.saveLatestCardsOnAsyncStorage();
  };

  getLatestCardsFailure = error => {
    this.setState({
      loadingLatestCardsFailed: error+"",
      loadingLatestCardItems:false
    });

        console.log("FETCH DATA: ", error);

  };

  _showCardDetails = async (card) => {
    let {navigation} = this.props;

    navigation.navigate("CardDetails",{
      card: card
    })
  }
  

  


 showProfile = () => {
    let {navigation} = this.props;

    navigation.navigate("Profile")
  }



 


  

  

  _renderItem ({item, index}) {
      return (
          <View style={styles.slide}>
              <Text style={styles.title}>{ item.title }</Text>
          </View>
      );
  }


  


}

const Divider = (props) => (
  <View style={{flexDirection:'row' ,width:'20%', alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
    <View style={{backgroundColor:'rgba(26,35,126,0.8)',marginVertical:8,height:1, width:'70%'}}/>
  </View>
)

const styles = StyleSheet.create({
  lineHeight: {
    height: 21
  },
  main: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 25
  },
  fab:{
      width:50,
      height:50,
      bottom:15,
      right:15,
      borderRadius:25,
      backgroundColor:constants.colors.toolBar,
      position: 'absolute',
      alignItems: 'center', 
      justifyContent: 'center', 
      elevation: 8
  },
    footerFab:{
        width:50,
        height:50,
        right:25,
        borderRadius:25,
        backgroundColor:constants.colors.blue.share,
        
        alignItems: 'center', 
        justifyContent: 'center', 
        
    },
    bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  iconGroup: {
    flexDirection: "row",
    justifyContent:'space-between',
    paddingHorizontal: 16
  },
  newsItemLinkContainer:{
    flexDirection:'row',
    paddingVertical:5,
    alignSelf:'center',
    marginVertical:8
  },
  _h_w_avatar:{
    height:32,
    width:32,
    borderRadius:32.5
  },
  newsItemLinkText:{
    color:'#2196F3',
    fontSize:16,
    paddingVertical:5,
    paddingHorizontal:8,
    flexDirection:'row',
    borderRadius:1,
    borderColor:'#1A237E',
    borderWidth:0.5,
    margin:6
  },
  headerView:{
    elevation:8,
    backgroundColor: constants.colors.toolBar,
    height: Platform.select({
        "ios":44,
        "android":56
    })
  },
  searchInput:{ 
    flex: 1,
    fontSize: 18, 
    color: "white"
  },
  titleContainer:{
    color:'white',
    fontFamily:'candara',
    fontSize:18,
    textAlignVertical:'center'
  },
  mt20: {
    marginTop: 20
  },
  subtitlesIndicator: {
    color: "#fff",
    fontSize: 17,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: "center",
    borderRadius: 4,
    backgroundColor: "rgba(255,00,00,0.60)",
    borderColor: "rgb(255,00,00)",
    borderWidth: 1
  },
  searchHistoryItemText: {
    color: "rgb(100,100,60)",
    fontSize: 18
  },
  subtitles: {
    color: "#000",
    fontSize: 17,
    marginHorizontal: 10
  },
  titles: {
    color: "#000",
    fontSize: 22,
    fontStyle: "italic",
    marginVertical: 10,
    marginHorizontal: 10,
    textAlign: "center"
  },
  newsItem: {
    flexDirection: "column",
    paddingHorizontal: 5,
    marginHorizontal: 4
  },
  newsItemContent: {
    flexDirection: "column",
    marginHorizontal: 3
  },
  newsItemContentTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  newsItemContentDescription: {
    color: "#000",
    fontStyle: "italic",
    fontSize: 18,
    textAlign: "justify"
  },
  pharmacyItem: {
    flexDirection: "row",
    paddingHorizontal: 10
  },
  pharmacyItemIcon: {
    width: 68,
    height: 68,
    marginHorizontal: 15
  },
  pharmacyItemTitle: {
    color: "#000",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 18
  },
  divider: {
    alignSelf: "center",
    width: "30%",
    marginVertical: 16,
    backgroundColor: "#000",
    height: 1
  },
  dividerSmall: {
    alignSelf: "center",
    width: "15%",
    backgroundColor: "#3F51B5",
    height: 1
  }
});