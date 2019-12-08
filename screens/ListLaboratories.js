import React from "react";

import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  TextInput,
  FlatList,
  Modal,
  Linking,
  Share,
  Alert
} from "react-native";

import { ActivityIndicator } from "react-native-paper";

import Icon from "react-native-vector-icons/Ionicons";

import RequestHandler from "../utils/RequestHandler";

import contants from "../utils/constants";

import AsyncStorage  from '@react-native-community/async-storage'

import { List,Thumbnail, ListItem, Left, Right, Body } from "native-base";

import Snackbar from 'react-native-snackbar';

import {NavigationActions} from 'react-navigation'

import logo from "../assets/private/labo.png"

export default class ListLaboratories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      structures: null,
      requestedStructureName:'',
      loadingStructures:false
    };
  }

  /*<>*/
  render() {
   
    return (
      <View> 
        <StatusBar backgroundColor="#003d33" hidden={false} />
        <View style={styles.headerView}>
          <View style={styles.iconGroup}>

            {
              this.state.searchStructuresRequested?
              (<TextInput
                  ref={(input)=>{this.searchStructuresInput = input}}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="white"
                  placeholder="Rechercher un labo"
                  style={styles.searchStructureInputStyle}
                  value={this.state.requestedStructureName}
                  onChangeText={this._updateStructuresSearch}
                />
              ):(
                <Text style={styles.toolbarTitle}>
                  Liste des Laboratoires
                </Text>
              )
            }
            
            <TouchableOpacity title="Bouton" ref={input => {this.appTourTarget = input}} style={{ padding: 10 }} onPress={()=>{this._showSearchStructures()}}>
              {
                this.state.searchStructuresRequested?
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
            <List style={{
                marginBottom:60 //Accordingly to bottom nav 56
            }}>
                {this.renderStructures()}
            </List>
            {/*
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.showSearchModal}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                this._hideSearchModal()
              }}>
                <View style={{marginTop: 0}}>
                  {this.renderModalHeader()}
                </View>
            </Modal>
            */}
        </ScrollView>
      </View>
    );
  }

  renderStructures =() =>{
      let self = this;
      if(this.state.structures){
          let structuresViews = [];

          let {structures}=this.state;
          structures.forEach (function(structure,index){
              structuresViews.push(
                <ListItem selected avatar key={index} onPress={()=>{
                    self._showStructureDetails(structure);
                }} style={{/*backgroundColor:'#80CBC4'*/}}>
                    <Left>
                        <Thumbnail source={logo} style={{width:45,height:45}}/>
                    </Left>

                    <Body>
                        <Text style={styles.structureNameStyle} accessibilityLabel="Nom de la structure" title="Structure">
                            {structure.name}
                        </Text>

                        <Text style={styles.cityNameStyle}>
                            {structure.city?structure.city.name:"Non définit"}
                          </Text>
                    </Body>

                    <Right>
                        
                    </Right>
                </ListItem>
              );
          });

          return structuresViews;
      }else{
        if(self.state.loadingStructures){
          const height = (Dimensions.get("window").height)/3
          return (
            <View style={{flex:1,alignItems: "center", justifyContent:'center',marginTop:height }}>
              <ActivityIndicator size='large'/>
          </View>
          )
        }else{
          const height = (Dimensions.get("screen").height)/2 + Platform.OS === 'ios'?44:56
          return (
              <View style={{ flex:1, alignItems:'center', marginTop:height }}>
                <Image
                  source={require("../assets/pharmacy.png")}
                  style={styles.structureItemIcon}
                />
                <Text style={{ textAlign: "center", color: "orange", fontSize: 18 }}>
                  Aucun laboratoire trouvée
                </Text>
              </View>
          )
        }
      }
  }

  _showStructureDetails  = (structure)=>{
      let {navigation} = this.props;

      navigation.navigate("ShowStructureInfos",{
          structure,
          type:'labo'
      })
  }

  async _showSearchStructures (){
    if(this.state.searchStructuresRequested){
      this.setState({
        searchStructuresRequested:false,
        requestedStructureName:''
      });

      this._updateStructuresSearch('')
    }else{
      await this.setState({
        searchStructuresRequested:true
      });
      this.searchStructuresInput.focus()
    }
  }

  _updateStructuresSearch = (requestedStructureName)=>{
    this.setState({
      requestedStructureName,
      loadingStructures:true
    })
    if(requestedStructureName.trim()){
      let params={
        category:"labo",
        query:requestedStructureName.trim()
      }
      RequestHandler.searchStructure(
        params,
        this.listStructuresDone,
        this.listStructuresError
      );
    }else{
      RequestHandler.listStructures(
        "labo",  
        this.listStructuresDone,
        this.listStructuresError
      );
    }
  }

  componentDidMount =  async () => {
    loadingStructures=true;
    this.setState({
      loadingStructures
    })

    RequestHandler.listStructures(
        "labo",  
        this.listStructuresDone,
        this.listStructuresError
    );
  };
  
  shouldComponentUpdate = () => {
    return true;
  }

  listStructuresDone = response => {
    loadingStructures=false;
    this.setState({
      structures: response.data,
      loadingStructures
    });
  };

  listStructuresError = error => {
    loadingStructures=false;
    this.setState({
      structuresLoadingErr: error,
      loadingStructures
    });
  };
}

