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
  Platform
} from "react-native";

import RequestHandler from "../utils/RequestHandler";
import AsyncStorage from "@react-native-community/async-storage";
import constants from "../utils/constants";

import NetworkUtils from "../utils/NetworkUtils";

import Snackbar from 'react-native-snackbar';

export default class LoginActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidePassword: true,
      rememberMe: false,
      login: "",
      email: '',
      connecting: false,
      user: {},
      password: "",
      isConnected: null,
    };

  }

  /*<>*/
  render() {
    return (
      <View style={styles.main}>
        
        <StatusBar hidden />

        <KeyboardAvoidingView style={styles.innerContainer} behavior="padding">
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.formContainer}>
              <Image
                source={require("./../assets/logo-stlouis.png")}
                style={{ width: 75, height: 75 }}
              />
              <TextInput
                underlineColorAndroid={"#00000000"}
                returnKeyType="next"
                placeholderTextColor={"#000"}
                placeholder="Email"
                style={styles.input}
                value={this.state.email}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleEmailChange}
                ref={input => {this.emailInput = input;}}
                onSubmitEditing={() => {this.passwordInput.focus();}}
              />

              <TextInput
                underlineColorAndroid={"#00000000"}
                returnKeyType="go"
                placeholderTextColor={"#000"}
                secureTextEntry={this.state.hidePassword}
                value={this.state.password}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handlePasswordChange}
                placeholder="Mot de passe"
                style={[styles.input]}
                ref={input => {this.passwordInput = input;}}

              />

              <TouchableOpacity
                style={styles.loginbtn}
                onPress={this.attemptLogin}
              >
                {
                  this.state.connecting ? ( <ActivityIndicator size="large" color={"#FF0000"} />) : (
                  <Text style={[styles.logintext,{fontFamily:'candara'}]}> Se connecter </Text>)
                }
              </TouchableOpacity>


              <View style={{flexDirection:'row',marginVertical:8}}>
                

                
              </View>
              

              <Text style={styles.copyright}>
                &copy; 2022 LE SAINT LOUIS - Tous droits réservés.
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }

  requestSignUp = ()=> {
    let {navigation} = this.props;
    navigation.navigate("Register");
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

  

  async componentDidMount(){
    isConnected = await NetworkUtils.isNetworkAvailable();
    await this.setState({
            isConnected: isConnected,
        });


  }

  handleEmailChange = text => {
    this.setState({
      email: text.trim()
    });
  }

  handlePasswordChange = text => {
    this.setState({
      password: text
    });
  };


  attemptLogin = () => {
    let { email, password } = this.state;
    if (email.trim() !== "" && password.trim() !== "") {
      this.setState({
        connecting: true
      });

      console.log("Login: ", email);
      console.log("Mot de passe", password);

      RequestHandler.signIn(
        email,password,
        this.loginSuccess,
        this.loginFailed
      );
    } else {
      let errorMessage="";
      if (email.trim() === "" && password.trim() === "") {
        errorMessage = "Veuillez renseigner l'identifiant et le mot de passe";
      } else if (password.trim() === "") {
        errorMessage = "Veuillez renseigner l'identifiant"
      } else {
        errorMessage = "Veuillez renseigner le mot de passe";
      }

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
  };

  loginSuccess = response => {
    this.setState({
      connecting: false
    });

    console.log("DEBUT DE RESPONSE: ", response.status);
    ToastAndroid.showWithGravity(
      response.message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );

    if (response.status === "ok") {
      console.log("RESPONSE: ", response);
      this.setState({
        user: response.token
      });

      try{
        console.log("USER: ", this.state.user);
        AsyncStorage.setItem('@userInfos', this.state.user);
        let {navigation} = this.props;
        navigation.navigate("Home");
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
    }else{
      console.log("Reponse du serveur: ", response);
      alert("Email ou mot de passe incorrect!")
    }
  };

  loginFailed = error => {
    
    this.setState({
      connecting: false
    });

    console.log("Is connected: ", this.state.isConnected);
    console.log(error);
    if (this.state.isConnected !== true){
      alert("Problème de connection Internet. Veuillez vérifier votre connection Internet");
    }else{
      alert(error);
    }
  };

  updateRememberMe = value => {
    this.setState({
      rememberMe: value
    });
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#ffffff"
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
    fontFamily:'candara',
    color: "#000",
    borderWidth: 0.5
  },
  formContainer: {
    padding: 20,
    color: "#000",
    backgroundColor: "#ffffff",
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
    fontFamily:'candara',
    borderRadius: 3,
    /*backgroundColor: "#3F51B5"*/
    backgroundColor: constants.colors.toolBar
  },
  logintext: {
    color: "#FFF",
    padding: 4,
    fontFamily:'candara',
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
    fontFamily:'candara',
    fontStyle: 'italic',
    color:'#912455',
    borderRadius: 4,
    textAlign: "center",
    fontWeight: "bold"
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)"
  }
});
