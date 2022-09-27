import React from 'react';
import {
    BackHandler, 
    Share, 
    TextInput, 
    ScrollView, 
    Text, 
    View,  
    StyleSheet, 
    StatusBar, 
    TouchableOpacity, 
    ImageBackground, 
    Image, 
    Platform, 
    Dimensions} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

import {BottomSheet}  from 'react-native-btr'

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Str from '../utils/Str';

import constants from '../utils/constants';
import Snackbar from 'react-native-snackbar';

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';
import ActionButton from 'react-native-action-button';





export default class OrganizationDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            
            organization: {},
            selectedOrganization: null,

        }
    }
    
    render() {
        let {navigation} = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#003d33" hidden={false} />
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                        <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                    </TouchableOpacity>

                    <View style={styles.tilesArea}>
                        <Text style={[styles.toolbarTitle,{fontStyle:'italic',fontFamily:'candara'}]}>Fiche organisation</Text>
                    </View>

                    <View style={styles.rightArea}>
                        
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#757575'}}>
                    {
                        this.state.organization?(
                            this.state.organization.logo_url?(
                                <ImageBackground style={styles._h_w_profile_view} source={{uri: this.state.organization.logo_url}}>
                                    <View style={{backgroundColor:'rgba(0,0,0,0.25)'}}>
                                        <Text style={styles.feedTitle}>{this.state.organization.name}</Text>

                                    </View>
                                    
                                </ImageBackground>   
                                                     
                            ):(
                                <View style={styles._h_w_profile_view}>
                                    <Text style={styles.feedTitle}>{this.state.organization.name}</Text>
                                </View> 
                            )
                        ):null
                    }
                    

                    <View style={styles._h_w_card_container}>
                        
                    
                        
                        
                        <View style={{paddingVertical:10, backgroundColor:'#fff'}}>
                            <View style={{flexDirection:'row'}}>
                                
                                <Text style={{color:"#000",fontWeight:'bold',textAlignVertical:'center', alignSelf:'center', textAlign:'center',fontSize:16,paddingHorizontal:18}}>Description</Text>
                            </View>
                            
                            


                            
                            <View style={{textAlign:'justify', fontSize:18,paddingHorizontal:8,color:'#212121'}}>
                            

                             
                            </View>


                        </View>

                        
                    </View>  



                    <View style={styles._h_w_card_container}>
                       
        
                        {
                            this._renderPortfolios()
                        }

                    </View>     



                </ScrollView>

                 
            </View>           
        );
    }

    

    _renderPortfolioThumbnail = (portfolio) => {
        if (portfolio.thumbnail_url !== null){
            return(
                <Thumbnail source={{uri: portfolio.thumbnail_url}}   style={styles._h_w_avatar} />

            )
        }
        else{
            return(
                <Thumbnail source={homme}   style={styles._h_w_avatar} />

            )
        }
    }

    

    
    componentDidMount = async () => {
        let {params} = this.props.navigation.state;

        console.log("COMPONENT MOUNT PARAMS: ", params);

       await this.setState({
            organization: params.organization,

        });

        console.log("SHOW ORGANIZATION DETAILS: ", this.state);
    }

    

    _renderPortfolios() {
        if (this.state.organization.portfolios != null && this.state.organization.portfolios != undefined && this.state.organization.portfolios.length > 0) {
          
          return (
            this.state.organization.portfolios.map( (portfolio,index) => {
                return(
                   <ListItem avatar key={index} onPress={()=> {                
                     this._showPortfolioDetails(portfolio);
                     console.log("PORTFOLIO ITEM WAS PRESSED: ", portfolio);
                   }}>

                      <Left>
                      {this._renderPortfolioThumbnail(portfolio)}
                      </Left>

                      <Body>
                        <Text numberOfLines={1} style={styles._h_w_names}>#{portfolio.uid}</Text>
                        <Text numberOfLines={1} style={styles._h_w_names}>{portfolio.name}</Text>
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
            if(this.state.loadingPortfolioItems){
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <ActivityIndicator size="large"/>
                </View>
              );
            }else{
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <Text style={styles.searchEmptyText}>{this.state.loadingHWErrors?this.state.loadingHWErrors:'Aucune carte!'}</Text>
                </View>
              );
            }
        }
    }

    _showPortfolioDetails(portfolio) {
        console.log("BEFORE SET SELECTED ITEM ON STATE ", portfolio);

        

        let {navigation} = this.props;
        

        navigation.navigate("PortfolioDetails",{
          portfolio:portfolio
        });

        console.log("SELECTED PORTFOLIO", this.state.selectedPortfolio);
    }




}

const styles = StyleSheet.create({
    mainText:{
        textAlign:'center',
        fontSize: 18
    },
    titleContent:{
        fontStyle:'italic',
        fontSize:18,
        color:'#000',
        fontWeight:'bold',
        textAlign:'center',
        paddingHorizontal:10
    },
    titlteContainer:{
        flexDirection:'row',
        paddingVertical:10,
        paddingHorizontal:8,
        marginHorizontal:10,
        alignSelf:'center'
    },
    sideDivider:{
        backgroundColor:'#000',
        height:1,
        width:'90%',
        alignSelf:'center',
        paddingHorizontal:16,
        marginHorizontal: 10,
    },
    availableDay:{
        borderColor:constants.colors.statusBar,
        borderWidth:0.5,
        borderRadius:4,
        marginVertical:4,
        width:'90%',
        alignSelf:'center'
    },
    availabilityDetails:{
        color:constants.colors.toolBar,
        textAlign:'center',
        fontWeight:'bold',
        fontSize:18, 
        paddingVertical:12
    },
    bottomNavigationView: {
      backgroundColor: '#fff',
      width: '100%',
      flexDirection:'column',
      height: 325,
      justifyContent: 'center'
    },
    bottomTitleView:{
      paddingVertical:15, 
      paddingHorizontal:5,
      fontSize:15, 
      fontWeight:'bold',
      color:'#fff', 
      top:0,
      marginTop:0,
      width:'100%',
      position: 'absolute',
      textAlign:'center',
      backgroundColor:'#00665C'
    },
    searchInput: {
        color: "#fff",
        fontSize: 18,
        minWidth: '84%',
        maxWidth: '90%',
        paddingHorizontal: 2
    },
    fab:{
        width:50,
        height:50,
        bottom:30,
        right:30,
        borderRadius:25,
        backgroundColor:constants.colors.blue.share,
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    headerView: {
        //height: Platform.OS === "ios" ? 44 : 56,
        backgroundColor: "#00695c",
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        


    },
    feedTitle:{
        color:'#fff',
        fontSize:18,
        fontStyle:'italic',
        fontWeight:'bold',
        textAlign:'center',
        paddingHorizontal:8,
        marginHorizontal:30,
        marginVertical: 10
    },
    _h_w_profile_view:{
        height:240,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#00695c",
    },
    _h_w_d_profile_img:{
        height:150,
        width:150,
        borderRadius:75,
        marginTop: 18,
        marginBottom: 10,
        alignSelf: 'center',
    }
    
    ,
    _h_w_card_container:{
        backgroundColor:"#fff",
        elevation:4,
        borderRadius:1,
        marginHorizontal:5,
        paddingHorizontal:4,
        marginTop:-30,
        paddingBottom:30
    },
    leftArea:{
        flexDirection: 'row',
        alignItems:'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    tilesArea:{
        flexDirection: 'column',
        justifyContent:'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    rightArea:{
        flexDirection: 'row',
    },
    toolbarTitle:{
        color:'#fff',
        fontSize:18,
        alignItems: 'center',
        marginTop:8,
        fontWeight: 'bold',
    }
});

/*_h_w_avatar:{
        height:60,
        width:60,
        borderRadius:75,
        marginTop: 18,
        marginBottom: 10,
        alignSelf: 'center',
    }*/