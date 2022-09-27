import React, { Component } from "react";

import {
  View,
  ScrollView,
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Alert
} from "react-native";

import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';

import { List, ListItem, Thumbnail, Left, Right, Body } from "native-base";

import Icon from 'react-native-vector-icons/Ionicons';
import RequestHandler from "../utils/RequestHandler";
import constants from "../utils/constants";
import Str from "../utils/Str";


import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";


export default class MyOpinions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      loadingMyOpinions:true,
      myOpinions: [],
      loadingHWErrors:null,
      isEmptyTextInput: false,

    };

    this.myTextInput = React.createRef();
  }
  render() {
    return (
      <View>
        <StatusBar backgroundColor="#003d33" hidden={false} />


        <ScrollView>
          <List
            style={{
              marginBottom: 60 //Accordingly to bottom nav 56
            }}
          >
            {this._renderMyOpinions()}
          </List>
        </ScrollView>

       
      </View>
    );
  }

  

  



  

  _renderMyOpinions() {
    if (this.state.myOpinions != null && this.state.myOpinions != undefined && this.state.myOpinions.length > 0) {
      
      return (
        this.state.myOpinions.map( (myOpinion,index) => {
            return(
               <ListItem avatar key={index} onPress={()=> {                
                 
                 
                 console.log("HEALTH WORKER WAS PRESSED: ", myOpinion);
               }}>

                  <Left>
                  <Text>
                    N°{myOpinion.poll_item_id}
                    </Text>
                  </Left>

                  <Body>
                    <Text numberOfLines={1} style={styles._h_w_names}>
                    {myOpinion.content}
                    </Text>
                    <Text note numberOfLines={1} style={styles._h_w_category}>
                    </Text>
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
        if(this.state.loadingMyOpinions){
          return (
            <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
              <ActivityIndicator size="large"/>
            </View>
          );
        }else{
          return (
            <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
              <Text style={styles.searchEmptyText}>{this.state.loadingHWErrors?this.state.loadingHWErrors:'Aucune carte'}</Text>
            </View>
          );
        }
    }
  }

  

  

  


  componentDidMount = async() => {
    let user_token = await AsyncStorage.getItem("@userInfos");
    let data = await AsyncStorage.getItem("@myOpinions");

     await this.setState({
          
            user_token: user_token
        });



    if (data != null){
    
      await this.getMyOpinionsFromAsyncStorage();
    }else{
      await this.fetchMyOpinions();
    }

  }

  fetchMyOpinions = async (response) => {
    loadingMyOpinions=true;
    await this.setState({
      loadingMyOpinions
    })
    RequestHandler.myOpinions(
      this.state.user_token,
      this.myOpinionSuccess,
      this.myOpinionFailed
    );

  }

  myOpinionSuccess = response => {
    this.setState({
      loadingMyOpinions: false,
      myOpinions: response.comments
    });

    console.log("DEBUT DE RESPONSE de MY OPINIONS: ", response.status);
        console.log("DONNEES RECUS: ", response);

    
    if (response.status === "ok") {
      

  
    }
  };

  myOpinionFailed = error => {
    this.setState({
      loadingMyOpinions: false
    });
        
  };

  handleRequestErrors(error){
    loadingMyOpinions=false;
    this.setState({
      loadingMyOpinions,
      loadingHWErrors:error,
    })
  }

  saveMyOpinionsOnAsyncStorage = async () => {
    let myOpinions = this.state.myOpinions;
    if (myOpinions != null && myOpinions != undefined){
      await AsyncStorage.setItem("@myOpinions", JSON.stringify(myOpinions));
    }

    let data = await AsyncStorage.getItem("@myOpinions");
    //console.log("SAVING OPINIONS IN LOCAL", data )

    
  }

  getMyOpinionsFromAsyncStorage = async () => {
        let data = await AsyncStorage.getItem("@myOpinions");
        this.setState({
          myOpinions: JSON.parse(data)
        })

        console.log("GET OPINIONS FROM STORAGE: ", this.state.myOpinions);

  }

  renderAvatar(healthWorker) {
    if (healthWorker.avatar_url != null) {
      return <Thumbnail source={{ uri: healthWorker.avatar_url }}
        style={styles._h_w_avatar}
      />
    } else {
      return <Thumbnail source={homme}
        style={styles._h_w_avatar}
      />
    }
  }
}

const styles = StyleSheet.create({
  /**** HealthWorker Item Styles */
  _h_w_avatar:{
    height:65,
    width:65,
    borderRadius:32.5
  },
  _h_w_names:{
    fontSize:16,
    fontFamily:'candara',
    fontWeight: 'bold',
    color:'#000'
  },
  _h_w_category:{
    fontSize:17,
    fontFamily:'candara',
    fontStyle:'italic',
    color:'#212121',
    marginTop:8,
    marginBottom:5
  },
  fab:{
    width:50,
    height:50,
    bottom:25,
    right:20,
    borderRadius:25,
    backgroundColor:constants.colors.fabColor,
    position: 'absolute',
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 8
},
  /**** HealthWorker Item Styles */
  container: {
    flex: 1,
    /*backgroundColor: "#fff"*/
    backgroundColor: '#e1e1e2',
  },
  titleContainer:{
    color:'white',
    fontSize:18,
    textAlignVertical:'center'
  },
  searchEmptyText: {
    textAlign: "center",
    color: "orange",
    fontSize: 18,
    marginTop: 15,
    fontStyle: "italic"
  },
  headerView:{
    backgroundColor: "#00695c",
    height: Platform.select({
        "ios":44,
        "android":56
    })
  },
  modalHeaderView:{
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
  shadowRadius: 1.41,

  elevation: 2,
  },
  iconGroup: {
    flexDirection: "row",
    paddingHorizontal: 12
  },
  searchInput: {
    color: "black",
    fontSize: 18,
    paddingHorizontal: 8
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textMain: {
    textAlign: "center",
    color: "#000",
    fontStyle: "italic"
  },
  searchHealthWorkerInputStyle:{
    flex:1,
    flexDirection:'row',
    color: "black",
    fontSize: 18,
    marginTop:4,
    paddingHorizontal: 8
  },
  toolbarTitle:{
    flex: 1,
    fontSize: 18,
    color:"#FFF",
    paddingHorizontal:8,
    marginTop:15
  }
});
