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
import AsyncStorage from "@react-native-community/async-storage";


import FontAwesome from "react-native-vector-icons/FontAwesome";

import RequestHandler from "../utils/RequestHandler";

import constants from "../utils/constants";


import ThemeColors from "../constants/ThemeColors";
import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';
import organizationIcon from '../assets/private/phone-book-contacts.png';


const windowObject = Dimensions.get("window")
const screenObject = Dimensions.get("screen")

const Properties ={
  window:windowObject,
  screen:screenObject,
};

const height = Dimensions.get("window").height / 3;



export default class Organizations extends Component {
  
constructor(props) {
    super(props);

    this.state = {
      loadingOrganizations:true,
      loadingOrganizationsErrors:null,
      user: {},
      organizations: null,
      selectedOrganization: null

    };
  }

  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#003d33" hidden={false} />
        <View style={styles.headerView}>
          <View style={styles.iconGroup}>
            
              <Text  underlineColorAndroid="transparent" placeholderTextColor="transparent" style={[styles.titleContainer,{marginHorizontal:10}]}>
                LE SAINT LOUIS
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


           { 
            this._renderOrganizations() 
          }
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
        console.log("NEW PRODUCT ORDER");
        let {navigation} = this.props; 

        navigation.navigate("ScanQrcode",{
          //product: product
        });
    }

_showOrganizationDetails = async (organization) => {
    let {navigation} = this.props;

    navigation.navigate("OragnaizationDetails",{
      organization: organization
    })
  }


_renderOrganizationThumbnail = (organization) => {
        if (organization.logo_url !== null){
            return(
                <Thumbnail source={{uri: organization.logo_url}}   style={styles._h_w_avatar} />

            )
        }
        else{
            return(
                <Thumbnail source={organizationIcon}   style={styles._h_w_avatar} />

            )
        }
    }


  _renderOrganizations() {
        if (this.state.organizations != null && this.state.organizations != undefined && this.state.organizations.length > 0) {
          
          return (
            this.state.organizations.map( (organizationItem,index) => {
                return(
                   <ListItem avatar key={index} onPress={()=> {                
                     this._showOrganizationDetails(organizationItem);
                     console.log("ORGANIZATION ITEM WAS PRESSED: ", organizationItem);
                   }}>

                      <Left>
                        { this._renderOrganizationThumbnail(organizationItem)}
                      </Left>

                      <Body>
                        <Text numberOfLines={1} style={styles._h_w_names}>{organizationItem.name}</Text>
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
            if(this.state.loadingOrganizations){
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <ActivityIndicator color="#912455" size="large"/>
                </View>
              );
            }else if(this.state.organizationsEmpty){
              return (
              <Text style={{color:'orange',fontSize:16,fontWeight:'bold',textAlign:'center',paddingHorizontal:12, marginTop:screenObject.height/3}}>
                      Aucune organisation!
                    </Text>
              )
            }
        }
    }



componentDidMount = async () => {
    
    //this.positionStatus();
    
    let data = await AsyncStorage.getItem("@organizationss");
    if (data != null){
      await this.getOrganizationsFromAsyncStorage();
    }else{
      await this.fetchOrganizations();
    }
    
    
    //await this.savePortfoliosOnAsyncStorage();

    
  }



  componentWillUnmount(){
        //LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
  }


  fetchOrganizations = async () => {
    await this.setState({
      loadingOrganizationItems:true
    })

    RequestHandler.getOrganizations(
      this.getOrganizationsSuccess,
      this.getOrganizationsFailure
    );


  }


  saveOrganizationsOnAsyncStorage= async () => {
    let organizations = this.state.organizations;
    if (organizations != null && organizations != undefined){
      await AsyncStorage.setItem("@organizations", JSON.stringify(organizations));
    }

    
  }

  getOrganizationsFromAsyncStorage = async () => {
        let data = await AsyncStorage.getItem("@organizations");
        this.setState({
          organizations: JSON.parse(data)
        })

        console.log("GET ORGANIZATIONS FROM STORAGE: ", this.state.organizations);

  }

  getOrganizationsSuccess = response => {
    this.setState({
      organizations: response,
      loadingOrganizationItems:false
    });

    console.log("FETCH DATA: ", response);
    this.saveOrganizationsOnAsyncStorage();
  };

  getOrganizationsFailure = error => {
    this.setState({
      loadingOrganizationsFailed: error+"",
      loadingOrganizationsItems:false
    });

        console.log("FETCH DATA: ", error);

  };

  _showOrganizationDetails = async (organization) => {
    let {navigation} = this.props;

    navigation.navigate("OrganizationDetails",{
      organization: organization
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
  main: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 25
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
  _h_w_avatar:{
    height:32,
    width:32,
    borderRadius:32.5
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