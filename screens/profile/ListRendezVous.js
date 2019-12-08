import React, { Component } from 'react'

import { View, Text, TextInput, ImageBackground, StatusBar, TouchableOpacity, StyleSheet } from 'react-native'
import {Container, Header, Content, Tab, Tabs, InputGroup, Input} from 'native-base'
import constants from '../../utils/constants';

import LinearGradient from 'react-native-linear-gradient';

import { Separator } from 'react-native-btr';

import Icon from 'react-native-vector-icons/Ionicons' 
import FontAwesome from 'react-native-vector-icons/FontAwesome' 

import { SearchBar } from 'react-native-elements';

export default class ListRendezVous extends Component {
    constructor(props){
        super(props)
        this.state = { 
            searchText:''
        }
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Container>
                    <StatusBar backgroundColor={constants.colors.statusBar} hidden={false} />
                    <Header hasTabs style={{backgroundColor:constants.colors.toolBar}} >
                        <View style={{flexDirection:'row', justifyContent:'space-between',width:'100%',marginLeft:0, marginRight:0, paddingHorizontal:0, marginTop:8}}>
                            <TextInput
                                placeholder="Rechercher ..."
                                style={{marginVertical:5, borderRadius:3,marginRight:6, marginHorizontal:0,backgroundColor:'#fff',flex:1}}
                                underlineColorAndroid="transparent"
                                onChangeText={this._updateSearch}
                                value={this.state.searchText}
                            />
                        </View>
                    </Header>
                    <Tabs tabBarBackgroundColor={constants.colors.toolBar}>
                        <Tab activeTextStyle={{fontWeight:'normal',fontFamily:constants.fonts.secondary}} textStyle={{fontFamily:constants.fonts.secondary}} activeTabStyle={{backgroundColor:constants.colors.toolBar}} tabStyle={{backgroundColor:constants.colors.toolBar}} heading="Programmés">
                            <Tab1 />
                        </Tab>
                        <Tab activeTextStyle={{fontWeight:'normal',fontFamily:constants.fonts.secondary}} textStyle={{fontFamily:constants.fonts.secondary}} activeTabStyle={{backgroundColor:constants.colors.toolBar}} tabStyle={{backgroundColor:constants.colors.toolBar}} heading="Pris">
                            <Tab2 />
                        </Tab>
                    </Tabs>
                </Container>
            </View>
        );
    }

    _navigate = async (route,params={})=>{
        let {navigation} = this.props;
        navigation.navigate(route,params)
    }

    _updateSearch = async (searchText)=>{
       this.setState({
           searchText
       })
    }

    _shareApplication = async ()=>{
        
    }
}

const Tab1 = ({props})=>{
    return (
        <Text {...props}>
            Tab1
        </Text>
    )
}

const Tab2 = ({props})=>{
    return (
        <Text {...props}>
            Tab2
        </Text>
    )
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
    cardFooter:{
        marginTop:20,
        borderRadius:4,
        borderColor:'#3b5998',
        borderWidth: 0.5,
        marginHorizontal: 40,
    },
    fab:{
        width:50,
        height:50,
        top:15,
        left:15,
        borderRadius:25,
        backgroundColor:'rgba(40,105,92,1)',
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    footerFab:{
        width:50,
        height:50,
        bottom:40,
        right:25,
        borderRadius:25,
        backgroundColor:constants.colors.blue.share,
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
    footerContentText:{
        position:'absolute',
        bottom:20,
        alignSelf: 'center',
        color:'#000',
        marginTop:10, 
        textAlign:'center',
        fontSize:18, 
        fontFamily:'candara'
    }
})