const styles = StyleSheet.create({
  divider:{
    height:1,
    backgroundColor:'#00695C',
    alignSelf:'center',
    width:'30%',
    marginVertical: 5,
  },
  verticalDivider:{
    backgroundColor:'#3F51B5',
    height:25,
    width:1,
    marginHorizontal:8
  },
  bottomTitleView:{
    paddingVertical:15, 
    paddingHorizontal:5,
    fontSize:15, 
    color:'#fff', 
    top:0,
    marginTop:0,
    width:'100%',
    textAlign:'center',
    backgroundColor:'#00665C'
  },
  main: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10,
    marginBottom: 20
  },
  mt20: {
    marginTop: 20
  },
  searchBar: {},
  iconGroup: {
    flexDirection: "row",
    paddingHorizontal: 16
  },
  headerView:{
    backgroundColor: "#00695c",
    height: Platform.select({
        "ios":44,
        "android":56
    })
  },
  toolbarTitle:{ 
    flex: 1,
    fontSize: 18,
    color:"#FFF",
    paddingHorizontal:8,
    marginTop:15
   },
   structureItem: {
    flexDirection: "row"
  },
  structureItemIcon: {
    width: 45,
    height: 45,
    marginHorizontal: 15
  },
  structureItemTitle: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 18
  },
  structureItemDesc: {
    color: "#000",
    fontSize: 16,
    marginTop: 15
  },
  distance:{
    fontSize:13,
    fontWeight:'bold',
    color:'#000'
  },
  structureNameStyle:{
    fontSize:14,
    fontWeight:'bold',
    textTransform:'uppercase',
    color:'#000'
  },
  cityNameStyle:{
    marginTop:8,
    marginBottom:4,
    fontSize:14,
    textTransform:'uppercase',
    color:'#000'
  },
  markerStyle:{
    width:24,
    height:24
  },

  MainContainer: {
    flex: 1,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA'

  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 250,
    justifyContent: 'center'
  },
  text: {
    padding: 10,
    textAlign: 'center',
    fontSize: 20
  },
  searchStructureInputStyle:{
    flex:1,
    flexDirection:'row',
    color: "#fff",
    fontSize: 18,
    marginTop:4,
    paddingHorizontal: 8
  },
  iconGroup:{
    flexDirection: "row",
    paddingHorizontal: 12
  },
  toolbarTitle:{
    flex: 1,
    fontSize: 18,
    color:"#FFF",
    paddingHorizontal:8,
    marginTop:15
  },
  medicineNameStyle:{
    color:"#000"
  },
  medicineMatchesStyles:{
      color:"#000"
  }
});
