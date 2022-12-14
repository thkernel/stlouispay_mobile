import React, { Component } from "react";
import { StyleSheet, Text, View, Button, ScrollView , StatusBar, TouchableOpacity, TouchableHighlight,Dimensions, Image, Platform} from "react-native";
import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';

import constants from '../utils/constants';
import RequestHandler from '../utils/RequestHandler';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator } from "react-native-paper";


const height = Dimensions.get("window").height / 3

export default class QRCodeData extends Component {
  constructor(props) {
    super(props);

    this.state = { qrCodeData: " ", 
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

    const qrCodeData = this.props.navigation.getParam("data", "No data read");
    const scanner = this.props.navigation.getParam("scanner", () => false);

    await this.setState({
        qrCodeData: qrCodeData, 
        scanner: scanner 
    });



    // Get Card by uid
    await this.fetchCardByUID();
    
    //console.log("ON QRCODE DATA DID MOUNT");

  }

  fetchCardByUID = async (response) => {
    
    loadingCard = true;
    loadingCardFailed = false;
    
    await this.setState({
      loadingCard,
      loadingCardFailed
    });

    RequestHandler.getCardByUID(
      this.state.qrCodeData,
      this.getCardSuccess,
      this.getCardFailed
    );

  }

  getCardSuccess = response => {
    console.log("DEBUT DE RESPONSE de card: ", response.status);
    console.log("DONNEES RECUS: ", response);

    if (response.status === 'ok') {
      console.log("OK STATUS");
      this.setState({
        loadingCard: false,
        card: response
      });
      alert(response.message);
      let {navigation} = this.props;
       navigation.navigate("Home");
      
  
    }else{
      console.log("ERROR STATUS");
      this.setState({
        card: null,
        loadingCard: false,
        loadingCardFailed: true,
      });

      alert(response.message);
    }
  };

  getCardFailed = error => {
    //console.log("ERROR CASE : ", error);
    this.setState({
      loadingCard: false,
      loadingCardFailed: true,
    });

    alert(error);
        
  };

  

  _renderCard() {
 
    if(this.state.loadingCard){
        return (
          <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
            <ActivityIndicator color="#912455" size="large"/>
          </View>
        );
      }else if(this.state.loadingCardFailed){
        return (
                <View>
                  <StatusBar backgroundColor="#912455" hidden={false} />
               
                    <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#f3f3f3'}}>

                      <View style={styles._h_w_profile_view}>
                          <View style={styles.container}>
                            <Text style={styles.text}>{this.state.qrCodeData}</Text>

                              <Button
                                title={"Scanner encore!"}
                                onPress={() => this.scanQRCodeAgain()}
                              />
          
                          </View>
                        </View>
                       </ScrollView>
                   </View>

        )
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
    _h_w_card_container:{
        backgroundColor:"#fff",
        elevation:4,
        borderRadius:3,
        marginHorizontal:8,
        marginTop:-30,
        marginBottom:15,
        paddingVertical: 30,
    },
    _h_w_category:{
        color:'#fff',
        fontSize:18,
        fontStyle:'italic',
        fontWeight:'bold',
        textAlign:'center',
        marginBottom: 10
    }
});