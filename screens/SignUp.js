import React from "react";

import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ImageBackground,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Platform,
} from "react-native";

import {Radio, CheckBox} from 'native-base';

import RequestHandler from "../utils/RequestHandler";
import AsyncStorage from "@react-native-community/async-storage";
import constants from "../utils/constants";

import Snackbar from 'react-native-snackbar';
import DateTimePicker from 'react-native-modal-datetime-picker'

import DialogProgress from 'react-native-dialog-progress';

import moment from 'moment'
import { ScrollView } from "react-native-gesture-handler";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidePassword: true,
      rememberMe: false,
      login: "",
      birthday:'',
      gender:'M',
      showPicker:false,
      connecting: false,
      user: {},
      acceptedTerms:false,
      password: "",
      firstname:'',
      lastname:'',
      email:''
    };
  }
  /*<>*/
  render() {
    return (
      <ImageBackground
        source={require("./../assets/boites.jpg")}
        style={styles.main}
      >
        <StatusBar backgroundColor="#003d33" hidden={false} />

        <DateTimePicker
            isVisible={this.state.showPicker}
            defaultDate={new Date}
            maximumDate={new Date}
            locale={"fr"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText=" "
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={(date)=>{
                this.updateBirthDate(date)
            }}
            disabled={false}
            onConfirm = {(date)=>{
                this.updateBirthDate(date)
            }}
            onCancel  = {()=>{
                this.hideDatePicker()
            }}
        />
        <ScrollView>
          <KeyboardAvoidingView style={{}} behavior="padding">
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.formContainer}>
                <TouchableOpacity style={{}} onPress={this.pickImageFromGallery}>
                  <Image source={require("./../assets/logo-login.png")} style={{ width: 100, height: 100, marginBottom:20 }}/>
                </TouchableOpacity>
                
                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Nom"
                  style={styles.input}
                  value={this.state.lastname}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('lastname',text)
                  }}
                  ref={input => {
                    this.loginInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />

                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Prénom"
                  style={styles.input}
                  value={this.state.firstname}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('firstname',text)
                  }}
                  ref={input => {
                    this.loginInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />
                
                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Date de naissance"
                  style={styles.input}
                  value={this.state.birthday}
                  autoCorrect={false}
                  onFocus={() => {
                    this.showDatePicker()
                  }}
                  autoCapitalize="none"
                  onChangeText={this.updateBirthDate}
                  ref={input => {
                    this.loginInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />

                <View style={{alignSelf:'flex-start'}}>
                  <Text style={{alignSelf:'flex-start', textAlign:'left',color:'#000', fontSize:15,marginVertical:4}}>Sexe</Text>
                  <View style={styles.switchContainer}>
                    <TouchableOpacity style={{flexDirection:'row'}} onPress={() => { this.switchGenderTo('M')}}>
                      <Radio selected={this.state.gender==='M'} onPress={() => { this.switchGenderTo('M')}}/>
                      <Text style={{marginHorizontal:8}}>Masculin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection:'row'}} onPress={() => { this.switchGenderTo('F')}}>
                      <Radio selected={this.state.gender==='F'} onPress={() => { this.switchGenderTo('F')}}/>
                      <Text style={{marginHorizontal:8}}>Féminin</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="E-mail"
                  style={styles.input}
                  value={this.state.email}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('email',text)
                  }}
                  ref={input => {
                    this.loginInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />

                <View style={{alignSelf:'flex-start'}}>
                  <TouchableOpacity style={{flexDirection:'row'}} onPress={() => { this.toggleAcceptTerms()}}>
                      <CheckBox selected={this.state.acceptedTerms===true} onPress={() => { this.toggleAcceptTerms()}}/>
                      <Text style={{marginHorizontal:8, fontStyle:'italic', color:'#000',paddingHorizontal:8}}>J'accepte les conditions d'utilisations</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={styles.loginbtn}
                  onPress={this.signUp}
                >
                  {this.state.connecting ? (
                    <ActivityIndicator size="large" color={"#FF0000"} />
                  ) : (
                    <Text style={styles.logintext}> Suivant </Text>
                  )}
                </TouchableOpacity>              

                <Text style={styles.copyright}>
                  &copy; 2019 Ko-Santé PLUS - SANTÉ pour tous
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          </ScrollView>
      </ImageBackground>
    );
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

  toggleAcceptTerms = () =>{
    let {acceptedTerms} = this.state;
    this.setState({
      acceptedTerms:!acceptedTerms
    })
  }

  updateBirthDate(birthday){
    this.setState({
        birthday:moment(birthday).format("DD/MM/YYYY")
    });
    this.hideDatePicker();
  }

  showDatePicker  = () =>{
    Keyboard.dismiss();
    this.setState({
      showPicker:true
    })
  }

  hideDatePicker  = () =>{
    Keyboard.dismiss();
    this.setState({
      showPicker:false
    })
  }

  switchGenderTo = (gender) =>{
    this.setState({
      gender:gender
    });
  }

  pickImageFromGallery = () =>{
  
    let options={

    }
  }

  async componentWillMount(){
    try{
      let userInfos = await AsyncStorage.getItem("@userInfos");
      let {navigation} = this.props;
      if(userInfos!==null){
        navigation.navigate("Home");
      }
    }catch(e){
      Snackbar.show({
        title: e,
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
  }

  handleInputChange = (type, text) => {
    if(type==='firstname'){
      this.setState({
        firstname:text
      });
    }else if(type==='lastname'){
      this.setState({
        lastname:text
      });
    }else if(type==='email'){
      this.setState({
        email:text
      });
    }
  };

  signUp = () => {
    let { firstname, lastname, email, birthday, gender } = this.state;

    this.showProgressDialog("Inscription","Veuillez patienter un instant...",false);
    let data = { firstname, lastname, email, birthday, gender };
    RequestHandler.signUpStep1(
      data,
      this.signUpSuccess,
      this.signUpFailure
    );
  };

  signUpSuccess = response => {
    this.hideProgressDialog();
    this.setState({
      connecting: false
    });

    ToastAndroid.showWithGravity(
      response.message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );

    if (response.status === "success") {
      this.setState({
        user: response.data[0]
      });

      try{
        AsyncStorage.setItem("@userInfosPartial", JSON.stringify(this.state.user));
        let {navigation} = this.props;
        navigation.navigate("SignUpLast");
      }catch(e){
        Snackbar.show({
          title: e,
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
    }
  };

  signUpFailure = error => {
    this.hideProgressDialog();
    this.setState({
      connecting: false
    });
    Snackbar.show({
      title: JSON.stringify(error),
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        title: 'UNDO',
        color: 'green',
        onPress: () => { 
            // Do something. 
          },
      },
    });
    console.log(error);
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  switchContainer:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  input: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 6,
    textAlign: "center",
    marginVertical: 10,
    marginHorizontal: 8,
    borderColor: constants.colors.toolBar,
    fontSize: 14,
    color: "#000",
    borderWidth: 0.5
  },
  formContainer: {
    padding: 20,
    color: "#000",
    backgroundColor: "rgba(255,255,255,0.75)",
    marginTop: 60,
    flexDirection: "column",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8
  },
  loginbtn: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 12,
    borderRadius: 3,
    /*backgroundColor: "#3F51B5"*/
    backgroundColor: constants.colors.toolBar
  },
  logintext: {
    color: "#FFF",
    padding: 4,
    fontWeight: "bold",
    textAlign: "center"
  },
  copyright: {
    flexDirection: "row",
    marginVertical: 12,
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 12,
    fontStyle: 'italic',
    color:'#D84315',
    borderRadius: 4,
    textAlign: "center",
    fontWeight: "bold"
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)"
  }
});
