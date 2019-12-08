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

import Snackbar from 'react-native-snackbar';

export default class LoginActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidePassword: true,
      rememberMe: false,
      login: "",
      connecting: false,
      user: {},
      password: ""
    };
  }
  /*<>*/
  render() {
    return (
      <ImageBackground
        source={require("./../assets/boites.jpg")}
        style={styles.main}
      >
        <StatusBar hidden />

        <KeyboardAvoidingView style={styles.innerContainer} behavior="padding">
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.formContainer}>
              <Image
                source={require("./../assets/logo-login.png")}
                style={{ width: 75, height: 75 }}
              />
              <TextInput
                underlineColorAndroid={"#00000000"}
                returnKeyType="next"
                placeholderTextColor={"#000"}
                placeholder="Identifiant"
                style={styles.input}
                value={this.state.login}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleLoginChange}
                ref={input => {this.loginInput = input;}}
                onSubmitEditing={() => {this.passwordInput.focus();}}
              />

              <TextInput
                underlineColorAndroid={"#00000000"}
                ref={input => {this.passwordInput = input;}}
                returnKeyType="go"
                placeholderTextColor={"#000"}
                secureTextEntry={this.state.hidePassword}
                value={this.state.password}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handlePasswordChange}
                placeholder="Mot de passe"
                style={[styles.input]}
              />

              <TouchableOpacity
                style={styles.loginbtn}
                onPress={this.attemptLogin}
              >
                {this.state.connecting ? (
                  <ActivityIndicator size="large" color={"#FF0000"} />
                ) : (
                  <Text style={[styles.logintext,{fontFamily:'candara'}]}> LOGIN </Text>
                )}
              </TouchableOpacity>


              <View style={{flexDirection:'row',marginVertical:8}}>
                <Text style={{fontStyle:'italic', color:'#000',fontFamily:'candara'}}>
                  Pas de compte ? 
                </Text>

                <TouchableOpacity style={{}} onPress={this.requestSignUp}>
                  <Text style={{color:constants.colors.blue.light,fontFamily:'candara',marginHorizontal:6, fontSize:16, fontWeight:'bold'}}>
                    Inscrivez-vous
                  </Text>
                </TouchableOpacity>
              </View>
              

              <Text style={styles.copyright}>
                &copy; 2019 Ko-Santé PLUS - SANTÉ pour tous
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  requestSignUp = ()=> {
    let {navigation} = this.props;
    navigation.navigate("SignUp");
  }

  async componentWillMount(){
    try{
      let userInfos = await AsyncStorage.getItem("@userInfos");
      let userInfosPartial = await AsyncStorage.getItem("@userInfosPartial");
      let {navigation} = this.props;
      if(userInfos!==null){
        navigation.navigate("Home");
      }else if(userInfosPartial !==null){
        navigation.navigate("SignUpLast");
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

  handleLoginChange = text => {
    this.setState({
      login: text
    });
  }

  handlePasswordChange = text => {
    this.setState({
      password: text
    });
  };

  attemptLogin = () => {
    let { login, password } = this.state;
    if (login.trim() !== "" && password.trim() !== "") {
      this.setState({
        connecting: true
      });

      
      RequestHandler.signIn(
        {login,password},
        this.loginSuccess,
        this.loginFailed
      );
    } else {
      let errorMessage="";
      if (login.trim() === "" && password.trim() === "") {
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
      alert("PPPPPPPPPP")
    }
  };

  loginFailed = error => {
    this.setState({
      connecting: false
    });
    console.log(error);
  };

  updateRememberMe = value => {
    this.setState({
      rememberMe: value
    });
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1
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
