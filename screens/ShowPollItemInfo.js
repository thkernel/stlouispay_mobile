import React from 'react';
import {BackHandler, TextInput, ScrollView, Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image, Platform} from 'react-native';
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

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';
import RequestHandler from '../utils/RequestHandler';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

import HTML from 'react-native-render-html';


export default class ShowPollItemInfo extends React.Component{

    constructor(props){
        super(props);
        this.state =  {
            pollItem:null,
            userInfo:null,
            canVoting: false,
            canCommenting: false,
            
           
            request:'',
            
            
            
            
        }
    }

    render(){
        let {navigation} = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#003d33" hidden={false} />
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                        <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                    </TouchableOpacity>

                    

                   
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

                        <View style={[styles.sideDivider,{width:'35%', marginBottom:10,backgroundColor:constants.colors.statusBar}]}/>
                        

                        <View style={{flexDirection:'row',flexWrap:'wrap',alignSelf:'center',paddingBottom:10, maxWidth:'90%',overflow:'scroll'}}>
                            
                                
                            <TouchableOpacity disabled={!this.state.canCommenting} style={{borderColor:'#1B5E20',textTransform:'uppercase',borderWidth:1,fontWeight:'bold',color:"#1B5E20",textAlignVertical:'center', textAlign:'center',fontSize:16,paddingHorizontal:4,paddingVertical:4,backgroundColor:'#fff', marginHorizontal:2, marginVertical:2}} onPress={()=>{this._renderNewOpinion(this.state.pollItem)}}>
                            <Text style={styles.newsItemLinkText}>
                              <FontAwesome name="comment-o" size={16} color="#2196F3" style={{marginHorizontal:8}}/> OPINION
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity disabled={!this.state.canVoting} style={{borderColor:'#1B5E20',textTransform:'uppercase',borderWidth:1,fontWeight:'bold',color:"#1B5E20",textAlignVertical:'center', textAlign:'center',fontSize:16,paddingHorizontal:4,paddingVertical:4,backgroundColor:'#fff', marginHorizontal:2, marginVertical:2}} onPress={()=>{this._sendVoting()}} >
                            <Text style={styles.newsItemLinkText}>
                              <FontAwesome name="star-o" size={16} color="#2196F3" style={{marginHorizontal:8}}/> VOTER
                            </Text>
                          </TouchableOpacity>


                                       
                            
                        </View>
                        
                        

                        <View style={[styles.sideDivider,{width:'35%', marginBottom:10,backgroundColor:constants.colors.statusBar}]}/>
                        {
                            
                        }
                    </View>           
                </ScrollView>

                 
            </View>
        );
    }

    

    _renderNewOpinion = (pollItem) => {
      console.log("NEW OPINION");
      let {navigation} = this.props; 

      navigation.navigate("NewOpinion",{
        pollItem: pollItem
      });


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


    _sendVoting = () => {
        let { poll_item_id, user_token } = this.state;
    
    

      console.log("POLL ITEM ID BEFORE VOTING: ", poll_item_id);

      console.log("SEND DATA");

      RequestHandler.newVoting(
        poll_item_id, user_token,
        this.votingSuccess,
        this.votingFailed
      );
    
    
  };

  votingSuccess = response => {
    

    console.log("DEBUT DE RESPONSE: ", response.status);
    

    if (response.status === "ok") {
      

      try{
        
        let {navigation} = this.props;
        navigation.navigate("Home");
              alert("Vote enregistré avec succès!");

      }catch(e){
        Snackbar.show({
          title: e,
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
    }else{
      console.log("Reponse du serveur: ", response);
      alert("Une erreur s'est produite!")
    }
  };

  votingFailed = error => {
    this.setState({
      connecting: false
    });
        console.log("RESPONSE FAILED: ", error);
        console.log(JSON.stringify(error));
  };


   
    

 
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

        

        console.log("CURRENT POLL ITEM ID: ", this.state.poll_item_id);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        
    }

    componentDidMount = async () => {
    
    
     let user_token = await AsyncStorage.getItem("@userInfos");
     await this.setState({
           // poll_item_id = navigation.state.params.pollItem.id,
            user_token: user_token
        });
     console.log("USER TOKEN", this.state.user_token);

    await this._fetchCanVotingAndCommenting();
    
  }


  _fetchCanVotingAndCommenting = ()=>{

        console.log("AVANT FETCH VOTING AND COMMENTING");
        console.log("USER TOKEN",this.state.user_token);
        console.log("POLL ITEM",this.state.pollItem);
            
        if(this.state.user_token && this.state.pollItem){

            console.log("IN FETCH VOTING AND COMMENTING CONDITION");
            
            let user_token= this.state.user_token;
            let poll_item_id = this.state.pollItem.id;

            RequestHandler.getCanVotingAndCommenting(
                user_token,
                poll_item_id,
                this._canVotingAndCommentingSuccess,
                this._canVotingAndCommentingFailure,
            )
        }

        console.log("CURRENT STATE: ", this.state);
    }


    _canVotingAndCommentingSuccess = response => {
    

    console.log("DEBUT DE RESPONSE POUR CAN VOTING AND COMMENTING: ", response);
    

    if (response.status === "ok") {
      

      this.setState({
        
        canCommenting: response.can_commenting,
        canVoting: response.can_voting,

      });


      console.log("CURRENT STATE AFTER FETCH VOTING AND COMMENTING: ", this.state);

    }
    else if(response.status === "no"){
        this.setState({
        
        canCommenting: false,
        canVoting: false,

      });
    }else{
      console.log("Reponse du serveur: ", response);
      //alert("Une erreur s'est produite!")
    }
  };

  _canVotingAndCommentingFailed = error => {
    
        console.log("RESPONSE FAILED: ", error);
        console.log(JSON.stringify(error));
  };

    



    handleBackPress = ()=>{
        if (this.state.showWorkerPlacesBottomSheet) {
          this._hideWorkerDays();
          return true;
        }
        return false;
    }
    
    async getUserInfo(){
        let user = await AsyncStorage.getItem('@userInfos');
        this.setState({
            userInfo:user
        })
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
        marginBottom:15
    },
    leftArea:{
        flexDirection: 'row',
        alignItems:'center'
    },
    tilesArea:{
        flexDirection: 'column',
        justifyContent:'space-between',
        paddingVertical: 8,
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