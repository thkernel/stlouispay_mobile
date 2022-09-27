import React from "react";
import { View,StyleSheet, Text, TouchableOpacity } from "react-native";
import { Header, Body, Right, Button, Title } from "native-base";
import ThemeColors from "../constants/ThemeColors";

//import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import AsyncStorage from "@react-native-community/async-storage";
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/Ionicons'; 

export default class MyHeader extends React.Component {

  render() {
    return (
      <Header hasTabs noShadow transparent noLeft style={styles.header}>
        <Body>
          <Title>LE SAINT LOUIS</Title>
        </Body>
        <Right>
          
          
        
        <TouchableOpacity style={{}} onPress={()=>{this.showProfile()}}>
                <Icon name='ios-menu' size={28} color='white'/>  
          </TouchableOpacity>

        </Right>

      

      </Header>

      
    );
  }



  showProfile = () => {
    let {navigation} = this.props;

    navigation.navigate("Profile")
  }


  

  _navigate = async (route,params={})=>{
        let {navigation} = this.props;

        navigation.navigate(route,params)
    }

    _logout = async ()=>{
       await AsyncStorage.removeItem("@userInfos");
       await  AsyncStorage.removeItem("@polls");
        RNRestart.Restart();


    }


}

const styles = StyleSheet.create({
  header: {
    backgroundColor: ThemeColors.primary
  },
  textStyle: {
    fontSize: 25,
    marginTop: 16,
      color: 'white',
    },
});