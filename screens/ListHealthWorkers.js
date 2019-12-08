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

export default class ListHealthWorkers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      loadingHealthWorkers:true,
      healthWorkers: null,
      searchRequested:false,
      loadingHWErrors:null
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#003d33" hidden={false} />

        <View style={styles.headerView}>
          <View style={styles.iconGroup}>
          {
            this.state.searchRequested?(
              <TextInput
                underlineColorAndroid="transparent"
                placeholderTextColor="white"
                placeholder="Rechercher médécin/spéc..."
                style={styles.searchInput}
                value={this.state.query}
                onChangeText={this._updateSearch}
                ref={(input) => { this.searchInput=input} }
              />
            ):(
                <Text  underlineColorAndroid="transparent" placeholderTextColor="transparent" style={[styles.titleContainer,{marginHorizontal:10}]}>
                  Liste des médécins
                </Text>
            )
          }
            
            <TouchableOpacity style={{ padding: 10 }}
              onPress={() => {
                if(this.state.searchRequested){
                  this._hideSearchInput()
                }else{
                  this._showSearchInput()
                }
              }}>
              {
                this.state.searchRequested?
                  (
                    <Icon name="ios-close" size={28} color={"#fff"} style={{ marginTop: 5}}/>
                  ):(
                    <Icon name="ios-search" size={28} color={"#fff"} style={{ marginTop: 5}}/>
                  )
              }
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>
          <List
            style={{
              marginBottom: 60 //Accordingly to bottom nav 56
            }}
          >
            {this._renderHealthWorkers()}
          </List>
        </ScrollView>

        {
          /*
          <TouchableOpacity style={styles.fab} onPress={()=>{this.requestRendezvous()}}>
            <Icon  name='plus' size={18} color='#fff'/>
          </TouchableOpacity>
        */
        }
      </View>
    );
  }

  _updateSearch =(text)=> {
    this.setState({
      query: text,
      selectedHealthWorker:null,
    });

    this._searchHealthWorker(text);
  }

  _hideSearchInput =()=> {
    this.setState({
      query: '',
      searchRequested:false
    });

    this._searchHealthWorker('');
  }


  _showSearchInput = async ()=> {
    await this.setState({
      searchRequested:true
    });

    this.searchInput.focus();
  }


  _renderHealthWorkers() {
    if (this.state.healthWorkers != null) {
      
      return (
        this.state.healthWorkers.map( (healthWorker,index) => {
            return(
               <ListItem avatar key={index} onPress={()=> {                
                 this._showHealthWorkerDetails(healthWorker);
               }}>
                  <Left>
                    <Thumbnail source={healthWorker.user.gender.toLowerCase()==='f'?femme:homme} style={styles._h_w_avatar} />
                  </Left>
                  <Body>
                    <Text numberOfLines={1} style={styles._h_w_names}>{healthWorker.user.lastname.toUpperCase()+" "+Str.capitalize(healthWorker.user.firstname)}</Text>
                    <Text note numberOfLines={1} style={styles._h_w_category}>{healthWorker.moreinfos.speciality}</Text>
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
        if(this.state.loadingHealthWorkers){
          return (
            <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
              <ActivityIndicator size="large"/>
            </View>
          );
        }else{
          return (
            <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
              <Text style={styles.searchEmptyText}>{this.state.loadingHWErrors?this.state.loadingHWErrors:'Aucun médécin trouvé'}</Text>
            </View>
          );
        }
    }
  }

  _searchHealthWorker(query) {
    if (query) {
      RequestHandler.searchHealthWorker(query,
        this.updateHealthWorkers,
        this.handleRequestErrors
      );
    }else{
      RequestHandler.listHealthWorkers(
        this.updateHealthWorkers,
        this.handleRequestErrors
      );
    }
  }

  _showHealthWorkerDetails(healthWorker) {
    this.setState({
      selectedHealthWorker:healthWorker
    });

    let {navigation} = this.props;

    navigation.navigate("ShowHealthWorkerInfo",{
      data:healthWorker
    });
  }


  componentDidMount = () => {
    loadingHealthWorkers=true;
    this.setState({
      loadingHealthWorkers
    })
    RequestHandler.listHealthWorkers(
      this.updateHealthWorkers,
      this.handleRequestErrors
    );
  }

  updateHealthWorkers=(response)=>{
    loadingHealthWorkers=false;
    
    this.setState({
      loadingHealthWorkers,
      healthWorkers: response.data
    })
    if(response.status!=='success'){
      this.setState({
        loadingHWErrors:"Recherche non fructueuse",
      })
    }
  }

  handleRequestErrors(error){
    loadingHealthWorkers=false;
    this.setState({
      loadingHealthWorkers,
      loadingHWErrors:error,
    })
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
    backgroundColor: "#fff"
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
  headerView: {
    height: Platform.OS === "ios" ? 44 : 56,
    backgroundColor: "#00695c"
  },
  iconGroup: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  searchInput: {
    color: "#fff",
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
  }
});
