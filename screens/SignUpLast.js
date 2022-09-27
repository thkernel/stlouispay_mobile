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

import {CheckBox} from 'native-base';

import RequestHandler from "../utils/RequestHandler";
import AsyncStorage from "@react-native-community/async-storage";
import constants from "../utils/constants";

import Snackbar from 'react-native-snackbar';
import DateTimePicker from 'react-native-modal-datetime-picker'

import DialogProgress from 'react-native-dialog-progress';

import moment from 'moment'
import { ScrollView } from "react-native-gesture-handler";

export default class SignUpLast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmPassword:'',
      login: "",
      password: "",
      showPasswords:false,
      connecting: false,
      user: {},
    };
  }
  /*<>*/
  render() {
    return (
      <ImageBackground
        source={require("./../assets/icon-holilink.png")}
        style={styles.main}
      >
        <StatusBar backgroundColor="#003d33" hidden={false} />

        <ScrollView>
          <KeyboardAvoidingView style={{}} behavior="padding">
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.formContainer}>
               
                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Login"
                  style={styles.input}
                  value={this.state.login}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('login',text)
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
                  placeholder="Mot de passe"
                  style={styles.input}
                  secureTextEntry={this.state.showPasswords!==true}
                  value={this.state.password}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('password',text)
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
                  placeholder="Confirmer le mot de passe"
                  style={styles.input}
                  secureTextEntry={this.state.showPasswords!==true}
                  value={this.state.confirmPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('confirmPassword',text)
                  }}
                  ref={input => {
                    this.loginInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />

                <TouchableOpacity style={{paddingHorizontal:8,width:'100%',flexDirection:'row',justifyContent:'space-between'}} onPress={() => {this.toggleShowPassword()}}>
                  <CheckBox checked={this.state.showPasswords} onPress={() => {this.toggleShowPassword()}} />
                  <Text style={{color:'#000'}}>
                    Afficher les mots de passe
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginbtn}
                  onPress={this.signUp}
                >
                  {this.state.connecting ? (
                    <ActivityIndicator size="large" color={"#FF0000"} />
                  ) : (
                    <Text style={styles.logintext}> Terminer </Text>
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

  toggleShowPassword(){
    let {showPasswords} = this.state;
    this.setState({
      showPasswords:!showPasswords
    })
  }

  async componentWillMount(){
    try{
      let userInfosPartial = await AsyncStorage.getItem("@userInfosPartial");
      
      if(userInfosPartial !==null){
        let {id} = JSON.parse(userInfosPartial);
        this.setState({
          userId:id
        });
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
    if(type==='login'){
      this.setState({
        login:text
      });
    }else if(type==='password'){
      this.setState({
        password:text
      });
    }else if(type==='confirmPassword'){
      this.setState({
        confirmPassword:text
      });
    }
  };

  signUp = () => {
    let { login, password, userId, confirmPassword } = this.state;

    if(login!=='' && password!=='' && confirmPassword!==''){
      if(password !== confirmPassword){
        this.showSnackbar("Les mots de passe ne correspondent pas")
        return ;
      }
      this.showProgressDialog("Modification en cours","Veuillez patienter un instant...",false);
      let data = { login, password};
      RequestHandler.signUpLastStep(
        userId,
        data,
        this.signUpSuccess,
        this.signUpFailure
      );
    }else{
      this.showSnackbar("Veuillez, s'il vous plait, renseigner tous les champs.")
    }
    
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
        AsyncStorage.setItem("@userInfos", JSON.stringify(this.state.user));
        AsyncStorage.removeItem("@userInfosPartial");
        let {navigation} = this.props;
        navigation.navigate("Home");
      }catch(e){
        Snackbar.show({
          title: errorMessage,
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
  }

  showSnackbar(text){
    Snackbar.show({
      title: text,
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

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent:'center'
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
    marginTop: 120,
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
