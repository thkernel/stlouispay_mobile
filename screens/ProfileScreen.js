import React, { Component } from 'react'

import { View, Text, ImageBackground, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from "@react-native-community/async-storage";
import RNRestart from 'react-native-restart';


import constants from '../utils/constants';

export default class Profile extends Component {
    
    constructor(props){
        super(props)
        this.state = {  }
    }

    render() {
        return (
            <View style={{flex:1}}>
                <StatusBar hidden={true} />
                    <LinearGradient colors={['rgba(250, 251, 252,0.2)', 'rgba(250, 251, 252,0.88)', 'rgba(250, 251, 252,1)']} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity style={styles.fab} onPress={()=>this._navigate("Home")}>
                        <Icon name={"ios-arrow-round-back"} size={28} color="#fff" />
                    </TouchableOpacity>
                    
                    

                    <View style={{flex:0.5, width:'100%', flexDirection:'row', height:'100%',alignItems:'center',justifyContent:'center'}}>
                        <View style={{flex:0.5, flexDirection:'column', width:'100%', height:'100%',alignItems:'flex-end',justifyContent:'flex-start', marginRight:10}}>
                            <LinearGradient colors={['rgba(145, 36, 85,0.88)', 'rgba(145, 36, 85,0.65)', 'rgba(145, 36, 85,0.88)']}>    
                                <TouchableOpacity style={{justifyContent:'center', width:135, height:135, padding:15, alignItems:'center',elevation:5}} onPress={()=>{this._navigate("About")}}>
                                    <Icon name="ios-help-circle-outline" size={80} color="#fff" />
                                    <Text style={{color:'#fff',fontSize:16,fontFamily:constants.fonts.secondary}}>
                                        A propos
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        <View style={{flex:0.5, flexDirection:'column', width:'100%', height:'100%',alignItems:'flex-start',justifyContent:'flex-start', marginRight:10}}>
                            <LinearGradient colors={['rgba(145, 36, 85,0.88)', 'rgba(145, 36, 85,0.65)', 'rgba(145, 36, 85,0.88)']}>    
                                <TouchableOpacity style={{justifyContent:'center', width:135, height:135, padding:15, alignItems:'center',elevation:5}} onPress={()=>{this._logout()}}>
                                    <Icon name="ios-power" size={80} color="#fff" />
                                    <Text style={{color:'#fff',fontSize:16,fontFamily:constants.fonts.secondary}}>
                                        Déconnexion
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>

                    <View style={{position:'absolute',bottom:20}}>
                        <Text style={styles.copyright}>
                            &copy; Copyright 2022 LE SAINT LOUIS 
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
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
    verticalDivider:{
        backgroundColor:'white',
        width:'20%',
        position:'absolute',
        top:-5,
        left:'36%',
        height:0.5
    },
    fab:{
        width:50,
        height:50,
        top:15,
        left:15,
        borderRadius:25,
        backgroundColor:constants.colors.toolBar,//'rgba(255,64,129,0.30)',
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    horizontalDivider:{
        backgroundColor:'white',
        width:0.5,
        position:'absolute',
        bottom:-40,
        left:'46%',
        justifyContent:'center',
        height:'20%'
    },
    copyright: {
    
        fontSize: 14,
        fontFamily:'candara',
        
        color:'#912455',
        
        textAlign: "center",
        fontWeight: "bold"
    }
})