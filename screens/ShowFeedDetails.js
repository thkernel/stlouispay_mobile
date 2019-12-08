import React from 'react';
import {BackHandler, Share, TextInput, ScrollView, Text, View, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

import {BottomSheet}  from 'react-native-btr'

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Str from '../utils/Str';

import constants from '../utils/constants';

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';

export default class ShowFeedDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            feedReference:{}
        }
    }
    
    render() {
        let {navigation} = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#003d33" hidden={false} />
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                        <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                    </TouchableOpacity>

                    <View style={styles.tilesArea}>
                        <Text style={[styles.toolbarTitle,{fontStyle:'italic',fontFamily:'candara'}]}>Détails de l'infos</Text>
                    </View>

                    <View style={styles.rightArea}>
                        
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#757575'}}>
                    {
                        this.state.feedReference?(
                            this.state.feedReference.image?(
                                <ImageBackground style={styles._h_w_profile_view} source={{uri:constants.remote.shared+"/imgs/news/"+this.state.feedReference.image}}>
                                    <View style={{backgroundColor:'rgba(0,0,0,0.25)'}}>
                                        <Text style={styles.feedTitle}>{this.state.feedReference.title}</Text>
                                    </View>
                                </ImageBackground>                         
                            ):(
                                <View style={styles._h_w_profile_view}>
                                    <Text style={styles.feedTitle}>{this.state.feedReference.title}</Text>
                                </View> 
                            )
                        ):null
                    }
                    

                    <View style={styles._h_w_card_container}>
                        <View style={{flexDirection:'row',paddingVertical:10}}>
                            <Ionicons  name='ios-document' size={24} color="gray" style={{paddingHorizontal:10}} />
                            <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'justify',fontSize:16,paddingHorizontal:18, fontFamily:'candara'}}>
                                Resources associées  ({(this.state.feedReference && this.state.feedReference.resources)?this.state.feedReference.resources.length:0})
                            </Text>
                        </View>

                        <View style={[styles.sideDivider,{width:'35%', marginBottom:10,backgroundColor:constants.colors.statusBar}]}/>
                        <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center', justifyContent:'center',alignSelf:'center',paddingBottom:10, maxWidth:'90%',overflow:'scroll'}}>
                            {
                                (this.state.feedReference && this.state.feedReference.resources)?(
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} centerContent={true}>
                                        {
                                            this.state.feedReference.resources.map((resource,index)=>{
                                            let link = constants.remote.shared+"/imgs/"+resource.path+"/"+resource.content;//+this.state.feedReference.image;
                                            return(
                                                    <Image key={"shared-resource-"+index} source={{uri:link}} style={{paddingHorizontal:4,paddingVertical:4, marginHorizontal:2, marginVertical:2, width:100, height:100,borderWidth:0.5, borderColor:constants.colors.toolBar}}/>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                ):(
                                    <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'center',fontSize:16,paddingHorizontal:18}}>Aucune resources associées</Text>
                                )
                            }
                            <Text style={{color:"#FF5722", fontSize:15,fontWeight:'bold', marginVertical:8, fontStyle:'italic', textAlign:'center',paddingHorizontal:15}}>
                                Défilez vers la droite/gauche pour voir plus
                            </Text>
                        </View>
                        
                        <View style={{paddingVertical:10, backgroundColor:'#fff'}}>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons  name='md-mail' size={24} color="gray" style={{paddingHorizontal:10}} />
                                <Text style={{color:"#000",fontWeight:'bold',textAlignVertical:'center', alignSelf:'center', textAlign:'center',fontSize:16,paddingHorizontal:18}}>Contenu</Text>
                            </View>
                            <Text style={{textAlign:'justify', fontSize:18,paddingHorizontal:8,color:'#212121'}}>
                                {
                                    this.state.feedReference?this.state.feedReference.longdesc:''
                                }
                            </Text>
                            
                        </View>

                        <View style={[styles.sideDivider,{width:'35%', marginBottom:10,backgroundColor:constants.colors.statusBar}]}/>
                        <Text style={{textAlign:'center', fontStyle:'italic', paddingVertical:16, fontSize:16, fontWeight:'bold',paddingHorizontal:8,color:'#212121'}}>
                            Publiée par {this.getFeedOwner()}
                        </Text>
                    </View>           
                </ScrollView>

                 <TouchableOpacity style={styles.fab} onPress={()=>{this.shareFeed()}}>
                    <Ionicons  name='md-share' size={24} color='#fff'/>
                </TouchableOpacity>
            </View>           
        );
    }

    getFeedOwner = () => {
        if(this.state.feedReference){
            if(this.state.feedReference.structure){
                return this.state.feedReference.structure.name.toUpperCase();
            }else{
                return "Ko-Santé+";
            }
        }else{
            return ""
        }
    }

    shareFeed = async () =>{
        let {feedReference} = this.state;
        try{
            const result = await Share.share({
            message:
                ` Actualité sur Ko-Santé+ - ${feedReference.title}\n---- \n${feedReference.shortdesc} \n\n source:http://kosante.org`,//JSON.stringify(selectedPharmacy),
            title:
                `Actualité sur Ko-Santé+ - de ${feedReference.title}`,//JSON.stringify(selectedPharmacy),
            subject : `Actualité sur Ko-Santé+ - de ${feedReference.title}`,
            dialogTitle:`Partager le contenu`,

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

    componentDidMount = async () => {
        await this._extractPropsToState();
    }

    _extractPropsToState  = async () => {
        await this.setState({
            ...this.state,
            ...this.props.navigation.state.params
        })
    }

}

const styles = StyleSheet.create({
    mainText:{
        textAlign:'center',
        fontSize: 18
    },
    titleContent:{
        fontStyle:'italic',
        fontSize:18,
        color:'#000',
        fontWeight:'bold',
        textAlign:'center',
        paddingHorizontal:10
    },
    titlteContainer:{
        flexDirection:'row',
        paddingVertical:10,
        paddingHorizontal:8,
        marginHorizontal:10,
        alignSelf:'center'
    },
    sideDivider:{
        backgroundColor:'#000',
        height:1,
        width:'90%',
        alignSelf:'center',
        paddingHorizontal:16,
        marginHorizontal: 10,
    },
    availableDay:{
        borderColor:constants.colors.statusBar,
        borderWidth:0.5,
        borderRadius:4,
        marginVertical:4,
        width:'90%',
        alignSelf:'center'
    },
    availabilityDetails:{
        color:constants.colors.toolBar,
        textAlign:'center',
        fontWeight:'bold',
        fontSize:18, 
        paddingVertical:12
    },
    bottomNavigationView: {
      backgroundColor: '#fff',
      width: '100%',
      flexDirection:'column',
      height: 325,
      justifyContent: 'center'
    },
    bottomTitleView:{
      paddingVertical:15, 
      paddingHorizontal:5,
      fontSize:15, 
      fontWeight:'bold',
      color:'#fff', 
      top:0,
      marginTop:0,
      width:'100%',
      position: 'absolute',
      textAlign:'center',
      backgroundColor:'#00665C'
    },
    searchInput: {
        color: "#fff",
        fontSize: 18,
        minWidth: '84%',
        maxWidth: '90%',
        paddingHorizontal: 2
    },
    fab:{
        width:50,
        height:50,
        bottom:30,
        right:30,
        borderRadius:25,
        backgroundColor:constants.colors.blue.share,
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    headerView: {
        height: Platform.OS === "ios" ? 44 : 56,
        backgroundColor: "#00695c",
        flexDirection: 'row',
    },
    feedTitle:{
        color:'#fff',
        fontSize:18,
        fontStyle:'italic',
        fontWeight:'bold',
        textAlign:'center',
        paddingHorizontal:8,
        marginHorizontal:30,
        marginVertical: 10
    },
    _h_w_profile_view:{
        height:240,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#00695c",
    },
    _h_w_d_profile_img:{
        height:150,
        width:150,
        borderRadius:75,
        marginTop: 18,
        marginBottom: 10,
        alignSelf: 'center',
    },
    _h_w_card_container:{
        backgroundColor:"#fff",
        elevation:4,
        borderRadius:1,
        marginHorizontal:5,
        paddingHorizontal:4,
        marginTop:-30,
        marginBottom:15
    },
    leftArea:{
        flexDirection: 'row',
        alignItems:'center'
    },
    tilesArea:{
        flexDirection: 'column',
        justifyContent:'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    rightArea:{
        flexDirection: 'row',
    },
    toolbarTitle:{
        color:'#fff',
        fontSize:18,
        alignItems: 'center',
        marginTop:8,
        fontWeight: 'bold',
    }
});