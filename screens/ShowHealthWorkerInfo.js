import React from 'react';
import {BackHandler, TextInput, ScrollView, Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

import {BottomSheet}  from 'react-native-btr'

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Str from '../utils/Str';

import constants from '../utils/constants';
import Snackbar from 'react-native-snackbar';

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';
import RequestHandler from '../utils/RequestHandler';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

export default class ShowHealthWorkerInfo extends React.Component{

    constructor(props){
        super(props);
        this.state =  {
            healthWorkerInfo:null,
            userInfo:null,
            loadingAvailability:true,
            specialities:null,
            speciality:'',
            availability:null,
            selectedDay:null,
            loadingPlaces:false,
            places:null,
            request:'',
            loadingSpecialities:false,
            selectedPlace:null,
            searchRequired:'',
            showWorkerPlacesBottomSheet:false,
            placesError:'',
            mainHWAddress:"Recherche de l'adresse en cours ..."
        }
    }

    render(){
        let {navigation} = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#003d33" hidden={false} />
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                        <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                    </TouchableOpacity>

                    <View style={styles.tilesArea}>
                        {
                            !this.state.searchRequired?(
                                <Text style={styles.toolbarTitle}>{this.getHealthWorkerFullName()}</Text>
                            ):(
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="white"
                                    placeholder="Rechercher ..."
                                    underlineColorAndroid="#fff"
                                    ref={
                                        (input)=>{
                                            this.searchInput=input
                                        }
                                    }
                                    style={styles.searchInput}
                                    value={this.state.query}
                                    onChangeText={this._updateSearch}
                                />
                            )
                        }
                    </View>

                    <View style={styles.rightArea}>
                        
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#f3f3f3'}}>

                    <View style={styles._h_w_profile_view}>
                        <Thumbnail source={this.getGender()==='f'? femme:homme}   style={styles._h_w_d_profile_img} />
                        <Text style={styles._h_w_category}>{this.getHealthWorkerCategory()}</Text>
                    </View>

                    <View style={styles._h_w_card_container}>
                        <View style={{flexDirection:'row',paddingVertical:10}}>
                            <Ionicons  name='ios-pin' size={24} color="gray" style={{paddingHorizontal:10}} />
                            <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'justify',fontSize:16,paddingHorizontal:18}}>{this.state.mainHWAddress?this.state.mainHWAddress:'Non définit'}</Text>
                        </View>

                        <View style={[styles.sideDivider,{width:'35%', marginBottom:10,backgroundColor:constants.colors.statusBar}]}/>
                        <View style={{flexDirection:'row',flexWrap:'wrap',alignSelf:'center',paddingBottom:10, maxWidth:'90%',overflow:'scroll'}}>
                            {
                                this.state.specialities?(
                                    this.state.specialities.map((speciality,index)=>{
                                        return(
                                            <Text key={"speciality-"+index} style={{borderColor:'#1B5E20',textTransform:'uppercase',borderWidth:1,fontWeight:'bold',color:"#1B5E20",textAlignVertical:'center', textAlign:'center',fontSize:16,paddingHorizontal:4,paddingVertical:4,backgroundColor:'#fff', marginHorizontal:2, marginVertical:2}}>
                                                {speciality.title}
                                            </Text>
                                        )
                                    })
                                ):(
                                    this.state.loadingSpecialities?(
                                        <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'center',fontSize:16,paddingHorizontal:18}}>Chargement en cours...</Text>
                                    ):(
                                        <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'center',fontSize:16,paddingHorizontal:18}}>Aucune spécialité trouvée</Text>
                                    )
                                )
                            }
                        </View>
                        
                        <View style={{paddingVertical:10}}>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons  name='ios-home' size={24} color="gray" style={{paddingHorizontal:10}} />
                                <Text style={{color:"#000",textAlignVertical:'center', alignSelf:'center', textAlign:'center',fontSize:18}}>Lieux de travail</Text>
                            </View>
                            {
                                this._renderHWPlaces()
                            }
                        </View>

                        <View style={[styles.sideDivider,{width:'35%', marginBottom:10,backgroundColor:constants.colors.statusBar}]}/>
                        {
                            <BottomSheet
                                visible={this.state.showWorkerPlacesBottomSheet}
                                onBackButtonPress={this._hideWorkerDays}
                                onBackdropPress={this._hideWorkerDays}>
                                
                                <View style={styles.bottomNavigationView}>
                                
                                    <Text style={styles.bottomTitleView}>
                                        {this.state.selectedPlace?this.state.selectedPlace.name.toUpperCase():'Non défini'}
                                    </Text>

                                    <View style={{
                                        marginHorizontal:8,
                                        alignSelf:'center',
                                        width:'96%',
                                        position:'relative',
                                        height:'100%',
                                        top:55,
                                        }}>
                                        {
                                            this.state.speciality?(
                                                <Text style={{fontSize:16, textTransform:'uppercase', fontStyle:'italic', fontWeight:'bold', marginTop:0,marginBottom:15, alignSelf:'center', textAlign:'center', color:'#000'}}>
                                                    { this.state.speciality.title}
                                                </Text>
                                            ):(
                                                <Text style={{fontSize:16, fontStyle:'italic', fontWeight:'bold', marginTop:0,marginBottom:15, alignSelf:'center', textAlign:'center', color:'#000'}}>
                                                    Spécialité non définit
                                                </Text>
                                            )
                                        }
                                        <View style={[styles.sideDivider,{width:'15%',paddingVertical:1,backgroundColor:constants.colors.statusBar}]} />
                                        <Text style={{fontSize:15, fontStyle:'italic', marginTop:0, alignSelf:'center', textAlign:'center', color:'#000'}}>
                                            JOURS DE CONSULTATIONS
                                        </Text>
                                        {
                                            this.state.showWorkerPlacesBottomSheet?(
                                                this.state.availability?(
                                                    <ScrollView style={{marginBottom:60}}>
                                                        {
                                                            this.state.availability.map((availableDay,index)=>{
                                                                return (
                                                                    <TouchableOpacity key={`availableDay-${index}`}  style={styles.availableDay}
                                                                    onPress={()=>{
                                                                        this.updateSelectedDate(availableDay)
                                                                    }}>
                                                                        <Text style={{fontSize:16,fontWeight:'bold', fontStyle:'italic', paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:constants.colors.statusBar}}>
                                                                            {`${this.dateToFrench(availableDay)}`}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            })    
                                                        }    
                                                    </ScrollView>
                                                ):(
                                                    this.state.loadingAvailability?(
                                                        <ActivityIndicator size='large'/>
                                                    ):(
                                                        <Text style={{fontSize:14, fontStyle:'italic', paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:constants.colors.statusBar}}>
                                                            Oups! {"\n"} Rien à afficher
                                                        </Text> 
                                                    )
                                                )
                                            ):null
                                        }
                                    </View>
                                </View>
                            </BottomSheet>
                        }
                    </View>           
                </ScrollView>

                 <TouchableOpacity style={styles.fab} onPress={()=>{this.state.searchRequired?this._disableSearchInput():this._enableSearchInput()}}>
                    {
                        !this.state.searchRequired?(
                            <Ionicons  name='ios-search' size={24} color='#fff'/>
                        ):(
                            <Ionicons  name='ios-close' size={28} color='#fff'/>
                        )
                    }
                </TouchableOpacity>
            </View>
        );
    }

    _updateSearch = async (request)=>{
        this.setState({
            request
        })
    }

    _enableSearchInput = async ()=>{
        await this.setState({
            searchRequired:true
        })
        this.searchInput.focus()
    }

    _disableSearchInput = ()=>{
        this.setState({
            searchRequired:false,
            request:''
        })
    }

    dateToFrench(availability){
        days={
            MONDAY:'Lundi',
            TUESDAY:'Mardi',
            WEDNESDAY:'Mercredi',
            THURSDAY:'Jeudi',
            FRIDAY:'Vendredi',
            SATURDAY:'Samedi',
            SUNDAY:'Dimanche'
        };
        let {start} = availability;
        let {end} = availability;

        if(start.split(":").length>2){
            start = start.split(":")
            start.pop()
            start=start.join(":")
        }
        if(end.split(":").length>2){
            end = end.split(":")
            end.pop()
            end=end.join(":")
        }

        return (
            days[availability.day] + " ("+start+" - "+end+")"
        )
    }

    _showWorkerDays = async ()=>{
        await this.setState({
            showWorkerPlacesBottomSheet:true
        })
        
        this.fetchHealthWorkerAvailability();
    }

    _hideWorkerDays = ()=>{
        this.setState({
            showWorkerPlacesBottomSheet:false,
            availability:null
        })
    }
    
    _renderHWPlaces = ()=>{
        if(this.state.places){
            return(
                <List>
                    {
                        this.state.places.map((place,index)=>{
                            return(
                                <ListItem avatar key={index} style={{marginHorizontal:8}} onPress={()=> {                
                                    this.setState({
                                        selectedPlace:place
                                    });
                                    this._showWorkerDays();
                                }}>
                                    <Left>
                                        <Thumbnail source={require("../assets/private/hospital.png")} style={{width:45,height:45}} size={20} />
                                    </Left>
                                    <Body>
                                        <Text style={{color:'#000',fontSize:16,textTransform:'uppercase', fontWeight:'bold'}}>{place.name}</Text>
                                        <Text style={{color:'#000',fontStyle:'italic',fontSize:12,marginVertical:6}}>{place.address?place.address:'Adresse non définit'}</Text>
                                    </Body>
                                </ListItem>
                            )
                        })
                    }
                </List>
                
            )
        }else{
            if(this.state.loadingPlaces){
                return(
                    <View style={{alignItems: "center", justifyContent:'center' }}>
                        <ActivityIndicator size='large'/>
                    </View>
                )
            }else{
                return(
                    <View style={{alignItems: "center", justifyContent:'center' }}>
                        <Text style={{color:'red'}}>{this.state.placesError?this.state.placesError:'Aucune disponibilité'}</Text>
                    </View>
                )
            }
        }
    }

    _fetchHWPlaces = ()=>{
        if(this.state.healthWorkerInfo){
            this.setState({loadingPlaces:true})
            RequestHandler.getHealthWorkerPlaces(
                this.state.healthWorkerInfo.id,
                this._workPlacesSuccess,
                this._workPlacesFailure,
            )
        }
    }

    _fetchHWMainPlace = ()=>{
        if(this.state.healthWorkerInfo){
            this.setState({loadingPlaces:true})
            RequestHandler.getHealthWorkerMainPlace(
                this.state.healthWorkerInfo.id,
                this._workMainPlaceSuccess,
                this._workMainPlaceFailure,
            )
        }
    }

    _workPlacesSuccess = (response)=>{
        this.setState({
            loadingPlaces:false,
            places:response.data
        })
    }

    _workPlacesFailure = (error)=>{
        this.setState({
            loadingPlaces:false,
            placesError:error
        })
    }

    _workMainPlaceSuccess = (response)=>{
        let {data} = response

        this.setState({
            mainHWAddress:data.fullname
        })
    }

    _workMainPlaceFailure = (error)=>{
        this.setState({
            mainHWAddress:error
        })
    }

    fetchHealthWorkerAvailability(){
        if(this.state.healthWorkerInfo){
            this.setState({
                loadingAvailability:true
            });

            RequestHandler.getHealthWorkerAvailability(
                this.state.healthWorkerInfo.id,
                this.state.selectedPlace.id,
                (response)=>{
                    this.setState({
                        availability:response.data,
                        speciality:response.extra,
                        loadingAvailability:false
                    })
                },
                (error)=>{
                    this.setState({
                        loadingAvailability:false
                    });
                    this.handleError("Disponibilité du médecin",error)
                }
            );
        }
    }

    fetchHealthWorkerSpecialities(){
        if(this.state.healthWorkerInfo){
            loadingSpecialities=true;
            this.setState({
                loadingSpecialities
            })
            RequestHandler.getHealthWorkerSpecialities(this.state.healthWorkerInfo.id,
                (response)=>{
                    this.setState({
                        specialities:response.data,
                        loadingSpecialities:false
                    })
                },
                (error)=>{
                    this.handleError("Spécialités du médecin",error)
                    this.setState({
                        loadingSpecialities:false
                    })
                }
            );
        }
    }

    updateSelectedDate(date){
        this.setState({
            selectedDay:date,
        });
        this.requestRendezvous(date);
    }

    requestRendezvous(date){
        this._hideWorkerDays();
        let {navigation} = this.props; 
        let {healthWorkerInfo,selectedPlace,speciality,availability} = this.state;
       
        navigation.navigate("RequestRendezvous",{
            selectedDay:date,
            worker_id:healthWorkerInfo?healthWorkerInfo.id:-1,
            speciality_id:speciality?speciality.id:-1,
            structure_id:selectedPlace?selectedPlace.id:-1,
            worker_gender:healthWorkerInfo?healthWorkerInfo.user.gender.toLowerCase():'m',
            worker_names:healthWorkerInfo?Str.capitalize(healthWorkerInfo.user.firstname)+' '+healthWorkerInfo.user.lastname.toUpperCase():''
        });
    }

    handleError (error, description){
        Snackbar.show({
            title: error+" "+description,
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

    getHealthWorkerFullName(){
        let {healthWorkerInfo} = this.state;
        return healthWorkerInfo?Str.capitalize(healthWorkerInfo.user.firstname)+' '+healthWorkerInfo.user.lastname.toUpperCase():'';
    } 

    getGender(){
        let {healthWorkerInfo} = this.state;
        return healthWorkerInfo?healthWorkerInfo.user.gender.toLowerCase():'';
    } 

    getHealthWorkerCategory(){
        let {healthWorkerInfo} = this.state;
        return healthWorkerInfo?healthWorkerInfo.moreinfos.category:'';
    } 

    async componentDidMount(){
        let {navigation} = this.props;
        await this.setState({
            healthWorkerInfo: navigation.state.params.data
        });

        this.getUserInfo();
        this.fetchHealthWorkerSpecialities();
        this._fetchHWPlaces();
        this._fetchHWMainPlace();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = ()=>{
        if (this.state.showWorkerPlacesBottomSheet) {
          this._hideWorkerDays();
          return true;
        }
        return false;
    }
    
    async getUserInfo(){
        let user = await AsyncStorage.getItem("@userInfos");
        this.setState({
            userInfo:user
        })
    }

    componentWillUnmount(){
        this._hideWorkerDays()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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
        backgroundColor:constants.colors.fabColor,
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
    _h_w_category:{
        color:'#fff',
        fontSize:18,
        fontStyle:'italic',
        fontWeight:'bold',
        textAlign:'center',
        marginBottom: 10
    },
    _h_w_profile_view:{
        height:240,
        width:'100%',
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
        borderRadius:3,
        marginHorizontal:8,
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