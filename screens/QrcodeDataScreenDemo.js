import React, { Component } from "react";
import { StyleSheet, Text, View,Dimensions, Button, ScrollView , StatusBar, TouchableOpacity, TouchableHighlight, Image, Platform} from "react-native";
import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';

import constants from '../utils/constants';
import RequestHandler from '../utils/RequestHandler';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator } from "react-native-paper";


export default class QRCodeDataDemo extends Component {
  constructor(props) {
    super(props);

    this.state = { qrCodeData: "11997252831", 
    scanner: undefined,
    card: undefined
  };
  }

/*
  componentDidMount() {
    

    const qrCodeData = this.props.navigation.getParam("data", "No data read");
    const scanner = this.props.navigation.getParam("scanner", () => false);

    this.setState({ qrCodeData: qrCodeData, scanner: scanner });


  }
  */

  componentDidMount = async() => {
    //let user_token = await AsyncStorage.getItem("@userInfos");
    //let data = await AsyncStorage.getItem("@myVotes");

    const qrCodeData = "11997252831";
    const scanner = this.props.navigation.getParam("scanner", () => false);

    await this.setState({
        qrCodeData: "11997252831", 
        scanner: scanner

    });



    // Get Card by uid
    await this.fetchCardByUID();
    
    console.log("ON QRCODE DATA DEMO DID MOUNT");

  }

  fetchCardByUID = async (response) => {
    loadingCard = true;
    loadingCardFailed = false;
    await this.setState({
      loadingCard,
      loadingCardFailed
    })
    RequestHandler.getCardByUID(
      this.state.qrCodeData,
      this.getCardSuccess,
      this.getCardFailed
    );

  }

  getCardSuccess = response => {
    
    console.log("DEBUT DE RESPONSE de card: ", response.status);
    console.log("DONNEES RECUS: ", response);

    if (response) {
      
      this.setState({
        loadingCard: false,
        card: response
      });
  
    }
  };

  getCardFailed = error => {
    this.setState({
      loadingCard: false,
      loadingCardFailed: true,

    });
        
  };

  

  _renderCard() {
    if (this.state.card != null && this.state.card != undefined ) {
      
      return (
            <View>
                <StatusBar backgroundColor="#912455" hidden={false} />
               
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

                       
                    
                        </View>

                        
                    </View>           
                </ScrollView>

                <View style={styles._saveCard}>
                  

                  <Button
                    buttonStyle={styles._button}
                    title={"Enregistrer"}
                    onPress={() => this.selectPortfolioDialog(this.state.card)}
                  />
        
                </View>

                 
            </View>
        );
    } 
    else {

      const height =
      Dimensions.get("window").height / 3
      if(this.state.loadingCard){
        return (
          <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
            <ActivityIndicator color="#912455" size="large"/>
          </View>
        );
      }else if(this.state.loadingCardFailed){
        return (
          <View style={styles.container}>
            <Text style={styles.text}>{this.state.qrCodeData}</Text>

            <Button
              title={"Scanner encore!"}
              onPress={() => this.scanQRCodeAgain()}
            />
          
        </View>
        )
      }
    }
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



  scanQRCodeAgain() {
    this.state.scanner.reactivate();
    this.props.navigation.goBack();
  }

  selectPortfolioDialog(card){
    let {navigation} = this.props;

    navigation.navigate("SelectPortfolioDialog",{
      card: card
    })
  }

  render() {
    return (
      <View>
        {this._renderCard() }
        </View>
      
    );
  }


  renderBak() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.state.qrCodeData}</Text>
        <Button
          title={"Scanner encore!"}
          onPress={() => this.scanQRCodeAgain()}
        />
        <Button
          title={"Home"}
          onPress={() => this.props.navigation.popToTop()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  _h_w_profile_view:{
        height:240,
        width:'100%',
        backgroundColor: constants.colors.toolBar,
    },
    headerView: {
        height: Platform.OS === "ios" ? 44 : 56,
        backgroundColor: constants.colors.toolBar,
        flexDirection: 'row',
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
    _h_w_category:{
        color:'#fff',
        fontSize:18,
        fontStyle:'italic',
        fontWeight:'bold',
        textAlign:'center',
        marginBottom: 10
    },
    _h_w_card_container:{
        backgroundColor:"#fff",
        elevation:4,
        borderRadius:3,
        marginHorizontal:8,
        marginTop:-30,
        marginBottom:15,
        paddingVertical: 30,
    },
    _saveCard:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    _button: {
      backgroundColor:constants.colors.toolBar,
    }
});