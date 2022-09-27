import React from 'react';
import {BackHandler, TextInput, ScrollView, Text, View, StyleSheet, StatusBar, Dimensions, TouchableOpacity, TouchableHighlight, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

import {BottomSheet}  from 'react-native-btr'

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';

//import Icon from "react-native-vector-icons/Ionicons";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import Str from '../utils/Str';

import constants from '../utils/constants';
import Snackbar from 'react-native-snackbar';

import {Header, Left, Right, Body, Title, Thumbnail,  List,ListItem } from 'native-base';


import RequestHandler from '../utils/RequestHandler';


import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

import HTML from 'react-native-render-html';


const height = Dimensions.get("window").height / 2

export default class OpinionsList extends React.Component{

    constructor(props){
        super(props);
        this.state =  {
            pollItem:null,
            userInfo:null,
            loadingOpinions: true,
            opinions: null,
          
           
            request:'',
            
            
            
            
        }
    }

    render(){
        let {navigation} = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#003d33" hidden={false} />
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.lefteArea} onPress={()=>{navigation.goBack()}}>
                        <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:12}} />
                    </TouchableOpacity>

                    <View style={styles.tilesArea}>
                        <Text style={[styles.toolbarTitle,{fontStyle:'italic',fontFamily:'candara'}]}>Liste des opinions</Text>
                    </View>

                    

                   
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#f3f3f3'}}>

                    <View style={styles._h_w_profile_view}>

                        {this._renderPollItemInfoImage(this.state.pollItem) }

                        <Text style={styles._h_w_category}>{this.state.pollItem.title}</Text>
                    
                    </View>

                    <View style={styles._h_w_card_container}>
                        <View style={{flexDirection:'row',paddingVertical:10}}>
                            <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'justify',fontSize:16,paddingHorizontal:18}}>Description</Text>
                        </View>

                        <View style={{textAlign:'justify', fontSize:18,paddingHorizontal:8,color:'#212121'}}>
                            <HTML html={this.state.pollItem.content} 

                             />
                            </View>

                        

                        <View style={{flexDirection:'row',paddingVertical:10}}>
                            <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'justify',fontSize:16,paddingHorizontal:18}}>Opinions</Text>
                        </View>
                        
                        

                        {
                            this._renderOpinionsList()
                        }
                    </View>           
                </ScrollView>

                 
            </View>
        );
    }

/*
    async componentDidMount(){
        
        let {navigation} = this.props;
        await this.setState({
            pollItem: navigation.state.params,
            //poll_item_id: navigation.state.params.pollItem.id,
            
            
        });

    

        console.log("DONNEES TRANSMIS A OPINION LIST: ", this.state.pollItem);
       
        //BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    */

    _renderOpinionsList = () => {
        if (this.state.opinions != null && this.state.opinions != undefined) {
          
          return (
            this.state.opinions.map( (opinion,index) => {
                return(
                   <ListItem avatar key={index} onPress={()=> {                
                     
                     console.log("POLL ITEM WAS PRESSED: ", opinion);
                   }}>

                      <Left>
                      {this._renderOpinionUserAvatar(opinion) }
                      </Left>

                      <Body>
                        <Text numberOfLines={1} style={styles._h_w_names}>{opinion.user.login}</Text>
                        <Text>{opinion.content} </Text>

                      </Body>
                      <Right>
                        
                      </Right>
                  </ListItem>
                );
            })
          );
        }else {
          
            if(this.state.loadingOpinions){
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <ActivityIndicator size="large"/>
                </View>
              );
            }else{
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <Text style={styles.searchEmptyText}>{this.state.loadingHWErrors?this.state.loadingHWErrors:'Aucun élément trouvé'}</Text>
                </View>
              );
            }
        }
    }

   

    _renderPollItemInfoImage = (pollItem) => {
        if (pollItem.image_url !== null){
            return(
                <Thumbnail source={{uri: pollItem.image_url}}   style={styles._h_w_d_profile_img} />

            )
        }
        else{
            return(
                <Thumbnail source={homme}   style={styles._h_w_d_profile_img} />

            )
        }
    }

    _renderOpinionUserAvatar = (opinion) => {
        if (opinion.user.avatar_url !== null){
            return(
                <Thumbnail source={{uri: opinion.user.avatar_url}}   style={styles._h_w_avatar} />

            )
        }
        else{
            return(
                <Thumbnail source={homme}   style={styles._h_w_avatar} />

            )
        }
    }



    

  fetchOpinions = async (response) => {
    console.log("POLL ITEM ID FOR GET OPINION: ", this.state.pollItem.id);
    RequestHandler.getOpinions(
      this.state.pollItem.id,
      this.getOpinionsSuccess,
      this.getOpinionsFailure
    );


  }

  getOpinionsSuccess = response => {
    this.setState({
      opinions: response,
      loadingOpinions:false
    });

    console.log("FETCH DATA: ", response);
    //this.savePollsOnAsyncStorage();
  }

  getOpinionsFailure = error => {
    this.setState({
      loadingOpinionsFailed: error+"",
      loadingOpinions:false
    });

        console.log("FETCH DATA: ", error);

  }




 
    handleError (error, description){
        Snackbar.show({
            title: error+" "+description,
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: 'OK',
              color: 'green',
              onPress: () => { 
                  // Do something. 
              },
            },
        });
    }



    async componentWillMount(){
        let {navigation} = this.props;

        console.log("PARAMETRES TRANSMIS: ", navigation.state.params);

        await this.setState({
            pollItem: navigation.state.params.data,
            poll_item_id: navigation.state.params.data.id,

        });

        

        //console.log("CURRENT POLL ITEM ID: ", this.state.poll_item_id);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        
    }

    componentDidMount = async () => {
    
    
     
     await this.setState({
           // poll_item_id = navigation.state.params.pollItem.id,
            //user_token: user_token
        });

     await this.fetchOpinions();
     console.log("POLL OPINION LIST ON COMPONENT DID MOUNT: ", this.state.pollItem);
     console.log("OPINIONS LIST ON COMPONENT DID MOUNT: ", this.state.pollItem.comments);
     

    
    
  }


  

    

  


    handleBackPress = ()=>{
        if (this.state.showWorkerPlacesBottomSheet) {
          this._hideWorkerDays();
          return true;
        }
        return false;
    }
    
    
    componentWillUnmount(){
       
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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
    }
    ,
    _h_w_names: {
        fontWeight: 'bold',
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
        backgroundColor:constants.colors.fabColor,
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    headerView: {
        height: Platform.OS === "ios" ? 44 : 56,
        backgroundColor: "#00695c",
        flexDirection: 'row',
    },
    _h_w_category:{
        color:'#fff',
        fontSize:18,
        fontStyle:'italic',
        fontWeight:'bold',
        textAlign:'center',
        marginBottom: 10
    },
    _h_w_profile_view:{
        height:240,
        width:'100%',
        backgroundColor: "#00695c",
    },
    _h_w_d_profile_img:{
        height:150,
        width:150,
        borderRadius:75,
        marginTop: 18,
        marginBottom: 10,
        alignSelf: 'center',
    },
    _h_w_card_container:{
        backgroundColor:"#fff",
        elevation:4,
        borderRadius:3,
        marginHorizontal:8,
        marginTop:-30,
        paddingBottom:30
    },
    leftArea:{
        flexDirection: 'row',
        alignItems:'center',
        
        
    },
    tilesArea:{
        flexDirection: 'column',
        justifyContent:'space-between',
        paddingVertical: 25,
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