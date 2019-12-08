import React from "react";

import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  AsyncStorage,
  ScrollView,
  Alert,
  BackHandler
} from "react-native";

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import  Icon from "react-native-vector-icons/Ionicons";

import RequestHandler from "../utils/RequestHandler";

import constants from "../utils/constants";

import DialogProgress from 'react-native-dialog-progress'


import MapViewDirections from 'react-native-maps-directions';
 
//import geolib from 'geolib'

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyCL0oTC-PoVVxI0WSxysQqDaTthr9SA4MU';

export default class MapActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      pharmacies: null,
      origin:{
        lat:6.12,
        lng:1.25,
      },
      destination:'',
      markers:null
    };
  }
  
  render() {
    return(
        <View style={styles.container}>
            <MapView
              showUserLocation
              annotations={this.state.markers}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                  latitude: this.state.origin.lat,
                  longitude: this.state.origin.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
              }}>
            <MapViewDirections
                origin={{
                  latitude:6.1713825,
                  longitude:1.2422759,
                }}
                destination={{
                  latitude:6.30,
                  longitude:1.20,
                }}
                strokeWidth={8}
                strokeColor="red"
                apikey={GOOGLE_MAPS_APIKEY}
            />

            {
              this.state.markers?
              this.state.markers.map((marker,index)=>(
                <MapView.Marker
                    key={index}
                    coordinate={marker.coordinates}
                    title={marker.title}
                    description={marker.description}
                    
                />
              )):(
                <View/>
              )
            }
            </MapView>
        </View>
        
    )
  }

  handleBackPress =  () => {
    let {navigation} = this.props;
    navigation.navigate("Pharmacies");
  }

  componentDidMount = () => {
    this.fetchPharmacies();
    this.updateMyLocation();
  };

  fetchPharmacies = () => {
    RequestHandler.listPharmacies(
      this.listPharmaciesDone,
      this.listPharmaciesError
    );
  }
  
  listPharmaciesDone = (response) => {
   
    let {status,data} = response;
  
    let markers = null ;
  
    if(status === "success"){
      let origin = 'this.props.navivagtion.state.params.origin';
      if(data!==null){
        markers = [];
          data.forEach((pharmacy, index) => {
            try{
              let marker = {
                    coordinates: {
                      latitude:parseFloat(pharmacy.ref.location.split(",")[0]),
                      longitude:parseFloat(pharmacy.ref.location.split(",")[1])
                    },
                    title: pharmacy.ref.name.toUpperCase(),//+" ("+this.getDistanceToPharmacy(pharmacy.ref.location,origin)+")",
                    description: pharmacy.ref.contacts?(pharmacy.ref.country.code+' '+pharmacy.ref.location):'Contacts non définit',
                    ongard:pharmacy.ongard=='YES'
                  }
                markers.push(marker);
                
                //alert(JSON.stringify([pharmacy]))
            }catch(error){
              //alert(JSON.stringify([error,pharmacy]))
            }
          }) 
        }
    }
  
    this.setState({
      markers:markers
    })
  }
  

  getDistanceToPharmacy(destination,origin){
    /*let latitude= destination[0];
    let longitude= destination[1];
    let origin = {
      latitude:this.state.origin.lat,
      longitude:this.state.origin.lng,
    };*/

    let distance = 15//geolib.getDistance(origin,{latitude,longitude});
    if(1000 > distance){
      return distance +JSON.stringify(origin)+" m";
    }else{
      return (distance*1.0/1000)+' Km';
    }
  }
  
  listPharmaciesError = (error) => {
    Alert.alert("Chargement des pharmacies",JSON.stringify(error));
  }

  updateMyLocation(){
    let {origin} = this.props.navigation.state.params;

    this.setState({
      origin:origin
    })
    //alert(JSON.stringify([origin,destination]));
  }
}





const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });