import React from 'react';
import {BackHandler, TextInput, ScrollView, Text, View,   ToastAndroid,
StyleSheet, StatusBar, TouchableOpacity, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

import {BottomSheet}  from 'react-native-btr'

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Str from '../utils/Str';

import constants from '../utils/constants';
import Snackbar from 'react-native-snackbar';

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';
import RequestHandler from '../utils/RequestHandler';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

export default class NewOpinion extends React.Component{

    constructor(props){
        super(props);
        this.state =  {
            pollItem:null,
            userInfo:null,
            user_token: null,
            content: '',
            connecting: false,
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

                    

                    <View style={styles.tilesArea}>
                        <Text style={[styles.toolbarTitle,{fontStyle:'italic',fontFamily:'candara'}]}>Mon opinion</Text>
                    </View>

                    
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#f3f3f3'}}>

                   
                    <View style={styles.tilesArea}>
                        

                          <TextInput
                            underlineColorAndroid={"#00000000"}
                            multiline = {true}
                            numberOfLines = {4}
                            returnKeyType="next"
                            placeholderTextColor={"#000"}
                            placeholder="Votre opinion ici!"
                            style={styles.input}
                            value={this.state.content}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={this.handleContentChange}
                            ref={input => {this.contentInput = input;}}
                            onSubmitEditing={() => {this.contentInput.focus();}}
                          />

                          <TouchableOpacity
                            style={styles.loginbtn}
                            onPress={this.sendOpinion}
                          >
                            {
                              this.state.connecting ? ( <ActivityIndicator size="large" color={"#FF0000"} />) : (
                              <Text style={[styles.logintext,{fontFamily:'candara'}]}> ENVOYER</Text>)
                            }
                          </TouchableOpacity>

                    </View>
                            
                </ScrollView>

                 
            </View>
        );
    }

    
    

    async componentDidMount(){
        let user_token= await AsyncStorage.getItem("@userInfos");
        let {navigation} = this.props;
        await this.setState({
            pollItem: navigation.state.params.pollItem,
            poll_item_id: navigation.state.params.pollItem.id,
            
            user_token: user_token
        });

    

        console.log("DONNEES TRANSMIS: ", this.state.pollItem);
        console.log("USER INFOS: ", user_token);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    
    handleContentChange = text =>{
        this.setState({
      content: text
    });
    }


    sendOpinion = () => {
    let { poll_item_id, content, user_token } = this.state;
    
    if (content.trim() !== "" ) {
      this.setState({
        connecting: true
      });

      console.log("POLL ITEM ID: ", poll_item_id);
      console.log("MESSAGE: ", content);

      console.log("SEND DATA");

      RequestHandler.newOpinion(
        poll_item_id, content, user_token,
        this.opinionSuccess,
        this.opinionFailed
      );
    } else {
      let errorMessage="";
        if (message.trim() === "") {
        errorMessage = "Veuillez renseigner tout les champs!";
      } else {
        errorMessage = "Veuillez renseigner tout les champs!";
      }

      Snackbar.show({
        title: errorMessage,
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
  };

  opinionSuccess = response => {
    this.setState({
      connecting: false
    });

    console.log("DEBUT DE RESPONSE: ", response.status);
    ToastAndroid.showWithGravity(
      response.message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );

    if (response.status === "ok") {
      

      try{
        
        let {navigation} = this.props;
        navigation.navigate("Home");
              alert("Votre opinion  a été publiée!");

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

  opinionFailed = error => {
    this.setState({
      connecting: false
    });
        console.log("RESPONSE FAILED: ", error);
        console.log(JSON.stringify(error));
  };






    

  
    
    async getUserInfo(){
        let user = await AsyncStorage.getItem("@userInfos");
        this.setState({
            userInfo:user
        })
    }

    componentWillUnmount(){
        /*this._hideWorkerDays()*/
        //BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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
        //height: Platform.OS === "ios" ? 44 : 56,
        backgroundColor: "#00695c",
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
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
    }, 
    loginbtn: {
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginTop: 12,
        fontFamily:'candara',
        borderRadius: 3,
        /*backgroundColor: "#3F51B5"*/
        backgroundColor: constants.colors.toolBar
    },
  logintext: {
    color: "#FFF",
    padding: 4,
    fontFamily:'candara',
    fontWeight: "bold",
    textAlign: "center"
  },
  input: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 6,
    textAlign: "center",
    marginVertical: 10,
    marginHorizontal: 8,
    borderColor: constants.colors.toolBar,
    fontSize: 14,
    fontFamily:'candara',
    color: "#000",
    borderWidth: 0.5
  }
});