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

//import { Dropdown } from 'react-native-material-dropdown';
import RequestHandler from '../utils/RequestHandler';

import femme from '../assets/private/medecins/femme.png';
import homme from '../assets/private/medecins/homme.png';

export default class RequestRendezvous extends React.Component{
    constructor(props){
        super(props);
        this.state={
            worker_names:'',
            worker_id:-1,
            selectedDate:'09/05/2019',
            showDTP:false,
            showTimePicker:false,
            dateRdv:'',
            gender:'m',
            hourRdv:'',
            reasonRdv:''
        };

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
                    onDateChange={(date)=>{
                        this.updateRendezvousHour(date)
                    }}
                    disabled={false}
                    onConfirm = {(date)=>{
                        this.updateRendezvousHour(date)
                    }}
                    onCancel  = {()=>{
                        this.closeTimePicker()
                    }}
                />
                <ScrollView>
                    <KeyboardAvoidingView behavior='padding'>
                        <View style={styles.headerView}>
                            <TouchableOpacity style={styles.leftArea} onPress={()=>{navigation.goBack()}}>
                                <Icon  name='arrow-left' size={16} color='#fff' style={{paddingHorizontal:10}} />
                                <Thumbnail  source={this.state.gender.toLowerCase()==='f'?femme:homme} color='#fff' style={{paddingHorizontal:10, width:44, height:44,borderRadius:22}} />
                            </TouchableOpacity>

                            <View style={styles.tilesArea}>
                                <Text style={styles.toolbarTitle}>{this.getHealthWorkerFullName()}</Text>
                            </View>

                            <View style={styles.rightArea}>
                                
                            </View>
                        </View>
                        <View>

                            <View style={{flexDirection:'column',marginVertical:15}}>
                                <Text style={{fontSize:18, marginHorizontal:10,color:'#000'}}>
                                    Date du rendez-vous
                                </Text>

                                <View style={{flexDirection:'row',marginTop:15,alignSelf:'center',marginHorizontal:20}}>
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

                                <View style={{flexDirection:'row',marginTop:15,alignSelf:'center',marginHorizontal:8}}>
                                    <TextInput onFocus={()=>{this.openTimePicker()}} value={this.state.hourRdv} style={{width:'100%',height:45, textAlign:'center',fontSize:18,borderColor:constants.colors.toolBar, borderWidth:0.5}} placeholder="15:00" underlineColorAndroid="#00000000"/>
                                </View>
                            </View>

                            <View style={{flexDirection:'column',marginVertical:15}}>
                                <Text style={{fontSize:18, marginHorizontal:10,color:'#000'}}>
                                    Motif du rendez-vous
                                </Text>

                                <View style={{flexDirection:'row',marginTop:15,marginHorizontal:8}}>
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


                            <TouchableOpacity style={{elevation:2,backgroundColor:constants.colors.toolBar, borderWidth:0.5, marginHorizontal:8, borderRadius:2}} onPress={()=>{this.validateRendezvous()}}>
                                <Text style={{height:45, textAlign:'center',fontSize:18, color:'#fff', paddingTop:10, paddingVertical:10}} >   
                                    VALIDER 
                                </Text>                        
                            </TouchableOpacity> 
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
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

    async validateRendezvous(){
        let {worker_id,structure_id,speciality_id,selectedDate,hourRdv,reasonRdv} = this.state;

        let userInfos = await AsyncStorage.getItem("@userInfos");
        this.showProgressDialog('Prise de rendez-vous','Veuillez patienter',true)

        selectedDate = selectedDate.replace("/","-");
        selectedDate = selectedDate.replace("/","-");

        let params ={
            patient_id:JSON.parse(userInfos).id,
            worker_id:worker_id,
            speciality_id:speciality_id,
            structure_id:structure_id,
            date_rdv:selectedDate+" "+hourRdv,
            rdv_reason:reasonRdv
        }


        await RequestHandler.scheduleRendezvous(
            params, 
            this.handleRequestRendezvousSuccess,
            this.handleRequestRendezvousFailure
        )
    }

    handleRequestRendezvousSuccess = (response) => { 
        this.hideProgressDialog();
        alert(JSON.stringify(response.message));
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

    handleRequestRendezvousFailure = (e) => { 
        this.hideProgressDialog();

        Alert.alert("Hmmmm",JSON.stringify(e));
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

    componentDidMount(){
        let {params} = this.props.navigation.state;

        this.setState({
            worker_id:params.worker_id?params.worker_id:-1,
            speciality_id:params.speciality_id?params.speciality_id:-1,
            structure_id:params.structure_id?params.structure_id:-1,
            gender:params.healthWorkerGender?params.healthWorkerGender:'m',
            worker_names:params.worker_names?params.worker_names:''
        });

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