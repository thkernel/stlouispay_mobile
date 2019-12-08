import React from "react";

import {
  StyleSheet,
  StatusBar,
  Text,
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

import AsyncStorage from "@react-native-community/async-storage";

//import { Icon } from "react-native-elements";

import Icon from "react-native-vector-icons/Ionicons";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import RequestHandler from "../utils/RequestHandler";

import constants from "../utils/constants";
import { createBottomTabNavigator, createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import ListPharmacies from "./ListPharmacies";
import ListHealthWorkers from "./ListHealthWorkers";
import ListLaboratories from "./ListLaboratories";
import ListRadioCenters from "./ListRadioCenters";
import ListHospitals from "./ListHospitals";
//import AwesomeCarousel from "../components/AwesomeCarousel";
import fillables from "../components/fillables";
import { ActivityIndicator } from "react-native-paper";

const windowObject = Dimensions.get("window")
const screenObject = Dimensions.get("screen")

const Properties ={
  window:windowObject,
  screen:screenObject,
};

var SQLite = require("react-native-sqlite-storage");


import PushNotification from 'react-native-push-notification'

PushNotification.configure({
 
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
      console.log( 'TOKEN:', token );
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  //senderID: "YOUR GCM (OR FCM) SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
      alert: true,
      badge: true,
      sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
});

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loadingNewsItems:'',
      newsItemsArray:null,
      carrouselData:fillables
    };
  }
  /*<>*/
  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#003d33" hidden={false} />
        <View style={styles.headerView}>
          <View style={styles.iconGroup}>
            {
              this.state.searchRequested?(
                <TextInput 
                    underlineColorAndroid="transparent"
                    placeholderTextColor="white"
                    placeholder="Rechercher une info ..."
                    style={styles.searchInput}
                    onChangeText= {this.updateSearch}
                    ref={(input) => {this.searchInput=input}}
                />
              ):(
                <Text  underlineColorAndroid="transparent" placeholderTextColor="transparent" style={[styles.titleContainer,{marginHorizontal:10}]}>
                  Accueil
                </Text>
              )
            }
            <View style={{flexDirection:'row', justifyContent:'space-between', padding: 10 }}>
              <TouchableOpacity style={{marginRight:20,marginEnd:20}} onPress={()=>{this.state.searchRequested?this.disableSearch():this.enableSearch()}}>
                <Icon
                    name={this.state.searchRequested?"md-close":"ios-search"} size={24} color={"#fff"} style={{ marginTop: 5}}
                  />
              </TouchableOpacity>

              <TouchableOpacity style={{}} onPress={()=>{this.showProfile()}}>
                <Icon
                    name="md-person" size={24} color={"#fff"} style={{ marginTop: 5}}
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
          {/*<ScrollView >
            <AwesomeCarousel data={this.state.carrouselData}/>
          </ScrollView>*/}

            {
              this.state.newsItemsArray?(
                this.state.newsItemsArray.map((newsItem, index)=>{
                    return (
                      <View style={{/*elavation:8,marginHorizontal:6,marginVertical:3,backgroundColor:'#fff'*/}} key={`new-item-${index}-key`}>
                        <View style={styles.newsItem}>
                          <View style={styles.newsItemContent}>
                            <Text style={styles.newsItemContentTitle}>
                              {newsItem.title}
                            </Text>
                            <Text style={styles.newsItemContentDescription}>
                              {newsItem.shortdesc}
                            </Text>
                          </View>

                          {
                            newsItem.image?(
                              <Image
                                source={{uri:constants.remote.shared+"/imgs/news/"+newsItem.image}}
                                resizeMethod='scale'
                                style={{
                                  width: '100%',
                                  height: 150,
                                  alignSelf:'center',
                                  marginTop: 15,
                                  paddingHorizontal: 8
                                }}
                              />
                            ):null
                          }

                          <TouchableOpacity style={styles.newsItemLinkContainer} onPress={()=>{this._requestFeedDetails(newsItem)}}>
                            <Text style={styles.newsItemLinkText}>
                              <Icon name="ios-link" size={16} color="#2196F3" style={{marginHorizontal:8}}/> Lire plus ...
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <Divider/>
                      </View>
                    )
                })
              ):(
                this.loadingNewsItems?(
                    <ActivityIndicator style={styles.newsItemLinkText} size="large" />
                ):(
                  this.loadingNewsFailed?(
                    <Text style={{color:'red',fontSize:16,fontWeight:'bold',textAlign:'center',paddingHorizontal:12, marginTop:screenObject.height/3}}>
                      {this.state.loadingNewsFailed}
                    </Text>
                  ):(
                    <Text style={{color:'orange',fontSize:16,fontWeight:'bold',textAlign:'center',paddingHorizontal:12, marginTop:screenObject.height/3}}>
                      Rien à afficher 
                    </Text>
                  )
                )
                
              )
            }
          </ScrollView>
          {/*
            <TouchableOpacity style={styles.fab} onPress={()=>{this.showProfile()}}>
              <Icon  name='md-person' size={24} color='#fff'/>
            </TouchableOpacity>   
          */}
        </View>
      </View>
    );
  } 

  _renderItem ({item, index}) {
      return (
          <View style={styles.slide}>
              <Text style={styles.title}>{ item.title }</Text>
          </View>
      );
  }



  pushNotifs = ()=>{
    PushNotification.localNotification({
        /* Android Only Properties */
        id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        ticker: "My Notification Ticker", // (optional)
        autoCancel: true, // (optional) default: true
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
        smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
        bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
        subText: "This is a subText", // (optional) default: none
        color: "red", // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'some_tag', // (optional) add tag to message
        group: "group", // (optional) add group to message
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: "high", // (optional) set notification priority, default: high
        visibility: "private", // (optional) set notification visibility, default: private
        importance: "high", // (optional) set notification importance, default: high
    
        /* iOS only properties */
        //alertAction: // (optional) default: view
        //category: // (optional) default: null
        //userInfo: // (optional) default: null (object containing additional notification data)
    
        /* iOS and Android properties */
        title: "My Notification Title", // (optional)
        message: "My Notification Message", // (required)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
    });
  }

  connectToDB = async () => {
    /*var db = await SQLite.openDatabase({name:"kosante",createFromLocation:"~kosante.db"})
    
    try{
      db.transaction((tx)=>{
        
        tx.executeSql('select * from specialities',[], (tx,results) => {
          
          var len= results.rows.length;
          if(len>0){
            var row = results.rows.item(0);
            alert(JSON.stringify(row));
          }else{
            alert("Hmmmm")
          }
        })
      },err=>{
        alert(err.message)
      })
    }catch(e){
      alert(e+"ddd 4")
    }*/
  }

  showProfile = () => {
    let {navigation} = this.props;

    navigation.navigate("Profile")
  }

  componentDidMount = async () => {
    let user = await this.getUserInfos();
    if(user){
      await this.setState({user:JSON.parse(user)})
    }
    this.fetchFeeds();
    this.connectToDB();

    // Optional: Check if the device is blocking background tasks or not
    this.pushNotifs()
  }

  getUserInfos = async () => {
    return await AsyncStorage.getItem("@userInfos");
  }
  
  _requestFeedDetails = async (feed) => {
    let {navigation} = this.props;

    navigation.navigate("ShowFeedDetails",{
      feedReference:feed
    })
  }

  updateSearch = async (request) => {
    
    await this.setState({
      loadingNewsItems:true
    })

    let {user} = this.state;

    if(request){
      RequestHandler.searchInstantNews(
        user?user.id:-1,
        request,
        this.listFeedsSuccess,
        this.listFeedsFailure
      );
    }else{
      RequestHandler.fetchInstantFeeds(
        user?user.id:-1,
        this.listFeedsSuccess,
        this.listFeedsFailure
      );
    }
  }

  fetchFeeds = async () => {
    await this.setState({
      loadingNewsItems:true
    })

    let {user} = this.state;
    RequestHandler.fetchInstantFeeds(
      user?user.id:-1,
      this.listFeedsSuccess,
      this.listFeedsFailure
    );
  }



  enableSearch = async () => {
    await this.setState({
      searchRequested:true
    })

    this.searchInput.focus();
  };

  disableSearch = () => {
    this.setState({
      searchRequested:false
    })
  };

  listFeedsSuccess = response => {
    this.setState({
      newsItemsArray: response.data,
      loadingNewsItems:false
    });
  };

  listFeedsFailure = error => {
    this.setState({
      loadingNewsFailed: error+"",
      loadingNewsItems:false
    });
  };
}

