/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, Alert, AsyncStorage } from "react-native";

import HomeActivity from "./screens/HomeScreen";
import LoginActivity from "./screens/LoginScreen";

import { createStackNavigator, createAppContainer } from "react-navigation";



import SignUp from "./screens/RegisterScreen";
import SignUpLast from "./screens/SignUpLast";

import Profile from "./screens/ProfileScreen";

import SplashScreenActivity from "./screens/SplashScreen";




import Portfolios from "./screens/Portfolios";
import Organizations from "./screens/Organizations";
import LatestCards from "./screens/LatestCards";
import PortfolioDetails from "./screens/PortfolioDetails";
import CardDetails from "./screens/CardDetails";
import OrganizationDetails from "./screens/OrganizationDetails";

import About from "./screens/profile/AboutScreen";
import ShowProfile from "./screens/profile/ShowProfile";
import Settings from "./screens/profile/Settings";

import ScanQrcode from "./screens/ScanQrcodeScreen";
import QrcodeData from "./screens/QrcodeDataScreen";
import QrcodeDataDemo from "./screens/QrcodeDataScreenDemo";
import SelectPortfolioDialog from "./screens/SelectPortfolioDialogScreen";



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
  },
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
  Login: {
    screen: LoginActivity,
    navigationOptions: {
      header: null
    }
  },
  Portfolios:{
    screen: Portfolios,
    navigationOptions:{
      header:null
    }
  },
  OrganizationDetails:{
    screen: OrganizationDetails,
    navigationOptions:{
      header:null
    }
  },
  Organizations:{
    screen: Organizations,
    navigationOptions:{
      header:null
    }
  },
  PortfolioDetails:{
    screen: PortfolioDetails,
    navigationOptions:{
      header:null
    }
  },
  CardDetails:{
    screen: CardDetails,
    navigationOptions:{
      header:null
    }
  },
  LatestCards:{
    screen: LatestCards,
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
  ,
  ShowProfile:{
    screen:ShowProfile,
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
  },
  ScanQrcode:{
    screen:ScanQrcode,
    navigationOptions:{
      header:null
    }
  },
  QrcodeData:{
    screen:QrcodeData,
    navigationOptions:{
      header:null
    }
  },
  QrcodeDataDemo:{
    screen:QrcodeDataDemo,
    navigationOptions:{
      header:null
    }
  },
  SelectPortfolioDialog:{
    screen:SelectPortfolioDialog,
    navigationOptions:{
      header:null
    }
  }
},{
  initialRouteName:'Splash'
});

const Navigation = createAppContainer(NavigationMenu);
