import React from 'react';
import {BackHandler, TextInput, ScrollView, Text, View, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
//import QRCode from 'react-native-qrcode-generator';
import QRCode from 'react-native-qrcode-svg';

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
import logo from '../assets/icon-holilink.png';
import HTML from 'react-native-render-html';


export default class CardDetails extends React.Component{

    constructor(props){
        super(props);
        this.state =  {
            card:null,
            userInfo:null,
            request:'',
           
            
            
            
            
        }
    }

    render(){
        let {navigation} = this.props;
        return (
            <View>
                
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                        <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                    </TouchableOpacity>

                    <View style={styles.tilesArea}>
                        <Text style={[styles.toolbarTitle,{fontStyle:'italic',fontFamily:'candara'}]}>Carte de visite</Text>
                    </View>

                    

                   
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#f3f3f3'}}>

                    <View style={styles._h_w_profile_view}>

                        {this._renderCardThumbnail(this.state.card) }

                        <Text style={styles._h_w_category}>{this.state.card.last_name} {this.state.card.first_name}</Text>
                    
                    </View>

                    <View style={styles._h_w_card_container}>
                        <View style={{flexDirection:'row',paddingVertical:10}}>
                            <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'justify',fontSize:16,paddingHorizontal:18}}>Informations</Text>
                        </View>

                        <View style={{textAlign:'justify', fontSize:18,paddingHorizontal:8,color:'#212121'}}>
                            

                             

                            <Text numberOfLines={1} style={styles._h_w_names}>Nom et prénom: {this.state.card.last_name} {this.state.card.first_name}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Fonction:  {this.state.card.work_position}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Organisation:  {this.state.card.organization}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Téléphone bureau:  {this.state.card.work_phone}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Téléphone mobile:  {this.state.card.mobile_phone}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Fax du bureau:  {this.state.card.work_fax}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Fax personnel:  {this.state.card.private_faxe}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Email:  {this.state.card.email}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Site web:  {this.state.card.website}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Rue:  {this.state.card.street}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Code postal:  {this.state.card.zipcode}</Text>
                            <Text numberOfLines={1} style={styles._h_w_names}>Ville/Pays:  {this.state.card.city} - {this.state.card.country}</Text>





                       


                                       
                            
                        </View>
                        
                        

                        
                        <View style={styles._qrcode}>

                        <QRCode 
                            value={this.state.card.uid}
                            
                            />
                    
                        </View>

                        
                    </View>           
                </ScrollView>

                 
            </View>
        );
    }

    

    

    _renderCardThumbnail = (card) => {
        if (card.thumbnail_url !== null){
            return(
                <Thumbnail source={{uri: card.thumbnail_url}}   style={styles._h_w_d_profile_img} />

            )
        }
        else{
            return(
                <Thumbnail source={homme}   style={styles._h_w_d_profile_img} />

            )
        }
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
      console.log("COMPONENT WILL MOUNT", this.state);
        let {params} = this.props.navigation.state;

        console.log("PARAMETRES TRANSMIS: ", params);

        await this.setState({
            card: params.card,
            card_id: params.card.id,

        });

        

        //console.log("CURRENT CARD ID: ", this.state.data.id);
        console.log("CURRENT CARD : ", this.state.card);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        
    }

    componentDidMount = async () => {
    
    console.log("COMPONENT DID MOUNT", this.state);
     let user_token = await AsyncStorage.getItem("@userInfos");
     await this.setState({
           // poll_item_id = navigation.state.params.pollItem.id,
            user_token: user_token
        });
     console.log("USER TOKEN", this.state.user_token);

    //await this._fetchCanVotingAndCommenting();

    
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
        backgroundColor: constants.colors.toolBar,
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
    _qrcode:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    _h_w_profile_view:{
        height:240,
        width:'100%',
        backgroundColor: constants.colors.toolBar,
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