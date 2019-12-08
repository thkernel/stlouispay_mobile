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
  PermissionsAndroid,
  Modal,
  Linking,
  Share,
  Alert
} from "react-native";

import { ActivityIndicator } from "react-native-paper";

import Permissions from 'react-native-permissions';

import Icon from "react-native-vector-icons/Ionicons";

import RequestHandler from "../utils/RequestHandler";

import contants from "../utils/constants";

import {BottomSheet}  from 'react-native-btr'

import AsyncStorage  from '@react-native-community/async-storage'

import { List,Thumbnail, ListItem, Left, Right, Body } from "native-base";

import Geolocation from '@react-native-community/geolocation';

import Snackbar from 'react-native-snackbar';

import {NavigationActions} from 'react-navigation'
import constants from "../utils/constants";

import contactsOk from "../assets/private/contacts_logo.png"
import contactsOff from "../assets/private/contacts_logo_disabled.png"

/*import {
  AppTour,
  AppTourSequence,
  AppTourView
} from 'react-native-taptargetview'*/
//Geolocation.setRNConfiguration(config);

export default class ListPharmacies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      pharmacies: null,
      locationPermissions:'denied', //denied, restricted, undetermined
      currentPosition:'',
      requestedPharmacyName:'',
      product:'',
      selectedIndex:-1,
      location:{},
      medicines:null,
      requestForProduct:'',
      showProgress: false,
      selectedPharmacy:null,
      showBottomSheet:false,
      showSearchModal:false,
      loadingPharmacies:false
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
              this.state.searchPharmaciesRequested?
              (<TextInput
                  ref= {(input)=>{this.searchPharmaciesInput = input}}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="white"
                  placeholder="Rechercher une pharmacie"
                  style={styles.searchMedicineInputStyle}
                  value={this.state.requestedPharmacyName}
                  onChangeText={this._updatePharmaciesSearch}
                />
              ):(
                <Text style={styles.toolbarTitle}>
                  Liste des pharmacies
                </Text>
              )
            }
            
            <TouchableOpacity ref={(input) => {this.appTourTarget = input}} style={{ padding: 10 }} onPress={()=>{this._showSearchPharmacies()}} onLongPress={()=>{this._showSearchModal()}}>
              {
                this.state.searchPharmaciesRequested?
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
            <List style={{marginBottom:60}}>
                {this.renderPharmacies()}
            </List>

            <Modal animationType="slide" transparent={false} visible={this.state.showSearchModal} onRequestClose={() => {this._hideSearchModal()}}>
                <View style={{marginTop: 0}}>
                  {this.renderModalHeader()}
                </View>
            </Modal>

            <BottomSheet
              visible={this.state.showBottomSheet}
              onBackButtonPress={this._hideNavigationSheet}
              onBackdropPress={this._hideNavigationSheet}>
              
              <View style={styles.bottomNavigationView}>
               
                <Text style={styles.bottomTitleView}>
                  {this.state.selectedPharmacy?this.state.selectedPharmacy.ref.name:'Non défini'}
                </Text>

                <View style={{marginTop:28,flexDirection:'row',justifyContent:'space-between', alignSelf:'center', width:'60%', marginBottom:10}}>
                  <TouchableOpacity onPress={()=>{this.callSelectedPharmacy()}}>
                    <Image source={contactsOk} style={{width:50,height:50}}/>
                  </TouchableOpacity>

                  <View style={[styles.verticalDivider,{marginTop:12}]}/>

                  <TouchableOpacity onPress={()=>{this.drawRouteToSelectedPharmacy()}}>
                    <Image source={require("../assets/private/direction.png")} style={{width:50,height:50}}/>
                  </TouchableOpacity>
                  
                  <View style={[styles.verticalDivider,{marginTop:12}]}/>
                  
                  <TouchableOpacity onPress={()=>{this.shareSelectedPharmacyLocation()}}>
                    <Image source={require("../assets/private/share.png")} style={{width:50,height:50}}/>
                  </TouchableOpacity>
                
                </View>

                <View style={[styles.divider,{marginVertical:5,width:'20%',height:2}]}/>
                <Text style={{color:constants.colors.statusBar, fontWeight:'bold',textAlign:'center',marginTop:6,fontStyle:'italic',fontSize:14}}>
                    &copy; 2019 Ko-Santé+ | by KOLANE Frédérick
                </Text>
              </View>
            </BottomSheet>
        </ScrollView>
      </View>
    );
  }

  renderModalHeader (){
    return (
      <View>
        <View style={styles.headerView}>
          <View style={styles.iconGroup}>
          <TouchableOpacity style={{ padding: 10 }} onPress={()=>{this._hideSearchModal()}}>
              <Icon
                  name="md-arrow-round-back" size={18} color={"#fff"} style={{ marginTop: 10}}
              />
              </TouchableOpacity>
              <TextInput
                  ref= {(input)=>{this.searchInput = input}}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="white"
                  placeholder="Rechercher un médicament"
                  style={styles.searchMedicineInputStyle}
                  value={this.state.request}
                  onChangeText={this._updateSearch}
              />
          </View>
        </View>

        <ScrollView>
          <List style={{}}>
              {this._renderMedicinesListView()}
          </List>
        </ScrollView>
      </View>
    )
  }

  _renderMedicinesListView = () => {
    let self = this;
    if(this.state.medicines !==null){
        let medicinesViews = [];

        let {medicines}=this.state;
        medicines.forEach (function(medicine,index){
            medicinesViews.push(
                <ListItem avatar key={index} onPress={()=>{
                    self._searchForRequestedMedicine(medicine.fullname);
                    self._hideSearchModal();
                }}>
                    <Left>
                        <Thumbnail source={require("../assets/mix-kosante.png")} style={{width:60,height:60,borderRadius:30}}/>
                    </Left>

                    <Body>
                        <Text style={styles.medicineNameStyle} accessibilityLabel="Nom de la pharmacie">
                            {medicine.fullname}
                        </Text>

                        <Text style={styles.medicineMatchesStyles}>
                            Disponible dans {(medicine.countable>1? medicine.countable+" pharmacies":medicine.countable+" pharmacie")}
                        </Text>
                    </Body>
                </ListItem>
            );
        });

        return medicinesViews;
    }else{
        if(self.state.loadingMedicines){
            const height = (Dimensions.get("window").height)/3
            return (
                <View style={{flex:1,alignItems: "center", justifyContent:'center',marginTop:height }}>
                <ActivityIndicator size='large'/>
            </View>
            )
        }else{
            const height = (Dimensions.get("screen").height)/3
            return (
                <View style={{ flex:1, alignItems:'center', marginTop:height }}>
                    <Text style={{ textAlign: "center", color: "red", fontSize: 18 }}>
                      {this.state.loadingMedicinesError?this.state.loadingMedicinesError:'Aucun médicament trouvé'}
                    </Text>
                </View>
            )
        }
    }
  }

  renderPharmacies =() =>{
      let {locationPermissions} = this.state;
      let self = this;
      if(this.state.pharmacies !==null){
          let pharmaciesViews = [];

          let {pharmacies}=this.state;
          pharmacies.forEach (function(pharmacy,index){
              pharmaciesViews.push(
                <ListItem avatar key={index} onPress={()=>{
                    self.setState({
                      selectedPharmacy:pharmacy
                    });
                    self._showNavigationView();
                }}>
                    <Left>
                        <Thumbnail source={require("../assets/pharmacy.png")} style={{width:60,height:60}}/>
                    </Left>

                    <Body>
                        <Text style={styles.pharmacyNameStyle} accessibilityLabel="Nom de la pharmacie">
                            {pharmacy.ref.name}
                        </Text>

                        <Text style={styles.cityNameStyle}>
                            {pharmacy.ref.city?pharmacy.ref.city.name:"Non définit"}
                          </Text>
                    </Body>

                    <Right>
                        <Text style={styles.distance}>
                          {self.getDistanceToPharmacy(pharmacy.ref.location.split(","))}
                        </Text>
                        <TouchableOpacity style={{marginTop:10,marginBottom:2,fontSize:16,color:'#000'}}>
                           <Image source={require("../assets/private/pink_marker.png")} style={styles.markerStyle}/>
                        </TouchableOpacity>
                    </Right>
                </ListItem>
              );
          });

          return pharmaciesViews;
      }else{
        if(self.state.loadingPharmacies){
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
                  style={styles.pharmacyItemIcon}
                />
                <Text style={{ textAlign: "center", color: "orange", fontSize: 18 }}>
                  Aucune pharmacie trouvée
                </Text>
              </View>
          )
        }
      }
  }

  async _showSearchPharmacies (){
    if(this.state.searchPharmaciesRequested){
      this.setState({
        searchPharmaciesRequested:false,
        requestedPharmacyName:''
      });

      this._updatePharmaciesSearch('')
    }else{
      await this.setState({
        searchPharmaciesRequested:true
      });
      this.searchPharmaciesInput.focus()
    }
  }
  
  _updateSearch = (request)=>{
    this.setState({request});
    this.searchMedicine(request);
  }

  _updatePharmaciesSearch = (requestedPharmacyName)=>{
    this.setState({
      requestedPharmacyName,
      loadingPharmacies:true
    })
    if(requestedPharmacyName.trim()){
      RequestHandler.searchPharmacyByNameOrAddress(
        requestedPharmacyName.trim(),
        this.listPharmaciesDone,
        this.listPharmaciesError
      );
    }else{
      RequestHandler.listPharmacies(
        this.listPharmaciesDone,
        this.listPharmaciesError
      );
    }
  }
  
  fetchAvailableProducts=()=>{
    this.setState({loadingMedicines:true})
    RequestHandler.listAvailableProducts(
        this.fetchProductsSuccess,
        this.fetchProductsFailure,
    );
  }

  searchMedicine = (request)=>{
      this.setState({loadingMedicines:true})
      if(request.trim() !== ''){
          RequestHandler.requestProducts(
              request,
              this.fetchProductsSuccess,
              this.fetchProductsFailure
          );
      }else{
          RequestHandler.listAvailableProducts(
              this.fetchProductsSuccess,
              this.fetchProductsFailure,
          );
      }
  }

  fetchProductsSuccess=(response)=>{
    this.setState({
        medicines:response.data,
        loadingMedicines:false,
    })
  }

  fetchProductsFailure=(error)=>{
    this.setState({
        loadingMedicines:false,
        loadingMedicinesError:error
    })
  }

  _toggleBottomNavigationView = () => {
    this.setState({ showBottomSheet: !this.state.showBottomSheet })
  }

  _hideNavigationSheet = () => {
    this.setState({ showBottomSheet: false })
  }

  _showNavigationView = () => {
    this.setState({ showBottomSheet: true })
  }

  _showSearchModal= () => {
    this.setState({
      showSearchModal:true
    })
  }

  _hideSearchModal= () => {
    this.setState({
      showSearchModal:false
    })
  }

  async shareSelectedPharmacyLocation(){
    this._hideNavigationSheet();
   
    let {selectedPharmacy} = this.state;
    try{
        const result = await Share.share({
          message:
            ` ${selectedPharmacy.ref.name}\n\n https://maps.google.com/?q=${selectedPharmacy.ref.location}`,//JSON.stringify(selectedPharmacy),
          title:
            `Position de ${selectedPharmacy.ref.name}`,//JSON.stringify(selectedPharmacy),
          subject : `Position de ${selectedPharmacy.ref.name}`,
          dialogTitle:`Position de ${selectedPharmacy.ref.name}`,

      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        Snackbar.show({
          title: "Partage annulée",
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
    }catch (error) {
      alert(error.message);
    }
  }

  drawRouteToSelectedPharmacy(){
    this._hideNavigationSheet();

    let {location} = this.state.selectedPharmacy.ref;

    let coordinates = {
      latitude:location.split(",")[0],
      longitude:location.split(",")[1],
    }
    this.drawDirection(coordinates);
  }

  callSelectedPharmacy(){
    this._hideNavigationSheet();
    if(this.state.selectedPharmacy!==null){
      let {ref} = this.state.selectedPharmacy;

     
      let dialNumber="";
      if(ref.contacts){
        dialNumber = ref.country.code+ref.contacts;
      }

      if(dialNumber.trim()!=''){
        dialNumber = dialNumber.replace(" ","");

        let dialCommand="";
        if(Platform.OS !== 'android'){
          dialCommand = `telprompt:${dialNumber}`;
        }else{
          dialCommand = `tel:${dialNumber}`;
        }

        Linking.canOpenURL(dialCommand)
          .then(supported=>{
            if(!supported){
              Snackbar.show({
                title: "Le téléphone ne supporte pas les appels",
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                  title: 'OK',
                  color: 'green',
                  onPress: () => { 
                      // Do something. 
                  },
                },
              });
            }else{
              Linking.openURL(dialCommand);
            }
          }).catch(error=>{
            Snackbar.show({
              title: JSON.stringify(error),
              duration: Snackbar.LENGTH_INDEFINITE,
              action: {
                title: 'OK',
                color: 'green',
                onPress: () => { 
                    // Do something. 
                },
              },
            });
          });
      }else{
        Snackbar.show({
          title: "Contact du correspondant non trouvé",
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
      Snackbar.show({
        title: "Aucune pharmacie sélectionnée",
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
  }

  _updateSelectedPharmacy(pharmacy){
    this.setState({
        selectedPharmacy:pharmacy
    })
  }

  _searchForRequestedMedicine = (requestForProduct) => {
    this._hideSearchModal();
    loadingPharmacies=true;
    this.setState({
      loadingPharmacies
    });
    RequestHandler.searchProduct(
      requestForProduct.trim(),
      this.listPharmaciesDone,
      this.listPharmaciesError
    );
  }

  componentDidMount =  async () => {
    loadingPharmacies=true;
    this.setState({
      loadingPharmacies
    })

    if(this.state.requestForProduct.trim()){
      RequestHandler.searchProduct(
        this.state.requestForProduct.trim(),
        this.listPharmaciesDone,
        this.listPharmaciesError
      );
    }else{
      RequestHandler.listPharmacies(
        this.listPharmaciesDone,
        this.listPharmaciesError
      );
    }

    this.requestLocationPermissions();
    this.fetchAvailableProducts();
  };
  
  shouldComponentUpdate = () => {
    return true;
  }

  componentWillUnmount  = () => {
    this._hideSearchModal();
  }

  componentWillUpdate  = () => {
    //alert("OK")
  }
 
  drawDirection = (destination) => {
      let origin;

      try{
        let {navigation} = this.props;
        navigator.geolocation.clearWatch()
        navigator.geolocation.getCurrentPosition((location)=>{
            origin = {
              lat:location.coords.latitude,
              lng:location.coords.longitude,
            };
            navigation.navigate("Map",{
                origin:origin,
                destination:destination
            });
        },
        (error)=>{
          Snackbar.show({
            title: JSON.stringify(error),
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: 'OK',
              color: 'green',
              onPress: () => { 
                  // Do something. 
              },
            },
          });
        })
    }catch(error){
      console.log("Errrrrrr.catchable",error);
      Snackbar.show({
        title: JSON.stringify(error),
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
  }
  

  getDistanceToPharmacy(destination){
    try{
      let latitude= destination[0];
      let longitude= destination[1];
      let distance = geolib.getDistance(this.state.location,{latitude,longitude});
      if(1000 > distance){
        return distance +" m";
      }else{
        return (distance*1.0/1000)+' Km';
      }
    }catch(error){
      return "...";
    }
  }

  requestLocationPermissions = () =>{
    Permissions.request('location').then(this.updateLocationPermissions)
  }

  checkLocationPermissions = () =>{
    Permissions.check('location').then(this.updateLocationPermissions)
  }

  updateLocationPermissions = (result)=>{
      this.setState({
          locationPermissions:result
      })
      navigator.geolocation.clearWatch()
      navigator.geolocation.getCurrentPosition((location)=>{
        let {latitude,longitude} = location.coords;
          origin = {
            lat:latitude,
            lng:longitude,
          };
          this.setState({
            location:{latitude,longitude}
          })
      },
      (error)=>{
        Snackbar.show({
          title: JSON.stringify(error),
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: 'OK',
            color: 'green',
            onPress: () => { 
                // Do something. 
            },
          },
        });
      })
  }

  updateSearch = (text) =>{
    this.setState({
        product: text
      });
  }

  listPharmaciesDone = response => {
    loadingPharmacies=false;
    this.setState({
      pharmacies: response.data,
      loadingPharmacies
    });
  };

  listPharmaciesError = error => {
    loadingPharmacies=false;
    this.setState({
      pharmaciesLoadingErr: error,
      loadingPharmacies
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
    position: 'absolute',
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
   pharmacyItem: {
    flexDirection: "row"
  },
  pharmacyItemIcon: {
    width: 45,
    height: 45,
    marginHorizontal: 15
  },
  pharmacyItemTitle: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 18
  },
  pharmacyItemDesc: {
    color: "#000",
    fontSize: 16,
    marginTop: 15
  },
  cityNameStyle:{
    marginTop:12,
    marginBottom:11,
    fontSize:14,
    textTransform:'uppercase',
    color:'#000'
  },
  distance:{
    fontSize:13,
    fontWeight:'bold',
    color:'#000'
  },
  pharmacyNameStyle:{
    fontSize:14,
    fontWeight:'bold',
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
    height: 175,
    flexDirection:'column',
    justifyContent: 'center'
  },
  text: {
    padding: 10,
    textAlign: 'center',
    fontSize: 20
  },
  searchMedicineInputStyle:{
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
