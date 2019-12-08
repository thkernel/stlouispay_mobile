import React, { Component } from 'react'

import { View, Text, ImageBackground, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';

import constants from '../utils/constants';

export default class Profile extends Component {
    
    constructor(props){
        super(props)
        this.state = {  }
    }

    render() {
        return (
            <ImageBackground source={require("../assets/private/bg/1.jpg")} style={{flex:1}}>
                <StatusBar hidden={true} />
                <LinearGradient colors={['rgba(40,53,147,0.2)', 'rgba(40,53,147,0.88)', 'rgba(40,53,147,1)']} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    
                    <TouchableOpacity style={styles.fab} onPress={()=>this._navigate("Home")}>
                        <Icon name={"ios-arrow-round-back"} size={28} color="#fff" />
                    </TouchableOpacity>
                    
                    <View style={{flex:0.5, width:'100%', marginVertical:10, flexDirection:'row', height:'100%',alignItems:'center',justifyContent:'center'}}>
                        <View style={{flex:0.5, flexDirection:'column', width:'100%', height:'100%',alignItems:'flex-end',justifyContent:'flex-end', marginRight:10}}>
                            <LinearGradient colors={['rgba(0,105,92,0.88)', 'rgba(0,105,92,0.65)', 'rgba(0,105,92,0.88)']}>
                                <TouchableOpacity style={{justifyContent:'center', width:135, height:135, padding:15, alignItems:'center',elevation:5}} onPress={()=>{this._navigate("Rendezvous")}}>
                                    <Icon name="ios-calendar" size={80} color="#fff" />
                                    <Text style={{color:'#fff',fontSize:16,fontFamily:constants.fonts.secondary}}>
                                        Rendez-vous
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        <View style={{flex:0.5, flexDirection:'column', width:'100%', height:'100%',alignItems:'flex-start',justifyContent:'flex-end', marginRight:10}}>
                            <LinearGradient colors={['rgba(0,105,92,0.88)', 'rgba(0,105,92,0.65)', 'rgba(0,105,92,0.88)']}>
                                <TouchableOpacity style={{/*backgroundColor:'rgba(255,255,255,0.4)',*/justifyContent:'center', width:135, height:135, padding:15, alignItems:'center',elevation:5}} onPress={()=>{this._navigate("ShowProfile")}}>
                                    <Icon name="md-person" size={80} color="#fff" />
                                    <Text style={{color:'#fff',fontSize:16,fontFamily:constants.fonts.secondary}}>
                                        Profil
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>

                    <View style={{flex:0.5, width:'100%', flexDirection:'row', height:'100%',alignItems:'center',justifyContent:'center'}}>
                        <View style={{flex:0.5, flexDirection:'column', width:'100%', height:'100%',alignItems:'flex-end',justifyContent:'flex-start', marginRight:10}}>
                            <LinearGradient colors={['rgba(0,105,92,0.88)', 'rgba(0,105,92,0.65)', 'rgba(0,105,92,0.88)']}>
                                <TouchableOpacity style={{justifyContent:'center', width:135, height:135, padding:15, alignItems:'center',elevation:5}} onPress={()=>{this._navigate("About")}}>
                                    <Icon name="ios-help-circle-outline" size={80} color="#fff" />
                                    <Text style={{color:'#fff',fontSize:16,fontFamily:constants.fonts.secondary}}>
                                        A propos
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        <View style={{flex:0.5, flexDirection:'column', width:'100%', height:'100%',alignItems:'flex-start',justifyContent:'flex-start', marginRight:10}}>
                            <LinearGradient colors={['rgba(0,105,92,0.88)', 'rgba(0,105,92,0.65)', 'rgba(0,105,92,0.88)']}>
                                <TouchableOpacity style={{justifyContent:'center', width:135, height:135, padding:15, alignItems:'center',elevation:5}} onPress={()=>{this._navigate("Settings")}}>
                                    <Icon name="ios-settings" size={80} color="#fff" />
                                    <Text style={{color:'#fff',fontSize:16,fontFamily:constants.fonts.secondary}}>
                                        Paramètres
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>

                    <View style={{position:'absolute',bottom:20}}>
                        <Text style={{color:'#fff',fontSize:14,fontFamily:constants.fonts.secondary}}>
                            &copy; Copyright 2019 - by KOLANE Frédérick
                        </Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
        );
    }

    _navigate = async (route,params={})=>{
        let {navigation} = this.props;

        navigation.navigate(route,params)
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
        backgroundColor:'rgba(40,53,147,0.88)',//'rgba(255,64,129,0.30)',
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
    }
})