const Divider = (props) => (
  <View style={{flexDirection:'row' ,width:'20%', alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
    <View style={{backgroundColor:'rgba(26,35,126,0.8)',marginVertical:8,height:1, width:'40%'}}/>
    <Icon name={"ios-ribbon"} size={24} color={props.color?props.color:'rgba(26,35,126,0.8)'}/>
    <View style={{backgroundColor:'rgba(26,35,126,0.8)',marginVertical:8,height:1, width:'40%'}}/>
  </View>
)

//createBottomTabNavigator
//createMaterialBottomTabNavigator
//createMaterialBottomTabNavigator
//createMaterialTopTabNavigator
const AppMainContainer=createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: "Accueil",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" color={"#ffff"} size={20} />
        )
      }
    },
    Pharmacies: {
      screen: ListPharmacies,
      navigationOptions: {
        tabBarLabel: "Pharma",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="ambulance" color={tintColor} size={20} />
        )
      }
    },
    HealthWorkers: {
      screen: ListHealthWorkers,
      navigationOptions: {
        tabBarLabel: "Médécins",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="user-md" color={tintColor} size={20} />
        )
      }
    },
    Laboratories: {
      screen: ListLaboratories,
      navigationOptions: {
        tabBarLabel: "Labo",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="address-card" color={tintColor} size={20} />
        )
      }
    },
    Hospitals: {
      screen: ListHospitals,
      navigationOptions: {
        tabBarLabel: "Hopitaux",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="hospital-o" color={tintColor} size={20} />
        )
      }
    },
    Centers: {
      screen: ListRadioCenters,
      navigationOptions: {
        tabBarLabel: "Centres",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-pulse" color={tintColor} size={20} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      //activeTintColor: "orange",
      activeTintColor: "white",//constants.colors.toolBar,
      inactiveTintColor: "orange",
      iconStyle: {},
      style:{
        backgroundColor:'#f2f2f2',
        borderTopColor:constants.colors.statusBar,
        borderTopWidth:0.5
      },
      labelStyle: {
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginVertical: 4
      },
      indicatorStyle: {
        height: 2,
        backgroundColor: constants.colors.statusBar
      }
    },
    barStyle: {
      backgroundColor:"#81D4FA"//"#E1F5FE"//#B3E5FC,
    },
    tabBarPosition: "bottom",
    animationEnabled: true,
    shifting: true,
    removeClippedSubviews:false
  }
);

export default AppMainContainer;

const styles = StyleSheet.create({
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
      backgroundColor:constants.colors.fabColor,
      position: 'absolute',
      alignItems: 'center', 
      justifyContent: 'center', 
      elevation: 8
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
    backgroundColor: "#00695c",
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
  },
  pharmacyItemDesc: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 16,
    marginTop: 15
  },
  searchZoneTitle: {
    textAlign: "center",
    fontWeight: "bold"
  },
  searchedProductsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  lastProductsContainer: {
    borderColor: "rgba(0,180,0,0.6)",
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 20
  },
  carouselContainer:{
    flex:1,
    backgroundColor:"#fff",
    justifyContent: 'center',
  }
});
