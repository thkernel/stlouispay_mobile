import React from 'react';
import {Alert, BackHandler, TextInput, ScrollView, Text, View, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

import {BottomSheet, Tag}  from 'react-native-btr'

import Icon from 'react-native-vector-icons/FontAwesome5';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Str from '../utils/Str';

import constants from '../utils/constants';
import Snackbar from 'react-native-snackbar';

import {Header, Left, Right, Body, Title, Thumbnail, List,ListItem } from 'native-base';
import RequestHandler from '../utils/RequestHandler';

import structure from '../assets/private/structure.png';
import structureBG from '../assets/private/structure_bg.png';

export default class ShowStructureInfos extends React.Component{

    constructor(props){
        super(props);
        this.state =  {
            userInfo:null,
            specialities:null,
            activities:null,
            loadingActivities:false,
            activitiesError:"",
            loadingWorkDays:false,
            workdaysError:'',
            loadingSpecialities:false,
            expandableIndex:-1,
            showBottomSheet:false,
            workersForDayError:'',
            workersForDay:null,
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
                       <Text style={styles.toolbarTitle}>{this.props.navigation.state.params.structure.name}</Text>
                    </View>

                    <View style={styles.rightArea}>
                        
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'#f3f3f3'}}>

                    <ImageBackground source={structureBG} style={styles._h_w_profile_view}>
                        <View style={styles._h_w_d_profile_img} />
                        <Text style={styles._h_w_category}>{/*'Description'*/}</Text>
                    </ImageBackground>

                    <View style={styles._h_w_card_container}>
                        <View style={{flexDirection:'row',paddingVertical:10}}>
                            <Ionicons  name='ios-pin' size={24} color="gray" style={{paddingHorizontal:10}} />
                            <Text style={{color:"#000",textAlignVertical:'center',fontWeight:'bold', textAlign:'justify',fontSize:16,paddingHorizontal:18}}>{this._extractAddress()}</Text>
                        </View>

                        <View style={{flexDirection:'row',flexWrap:'wrap',alignSelf:'center',paddingBottom:10, maxWidth:'90%',overflow:'scroll'}}>
                            {
                                this.state.activities?(
                                    this.state.activities.map((activity, index)=>{
                                        return (
                                            <Tag 
                                                key={`tag-work-day-${index}`}
                                                name={activity.name}
                                                style={{backgroundColor: '#7986CB', color: '#fff', borderRadius: 50, borderWidth: 0.5,paddingVertical:4, marginVertical:4}}
                                                iconRight='visibility'
                                                onPress={()=>this._showActivityDetails(activity)}
                                            />
                                        )
                                    })
                                ):(
                                    this.state.loadingActivities?(
                                        <ActivityIndicator size='large'/>
                                    ):(
                                        <Text style={{fontSize:14, fontStyle:'italic', paddingVertical:5, alignSelf:'center', textAlign:'center', color:'red'}}>
                                            {this.state.activitiesError?this.state.activitiesError:"Rien à afficher"}
                                        </Text> 
                                    )
                                )
                            }
                        </View>

                        <View style={{paddingVertical:10}}>
                            <View style={{flexDirection:'row'}}>
                                <Ionicons  name='md-calendar' size={24} color="gray" style={{paddingHorizontal:10}} />
                                <Text style={{color:"#000",textAlignVertical:'center', alignSelf:'center', textAlign:'center',fontSize:18}}>Jours d'ouverture</Text>
                            </View>
                            {
                                this.state.workDays?(
                                    <ScrollView style={{marginBottom:60}}>
                                        {
                                            this.state.workDays.map((workDay,index)=>{
                                                return (
                                                    <TouchableOpacity key={`workDay-info-${index}`}  style={styles.workDays}
                                                    onPress={()=>{this.toggleExpandableIndex(workDay,index)}}>
                                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                            
                                                            {
                                                                (this.getStructurePropsFromParams("type") ==='labo'|| this.getStructurePropsFromParams("type")==="center")?(
                                                                    <Text style={{fontSize:16,fontWeight:'bold', fontStyle:'italic', paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:constants.colors.statusBar}}>
                                                                        &nbsp;
                                                                    </Text>
                                                                ):<View/>
                                                            }
                                                            <Text style={{fontSize:16,fontWeight:'bold', fontStyle:'italic', paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:constants.colors.statusBar}}>
                                                                {`${this.dateToFrench(workDay)}`}
                                                            </Text>                                                            
                                                        
                                                            {
                                                                (this.getStructurePropsFromParams("type") ==='labo'|| this.getStructurePropsFromParams("type")==="center")?(
                                                                    <Ionicons name={this.state.expandableIndex===index?'md-remove':'md-add'} size={20} color={constants.colors.statusBar} style={{paddingHorizontal:10,right:0,textAlignVertical:'center'}} />
                                                                ):<View/>
                                                            }
                                                        </View>
                                                        {
                                                            (this.state.expandableIndex===index && (this.getStructurePropsFromParams("type") ==='labo'|| this.getStructurePropsFromParams("type")==="center"))?(
                                                                <View>
                                                                    <View style={[styles.sideDivider,{width:'30%'}]} />

                                                                    <Text style={{fontSize:14,fontWeight:'bold', paddingVertical:5, marginTop:0, alignSelf:'center', textAlign:'center',color:'#000'}}>
                                                                        {this.getStructurePropsFromParams("type") ==='labo'?'Liste des laborantins':'Agents de santé du centre'}
                                                                    </Text>
                                                                    <View style={{flexDirection:'column', paddingVertical:5, marginTop:0, alignSelf:'center'}}>
                                                                        {
                                                                            workDay.workers?(
                                                                                workDay.workers.map((workerInfo,index)=>(
                                                                                    <Text key={`indexable-${index}`} style={{fontSize:18,fontFamily:constants.fonts.secondary,paddingVertical:2,textAlign:'center', color:'#FF6F00'}}>
                                                                                        {workerInfo.fullname}
                                                                                    </Text>
                                                                                ))
                                                                            ):(
                                                                            <Text style={{fontSize:18, paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:'red'}}>
                                                                                Non définit
                                                                            </Text>)
                                                                        }
                                                                    </View>
                                                                </View>
                                                            ):null
                                                        }
                                                    </TouchableOpacity>
                                                )
                                            })    
                                        }    
                                    </ScrollView>
                                ):(
                                    this.state.loadingWorkDays?(
                                        <ActivityIndicator size='large'/>
                                    ):(
                                        <Text style={{fontSize:18, fontStyle:'italic', paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:constants.colors.statusBar}}>
                                            Rien à afficher
                                        </Text> 
                                    )
                                )
                            }
                        </View>
                    </View>           
                </ScrollView>
                <View>
                    <BottomSheet
                        visible={this.state.showBottomSheet}
                        onBackButtonPress={this.hideBottomNavigation}
                        onBackdropPress={this.hideBottomNavigation}>
                    
                        <View style={styles.bottomNavigationView}>
                        
                            <Text style={styles.bottomTitleView}>
                                {this.state.selectedActivity?this.state.selectedActivity.name:'Non défini'}
                            </Text>

                            {
                                this.state.selectedActivity?(
                                    <View style={{marginTop:8,flexDirection:'column',justifyContent:'space-between', alignSelf:'center', width:'85%', marginBottom:10}}>
                                        <Text style={styles.bottomItemTitle}>
                                            COÛT      : {this.state.selectedActivity.cost+" F CFA"}
                                        </Text>

                                        <Text style={styles.bottomItemTitle}>
                                            DURÉE    : {this.getFormatedDuration(this.state.selectedActivity)}
                                        </Text>
                                    </View>
                                ):<View/>
                            }
                        </View>
                    </BottomSheet>
                    {
                        (this.state.activities && this.state.workDays)?(
                            <TouchableOpacity style={styles.fab} onPress={()=>{this.requestRendezvous()}}>
                                <Ionicons  name='md-calendar' size={24} color='#fff'/>
                            </TouchableOpacity>
                        ):null
                    }
                </View>
            </View>
        );
    }

    getFormatedDuration = ({duration})=>{
        if(duration){
            let timeAsArray = duration.split(":");
            let [hh,mm,ss] = timeAsArray.map((val)=>parseInt(val));

            if(hh===0){
                return mm+" min "+ss+ " sec";
            }else{
                return mm+" h "+mm+ " sec";
            }
        }
        return 'Non définit';
    }

    _showActivityDetails = async (activity)=>{
        await this.setState({
            selectedActivity:activity
        });
        this.showBottomNavigation();
    }

    showBottomNavigation = async ()=>{
        await this.setState({
            showBottomSheet:true
        });
    }

    hideBottomNavigation = async ()=>{
        await this.setState({
            showBottomSheet:false
        });
    }

    toggleExpandableIndex = async(workDay,index)=>{
        let expandableIndex=index;
        if(this.state.expandableIndex===index){
            expandableIndex=-1;
        }
        await this.setState({expandableIndex})
    }

    getStructurePropsFromParams = (prop) =>{
        return (this.props.navigation.state.params)?this.props.navigation.state.params[prop]:null;
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

    _getWorkDays = ()=>{
        this.setState({loadingWorkDays:true})
        RequestHandler.getStructureWorkDays(
            this.state.structure.id,
            this._workDaysSuccess,
            this._workDaysFailure,
        )
    }


    _workDaysSuccess = (response)=>{
        this.setState({
            loadingWorkDays:false,
            workDays:response.data
        })
    }

    _workDaysFailure = (response)=>{
        this.setState({
            loadingWorkDays:false,
            workdaysError:response.data
        })
    }

    _getActivities = ()=>{
        this.setState({loadingActivities:true})
        RequestHandler.getStructureActivities(
            this.state.structure.id,
            this._workActivitiesSuccess,
            this._workActivitiesFailure,
        )
    }

    _workActivitiesSuccess = (response)=>{
        this.setState({
            loadingActivities:false,
            activities:response.data
        })
    }

    _workActivitiesFailure = (error)=>{
        this.setState({
            loadingActivities:false,
            activitiesError:error+""
        })
    }

    /*_getActivities = ()=>{
        this.setState({
            loadingActivities:true
        })
        RequestHandler.getStructureActivities(
            this.state.structure.id,
            (response)=>{
                this.setState({
                    activities:response.data,
                    loadingActivities:false
                })
            },
            (error)=>{
                this.setState({
                    activitiesError:error+"",
                    loadingActivities:false
                });
            }
        );
    }*/

    _extractAddress = ()=>{
        if(this.state.structure){
            let {structure} = this.state;
            if(structure.address){
                return structure.address;
            }else{
                return structure.city.name.toUpperCase()+` (${structure.country.name.toUpperCase()})`
            }
        }else{
            return "Rien à afficher"
        }
    }

    _extractPropsToState = async ()=>{
        await this.setState({
            ...this.state,
            ...this.props.navigation.state.params
        })
    }

    requestRendezvous(date){
        let {navigation} = this.props; 
        let {} = this.state;
       
        navigation.navigate("RequestRendezvous2",{
            structure:this.state.structure
        });
    }

    /*handleError (error, description){
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
    }*/

    async componentDidMount(){
        await this._extractPropsToState();
        this._getActivities();
        this._getWorkDays();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = ()=>{
        return false;
    }

    componentWillUnmount(){
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
    workDays:{
        borderColor:constants.colors.statusBar,
        borderWidth:0.5,
        borderRadius:1,
        marginVertical:4,
        width:'90%',
        alignSelf:'center'
    },
    bottomNavigationView: {
      backgroundColor: '#fff',
      width: '100%',
      flexDirection:'column',
      height: 180,
      justifyContent: 'center'
    },
    bottomItemTitle:{
        fontFamily:constants.fonts.secondary,
        color:constants.colors.blue.dark,
        fontSize:18,
        paddingVertical:2
    },
    bottomTitleView:{
      paddingVertical:15, 
      paddingHorizontal:5,
      textTransform:'uppercase',
      fontSize:16, 
      fontFamily:constants.fonts.secondary,
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
        width:55,
        height:55,
        bottom:30,
        right:30,
        borderRadius:27.5,
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
        //backgroundColor: "#00695c",
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
        backgroundColor:"#EEEEEE",
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
        fontSize:15,
        alignItems: 'center',
        textTransform:'uppercase',
        marginTop:8,
        fontWeight: 'bold',
    }
});