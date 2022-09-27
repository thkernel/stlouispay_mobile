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
  ImageBackground, 
  PushNotificationIOS
} from "react-native";
import { BackHandler, DeviceEventEmitter } from 'react-native';

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
//import { Icon } from "react-native-elements";

import Icon from "react-native-vector-icons/Ionicons";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import RequestHandler from "../utils/RequestHandler";

import constants from "../utils/constants";
import { createBottomTabNavigator, createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";



import Organizations from "./Organizations";
import LatestCards from "./LatestCards";


import { ActivityIndicator } from "react-native-paper";
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';




//import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';
import portfolioIcon from '../assets/private/phone-book-contacts.png';

import ActionButton from 'react-native-action-button';


const windowObject = Dimensions.get("window")
const screenObject = Dimensions.get("screen")
const height = Dimensions.get("window").height / 3

const Properties ={
  window:windowObject,
  screen:screenObject,
};





export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loadingOrders:'',
      loadingOrdersError:'',
      portfolios: null,
      selectedOrder: null
    };
  }
  /*<>*/
  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#912455" hidden={false} />
        <View style={styles.headerView}>
          <View style={styles.iconGroup}>
            
              <Text  underlineColorAndroid="transparent" placeholderTextColor="transparent" style={[styles.titleContainer,{marginHorizontal:10}]}>
                LE SAINT LOUIS
              </Text>
             
            <View style={{flexDirection:'row', justifyContent:'space-between', padding: 10 }}>
              {/*
              <TouchableOpacity style={{marginRight:20,marginEnd:20}} onPress={()=>{this.state.searchRequested?this.disableSearch():this.enableSearch()}}>
                <Icon
                    name={this.state.searchRequested?"md-close":"ios-search"} size={24} color={"#fff"} style={{ marginTop: 5}}
                  />
              </TouchableOpacity>
              */}

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
          

            <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  

                  <TouchableOpacity style={styles.fab} onPress={()=>{this._scanQrcode()}}>
                    <FontAwesome  name='qrcode' size={24} color='#fff'/>
                </TouchableOpacity>
                <Text style={styles.scannerText}>Appuyez sur le bouton pour scanner </Text>
               </View>

          </ScrollView>
          
        </View>

        

      </View>
    );
  } 



  _navigate = async (route,params={})=>{
        let {navigation} = this.props;

        navigation.navigate(route,params)
    }


    _scanQrcode = async ()=>{
        //console.log("NEW PRODUCT ORDER");
        let {navigation} = this.props; 

        navigation.navigate("ScanQrcode",{
          //product: product
        });
    }

  _renderItem ({item, index}) {
      return (
          <View style={styles.slide}>
              <Text style={styles.title}>{ item.title }</Text>
          </View>
      );
  }


   _renderOrders() {
        if (this.state.orders != null && this.state.orders != undefined && this.state.orders.length > 0) {
          
          return (
            this.state.orders.map( (order,index) => {
                return(
                   <ListItem avatar key={index} onPress={()=> {                
                     //this._showOrderDetails(order);
                     console.log("ORDER ITEM WAS PRESSED: ", order);
                   }}>

                      <Left>
                      {this._renderOrderThumbnail(order)}
                      </Left>

                      <Body>
                        <Text numberOfLines={1} style={styles._h_w_names}>{order.uid}</Text>
                      </Body>
                      <Right>
                        
                      </Right>
                  </ListItem>
                );
            })
          );
        } else {
          const height = Dimensions.get("window").height / 3
            if(this.state.loadingOrders){
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <ActivityIndicator size="large"/>
                </View>
              );
            }else{
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <Text style={styles.searchEmptyText}>{this.state.loadingOrdersError?this.state.loadingOrdersError:'Aucun paiement!'}</Text>
                </View>
              );
            }
        }
    }

    _showOrderDetails(portfolio) {
        console.log("BEFORE SET SELECTED ITEM ON STATE ", order);

       

        let {navigation} = this.props;
        console.log("SELECTED PORTFOLIO ITEM BEFORE SHOW DETAILS", this.state.selectedOrder);

        navigation.navigate("PortfolioDetails",{
          portfolio:portfolio
        });

        console.log("SELECTED PORTFOLIO", this.state.selectedOrder);
    }


  _renderOrderThumbnail = (portfolio) => {
        if (portfolio.thumbnail_url !== null){
            return(
                <Thumbnail source={{uri: portfolio.thumbnail_url}}   style={styles._h_w_avatar} />

            )
        }
        else{
            return(
                <Thumbnail source={portfolioIcon}   style={styles._h_w_avatar} />

            )
        }
    }

  
  showProfile = () => {
    let {navigation} = this.props;

    navigation.navigate("Profile")
  }

  componentDidMount = async () => {
    
    //this.positionStatus();
    
    let data = await AsyncStorage.getItem("@orders");
    if (data != null){
      await this.getOrdersFromAsyncStorage();
    }else{
      await this.fetchOrders();
    }
    
    
    //await this.saveOrdersOnAsyncStorage();

    
  }



  componentWillUnmount(){
        //LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
  }

  _requestPortfolioDetails = async (portfolio) => {
    let {navigation} = this.props;

    navigation.navigate("PortfolioDetails",{
      portfolio: portfolio
    })
  }

  updateSearch = async (request) => {
    
    await this.setState({
      loadingOdersItems:true
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

  fetchOrders = async () => {
    await this.setState({
      loadingOdersItems:true
    })

    RequestHandler.getOrders(
      this.getOrdersSuccess,
      this.getOrdersFailure
    );


  }


  saveOrdersOnAsyncStorage= async () => {
    let orders = this.state.orders;
    if (orders != null && orders != undefined){
      await AsyncStorage.setItem("@orders", JSON.stringify(orders));
    }

    
  }

  getOrdersFromAsyncStorage = async () => {
        let data = await AsyncStorage.getItem("@orders");
        this.setState({
          portfolios: JSON.parse(data)
        })

        console.log("GET POLLS FROM STORAGE: ", this.state.orders);

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

  getOrdersSuccess = response => {
    console.log("ALL ORDERS: ", response );
    this.setState({
      orders: response,
      loadingOdersItems:false
    });

    console.log("FETCH DATA: ", response);
    this.saveOrdersOnAsyncStorage();
  };

  getOrdersFailure = error => {
    this.setState({
      loadingOrdersFailed: error+"",
      loadingOrdersItems:false
    });

        console.log("FETCH DATA: ", error);

  };


 
}








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
      marginBottom: 10,
   
      borderRadius:25,
      backgroundColor:constants.colors.toolBar,
      position: 'absolute',
      alignItems: 'center', 
      justifyContent: 'center', 
      elevation: 8
  },
  scannerText:{
    marginTop: 10,
    
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
  _h_w_avatar:{
    height:32,
    width:32,
    borderRadius:32.5
  },
  carouselContainer:{
    flex:1,
    backgroundColor:"#fff",
    justifyContent: 'center',
  }
});
