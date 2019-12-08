/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, Alert, AsyncStorage } from "react-native";

import HomeActivity from "./screens/HomeActivity";
import LoginActivity from "./screens/LoginActivity";

import { createStackNavigator, createAppContainer } from "react-navigation";


import ListPharmacies from "./screens/ListPharmacies";
import SignUp from "./screens/SignUp";
import SignUpLast from "./screens/SignUpLast";
import RequestRendezvous from "./screens/RequestRendezvous";
import RequestRendezvousWithStructure from "./screens/RequestRendezvousWithStructure";
import Profile from "./screens/Profile";
import MapActivity from "./screens/MapActivity";
import SplashScreenActivity from "./screens/SplashScreenActivity";
import ShowHealthWorkerInfo from "./screens/ShowHealthWorkerInfo";
import ShowStructureInfos from "./screens/ShowStructureInfos";
import ShowFeedDetails from "./screens/ShowFeedDetails";

import ListRendezVous from "./screens/profile/ListRendezVous";
import About from "./screens/profile/About";
import ShowProfile from "./screens/profile/ShowProfile";
import Settings from "./screens/profile/Settings";


export default class App extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Navigation/>
    );
  }
}

const NavigationMenu = createStackNavigator({
  Splash:{
    screen:SplashScreenActivity,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: LoginActivity,
    navigationOptions: {
      header: null
    }
  }/*,
  SearchMedicines:{
    screen:ListAvailableMedicines,
    navigationOptions: {
      header: null
    }
  }*/,
  SignUpLast:{
    screen: SignUpLast,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null
    }
  },
  Home:{
    screen: HomeActivity,
    navigationOptions: {
      header: null
    }
  },
  Pharmacies:{
    screen: ListPharmacies,
    navigationOptions: {
      header: null
    }
  },
  Map:{
    screen: MapActivity,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: LoginActivity,
    navigationOptions: {
      header: null
    }
  },
  ShowHealthWorkerInfo:{
    screen:ShowHealthWorkerInfo,
    navigationOptions:{
      header:null
    }
  },
  ShowStructureInfos: {
    screen: ShowStructureInfos,
    navigationOptions:{
      header:null
    }
  },
  RequestRendezvous:{
    screen:RequestRendezvous,
    navigationOptions:{
      header:null
    }
  },
  RequestRendezvous2:{
    screen:RequestRendezvousWithStructure,
    navigationOptions:{
      header:null
    }
  },
  ShowFeedDetails:{
    screen:ShowFeedDetails,
    navigationOptions:{
      header:null
    }
  },
  Profile:{
    screen:Profile,
    navigationOptions:{
      header:null
    }
  }
  ///
  ,
  ShowProfile:{
    screen:ShowProfile,
    navigationOptions:{
      header:null
    }
  },
  Rendezvous:{
    screen:ListRendezVous,
    navigationOptions:{
      header:null
    }
  },
  About:{
    screen:About,
    navigationOptions:{
      header:null
    }
  },
  Settings:{
    screen:Settings,
    navigationOptions:{
      header:null
    }
  }
},{
  initialRouteName:'Splash'
});

const Navigation = createAppContainer(NavigationMenu);
