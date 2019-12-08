import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';


import SQLite from 'react-native-sqlite-storage';

import moment from 'moment';
import geolib from 'geolib';

import DialogProgress from 'react-native-dialog-progress';

import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome5';
import constants from '../utils/constants';
import { Thumbnail, DatePicker } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';

import Snackbar from 'react-native-snackbar';

import { Dropdown } from 'react-native-material-dropdown';
//import { Select, Option, OptionList, updatePosition } from 'react-native-dropdown';
import RequestHandler from '../utils/RequestHandler';

import structure from '../assets/private/structure.png';

export default class RequestRendezvousWithStructure extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activities:[],
            selectedDate:'09/05/2019',
            showDTP:false,
            showTimePicker:false,
            dateRdv:'',
            loadingActivities:false,
            activitiesError:null,
            hourRdv:'',
            reasonRdv:''
        };

    }

    _extractPropsToState = async ()=>{
        await this.setState({
            structure:this.props.navigation.state.params.structure
        })
    }

    showProgressDialog(title,text,cancelable){
        let options = {
            title:title,
            message:text,
            isCancelable:cancelable?(cancelable===true):false
        }

        DialogProgress.show(options);
    }

    hideProgressDialog(){
        DialogProgress.hide()
    }

    render(){
        let {navigation} = this.props;


        return(
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="#003d33" hidden={false} />

                <DateTimePicker
                    isVisible={this.state.showDTP}
                    defaultDate={new Date}
                    minimumDate={new Date}
                    locale={"fr"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText=" "
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onDateChange={(date)=>{
                        this.updateRendezvousDate(date)
                    }}
                    disabled={false}
                    onConfirm = {(date)=>{
                        this.updateRendezvousDate(date)
                    }}
                    onCancel  = {()=>{
                        this.closeDatePicker()
                    }}
                />


                <DateTimePicker
                    isVisible={this.state.showTimePicker}
                    defaultDate={new Date}
                    locale={"fr"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    mode={"time"}
                    placeHolderText=" "
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onDateChange={(date)=>{this.updateRendezvousHour(date)}}
                    disabled={false}
                    onConfirm = {(date)=>{this.updateRendezvousHour(date)}}
                    onCancel  = {()=>{this.closeTimePicker()}}
                />
                <View>
                    <KeyboardAvoidingView behavior='padding'>
                        <View style={styles.headerView}>
                            <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                                <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                                <Thumbnail  source={structure} color='#fff' style={{paddingHorizontal:10, width:36, height:36,borderRadius:22}} />
                            </TouchableOpacity>

                            <View style={styles.tilesArea}>
                                <Text style={styles.toolbarTitle}>{this.state.structure?this.state.structure.name.toUpperCase():''}</Text>
                            </View>

                            <View style={styles.rightArea}>
                                
                            </View>
                        </View>
                        <ScrollView style={{marginBottom:100}}>

                            <View style={{flexDirection:'column',marginVertical:15}}>
                                <Text style={{fontSize:18, marginHorizontal:10,color:'#000'}}>
                                    Activité
                                </Text>

                                <View style={{flexDirection:'row',marginTop:5,alignSelf:'center',marginHorizontal:8}}>
                                    <Dropdown 
                                        data={this.state.activities}
                                        label="Chosissez une activité"
                                        containerStyle={{width:'100%'}}
                                        itemTextStyle={{
                                            elevation:4
                                        }}
                                        pickerStyle={{
                                            borderRadius:0,
                                            borderColor:'#E57373',
                                            borderWidth:0.5
                                        }}
                                        selectedItemColor="#80CBC4"
                                        labelExtractor = {(item, index) => item.name}
                                        valueExtractor = {(item, index) => item.id}
                                        ref = {(input) => {this.dropdownInput=input}}
                                    />
                                </View>
                            </View>

                            <View style={{flexDirection:'column',marginVertical:0}}>
                                <Text style={{fontSize:18, marginHorizontal:10,color:'#000'}}>
                                    Date du rendez-vous
                                </Text>

                                <View style={{flexDirection:'row',marginTop:5,alignSelf:'center',marginHorizontal:20}}>
                                    <TouchableOpacity  onPress={()=>{this.openDatePicker()}} style={{width:'95%',height:45,fontSize:18,borderColor:constants.colors.toolBar,textAlign:'center', borderWidth:0.5}}>
                                        <TextInput value={this.state.selectedDate} editable={false} placeholder="09/05/2019" style={{textAlign:'center',fontSize:18,color:"#000"}} underlineColorAndroid="#00000000"/>
                                    </TouchableOpacity>
                                
                                    <TouchableOpacity style={{width:45, height:45,backgroundColor:constants.colors.toolBar, borderBottomEndRadius:4, borderTopEndRadius:4}} onPress={()=>{this.openDatePicker()}}>
                                        <Icon  name='calendar' size={24} color='#fff' style={{alignSelf:'center', marginTop:8}} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{flexDirection:'column',marginVertical:15}}>
                                <Text style={{fontSize:18, marginHorizontal:10,color:'#000'}}>
                                    Heure du rendez-vous
                                </Text>

                                <View style={{flexDirection:'row',marginTop:5,alignSelf:'center',marginHorizontal:8}}>
                                    <TextInput onFocus={()=>{this.openTimePicker()}} value={this.state.hourRdv} style={{width:'100%',height:45, textAlign:'center',fontSize:18,borderColor:constants.colors.toolBar, borderWidth:0.5}} placeholder="15:00" underlineColorAndroid="#00000000"/>
                                </View>
                            </View>

                            <View style={{flexDirection:'column'}}>
                                <Text style={{fontSize:18, marginHorizontal:10,color:'#000'}}>
                                    Motif du rendez-vous
                                </Text>

                                <View style={{flexDirection:'row',marginTop:5,marginHorizontal:8}}>
                                    <TextInput 
                                        style={{width:'100%',textAlign:'left',fontSize:18,borderColor:constants.colors.toolBar, borderWidth:0.5}} 
                                        placeholder="Motif" 
                                        multiline = {true}
                                        value={this.state.reasonRdv}
                                        onChangeText={(text)=>this.updateReason(text)}
                                        numberOfLines = {4}
                                        underlineColorAndroid="#00000000"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={{marginTop:8,elevation:2,backgroundColor:constants.colors.toolBar, borderWidth:0.5, marginHorizontal:8, borderRadius:2, marginBottom:40}} onPress={()=>{this.validateRendezvous()}}>
                                <Text style={{height:45, textAlign:'center',fontSize:18, color:'#fff', paddingTop:10, paddingVertical:10}} >   
                                    VALIDER 
                                </Text>                        
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    dateToFrench(reference){
        days={
            MONDAY:'Lundi',
            TUESDAY:'Mardi',
            WEDNESDAY:'Mercredi',
            THURSDAY:'Jeudi',
            FRIDAY:'Vendredi',
            SATURDAY:'Samedi',
            SUNDAY:'Dimanche'
        };

        return (
            days[reference]
        )
    }

    updateReason(text){
        this.setState({
            reasonRdv:text
        });
    }

    openDatePicker(){
        this.setState({
            showDTP:true
        });
    }

    closeDatePicker(){
        this.setState({
            showDTP:false
        });
    }

    openTimePicker(){
        this.setState({
            showTimePicker:true
        });
    }

    closeTimePicker(){
        this.setState({
            showTimePicker:false
        }); 
    }

    toPHPDateTime = (date, time)=>{
        let [day,month,year] = date.split("/")
        let [hour,min] = time.split(":")
        return [year,month,day].join("-")+" "+[hour,min].join(":")        
    }

    async validateRendezvous(){
        let activity_id = this.dropdownInput.value();
        let date_rdv = this.toPHPDateTime(this.state.selectedDate,this.state.hourRdv);
        let rdv_reason = this.state.reasonRdv;
        let structure_id = this.state.structure.id;
        let {patient_id} = this.state;
        
        let params = {
            activity_id,
            date_rdv,
            rdv_reason,
            structure_id,
            patient_id
        }
        this.showProgressDialog("Prise de rendezvous","Veuillez patienter",false);
        //alert(JSON.stringify(params));return;
       
        await RequestHandler.scheduleRendezvousForStructure(
            params, 
            this._requestRendezvousSuccess,
            this._requestRendezvousFailure
        )
    }

    _requestRendezvousSuccess = (response) => { 
        this.hideProgressDialog();
       
        Snackbar.show({
            title: response.message,
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

    _fetchActivities  = () => { 
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
        //alert(error+"");
        this.setState({
            loadingActivities:false,
            activitiesError:error+""
        })
    }

    _requestRendezvousFailure = (e) => { 
        this.hideProgressDialog();

        Alert.alert("Prise de rendez-vous",JSON.stringify(e+""));
        /*Snackbar.show({
            title: JSON.stringify(e),
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              title: 'OK',
              color: 'green',
              onPress: () => { 
                  // Do something. 
                },
            },
        });
        */
    }

    async componentDidMount(){
        let userInfos = await AsyncStorage.getItem("@userInfos");

        await this._extractPropsToState();
        this.setState({
            patient_id:userInfos?JSON.parse(userInfos).id:-1
        })

        this._fetchActivities();

        this.loadDatabase();
    }

    loadDatabase(){
        const db = SQLite.openDatabase({
            name : "ko-sante.app.db", 
            createFromLocation : "../assets/databases/ko-sante.app.db"
            }, 
            this.databaseSuccess,
            this.databaseFailure
        );
    }

    databaseSuccess= (db) => { 
        console.log(db) 
        alert("OK")
    }

    databaseFailure= (error) => { 
        //alert("error")
    }

    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }

    updateRendezvousDate(selectedDate){
        this.setState({
            selectedDate:moment(selectedDate).format("DD/MM/YYYY")
        });
        this.closeDatePicker();
    }

    updateRendezvousHour(hourRdv){
        //alert(moment(hourRdv).format("HH:mm"));
        this.setState({
            hourRdv:moment(hourRdv).format("HH:mm")
        });
        this.closeTimePicker();
    }

    getHealthWorkerFullName(){
        let {worker_names}= this.state;
        return worker_names?worker_names:'';
    }
}

const styles = StyleSheet.create({
    headerView:{
        flexDirection:'row',
        height:Platform.OS==='ios'?44:56,
        backgroundColor:constants.colors.toolBar,
    },
    tilesArea:{
        flexDirection: 'column',
        justifyContent:'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    leftArea:{
        flexDirection: 'row',
        alignItems:'center'
    },
    toolbarTitle:{
        color:'#fff',
        fontSize:16,
        alignItems: 'center',
        marginTop:8,
        fontWeight: 'bold',
    }
});