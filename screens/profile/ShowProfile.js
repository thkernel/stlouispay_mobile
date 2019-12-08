import React, { Component } from 'react'

import { View, Text, ImageBackground, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';

import constants from '../../utils/constants';

export default class ShowProfile extends Component {
    
    constructor(props){
        super(props)
        this.state = {  }
    }

    render() {
        return (
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#000',fontSize:25, fontFamily:'candara'}}>
                ShowProfile 
                </Text>
            </View>
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