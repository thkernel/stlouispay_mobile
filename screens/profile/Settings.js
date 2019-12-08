import React, { Component } from 'react'

import { View, Text } from 'react-native'

export default class Settings extends Component {
    
    constructor(props){
        super(props)
        this.state = {  }
    }

    render() {
        return (
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#000',fontSize:25, fontFamily:'candara'}}>
                    Settings 
                </Text>
            </View>
        );
    }
}