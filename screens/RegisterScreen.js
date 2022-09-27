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
  Picker,
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
import NetworkUtils from "../utils/NetworkUtils";


import Snackbar from 'react-native-snackbar';
import DateTimePicker from 'react-native-modal-datetime-picker'

import DialogProgress from 'react-native-dialog-progress';

import moment from 'moment'
import { ScrollView } from "react-native-gesture-handler";
import RNPickerSelect from 'react-native-picker-select';


const civilities = [{label: 'Civilité', value: ''},{label: 'Mr', value: 'Mr'}, {label: 'Mme', value: 'Mme'}, {label: 'Mlle', value: 'Mlle'}];
const countries = [{label: 'Pays', value: ''}, {label: 'Mali', value: 'Mali'}]
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidePassword: true,
      rememberMe: false,
      login: "",
      showPicker:false,
      connecting: false,
      user: {},
      acceptedTerms:false,

      first_name:'',
      last_name:'',
      civility: '',
      profession: '',
      address: '',
      city: "",
      locality: "",
      country: "",
      neighborhood: "",
      phone: "",
      email:'',
      
      
      password: "",
      password_confirmation:'',
      showPasswords:false,
      connecting: false,
      selectedCivility:'',
      selectedCountry: '',
      isConnected: null,
    };
  }
  /*<>*/
  render() {
    return (
      <View style={styles.main}>
        <StatusBar backgroundColor="#003d33" hidden={false} />

        
        <ScrollView>
          <KeyboardAvoidingView style={{}} behavior="padding">
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.formContainer}>
                <TouchableOpacity style={{}} onPress={this.pickImageFromGallery}>
                  <Image source={require("./../assets/icon-holilink.png")} style={{ width: 100, height: 100, marginBottom:20 }}/>
                </TouchableOpacity>
                
                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Nom"
                  style={styles.input}
                  value={this.state.last_name}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('last_name',text)
                  }}
                  ref={input => {
                    this.lastNameInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.firstNameInput.focus();
                  }}
                />

                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Prénom"
                  style={styles.input}
                  value={this.state.first_name}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('first_name',text)
                  }}
                  ref={input => {
                    this.lastNameInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />
                
                <View style={styles.pickerStyle}>
                <Picker
                  
                    selectedValue={this.state.civility}
                    style={{width: '100%',textAlign: "center"}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({civility: itemValue})
                    }>
                    {

                      civilities.map((item) =>{
                        return (<Picker.Item label={item.label} value={item.value} />
)
                      })
                    }
                  </Picker>
                  </View>

                  <View style={styles.pickerStyle}>
                <Picker
                  
                    selectedValue={this.state.country}
                    style={{width: '100%',textAlign: "center"}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({country: itemValue})
                    }>
                    {

                      countries.map((item) =>{
                        return (<Picker.Item label={item.label} value={item.value} />
)
                      })
                    }
                  </Picker>
                  </View>


                 

                  
                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Localité"
                  style={styles.input}
                  value={this.state.locality}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('locality',text)
                  }}
                  ref={input => {
                    this.localityInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.localityInput.focus();
                  }}
                />

                <TextInput
                  underlineColorAndroid={"#00000000"}
                  returnKeyType="next"
                  placeholderTextColor={"#000"}
                  placeholder="Quartier"
                  style={styles.input}
                  value={this.state.neighborhood}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('neighborhood',text)
                  }}
                  ref={input => {
                    this.neighborhoodInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.neighborhoodInput.focus();
                  }}
                />



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
                    this.emailInput = input;
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
                    this.passwordInput = input;
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
                  value={this.state.password_confirmation}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(text)=>{
                    this.handleInputChange('password_confirmation',text)
                  }}
                  ref={input => {
                    this.passwordConfirmationInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                />

                


                <View style={{alignSelf:'flex-start'}}>
                  <TouchableOpacity style={{flexDirection:'row'}} onPress={() => { this.toggleAcceptTerms()}}>
                      <Text style={{marginHorizontal:8, fontStyle:'italic', color:'#000',paddingHorizontal:8}}>En cliquant sur le bouton S'inscrire, vous acceptez nos conditions d'utilisations</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={styles.loginbtn}
                  onPress={this.signUp}
                >
                  {this.state.connecting ? (
                    <ActivityIndicator size="large" color={"#FF0000"} />
                  ) : (
                    <Text style={styles.logintext}> S'inscrire </Text>
                  )}
                </TouchableOpacity>   

                <View style={{flexDirection:'row',marginVertical:8}}>
                <Text style={{fontStyle:'italic', color:'#000',fontFamily:'candara'}}>
                  Déjà un compte ? 
                </Text>

                <TouchableOpacity style={{}} onPress={this.requestLogin}>
                  <Text style={{color:constants.colors.blue.light,fontFamily:'candara',marginHorizontal:6, fontSize:16, fontWeight:'bold'}}>
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </View>


                <Text style={styles.copyright}>
                  &copy; 2021 Holilink
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          </ScrollView>
      </View>
    );
  }

  requestLogin = ()=> {
    let {navigation} = this.props;
    navigation.navigate("Login");
  }

  updateGender = (value) =>{
    this.setState({
      selectedGender: value
    })
  }

 


  toggleShowPassword(){
    let {showPasswords} = this.state;
    this.setState({
      showPasswords:!showPasswords
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

  toggleAcceptTerms = () =>{
    let {acceptedTerms} = this.state;
    this.setState({
      acceptedTerms:!acceptedTerms
    })
  }

  

  

  
  

  async componentDidMount(){
    //await this.fetchLocalities();
    //await this.fetchCountries();

    isConnected = await NetworkUtils.isNetworkAvailable();
    await this.setState({
            isConnected: isConnected,
        });

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
    if(type==='first_name'){
      this.setState({
        first_name:text
      });
    }else if(type==='last_name'){
      this.setState({
        last_name:text
      });
    }else if(type==='email'){
      this.setState({
        email:text
      });
    
    }else if(type==='password'){
      this.setState({
        password:text
      });
    }else if(type==='password_confirmation'){
      this.setState({
        password_confirmation:text
      });
    }else if(type==='locality'){
      this.setState({
        locality:text
      });
    }else if(type==='neighborhood'){
      this.setState({
        neighborhood:text
      });
    }
  };


  


  


  signUp = () => {


    let { civility, first_name, last_name, email, password, password_confirmation,  locality, country, neighborhood  } = this.state;

    if (civility.trim() != "" && first_name.trim() != "" && last_name.trim() !="" && email.trim() != "" && password.trim() != "" && password_confirmation.trim() != "" && country.trim() != "" && locality.trim() != "") {

      this.showProgressDialog("Inscription","Veuillez patienter un instant...",false);
      let data = { civility, first_name, last_name, email, password, password_confirmation,  locality, country, neighborhood };
      
      console.log("DATA TO SEND FOR SIGNUP: ", data);

      RequestHandler.signUp(
        data,
        this.signUpSuccess,
        this.signUpFailure
      );
    }else{
      let errorMessage="";
      if (first_name.trim() == "") {
        errorMessage = "Veuillez renseigner le prénom";
      } else if (last_name.trim() == "") {
        errorMessage = "Veuillez renseigner le nom"
      }else if (civility.trim() == "") {
        errorMessage = "Veuillez renseigner la civilité"
      }else if (email.trim() == "") {
        errorMessage = "Veuillez renseigner l'adresse email"
      }else if (password.trim() == "") {
        errorMessage = "Veuillez renseigner le mot de passe"
      }else if (password_confirmation.trim() == "") {
        errorMessage = "Veuillez renseigner la confirmation du mot de passe"
      }else if (country.trim() == "") {
        errorMessage = "Veuillez renseigner le pays"
      }else if (locality.trim() == "") {
        errorMessage = "Veuillez renseigner la localité"
      }else if (neighborhood.trim() == "") {
        errorMessage = "Veuillez renseigner le quartier"
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

    if (response.status === "ok") {
      /*
      this.setState({
        user: response.token
      });
      */

      try{
        //AsyncStorage.setItem("@userInfos", JSON.stringify(this.state.user));
        let {navigation} = this.props;
        navigation.navigate("Login");
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
    }else if (response.error_code === 405){
      console.log("Reponse du serveur: ", response);
      alert("Mot de passe invalide, Il doit être au moins de 8 caractères. Et rassurez-vous que la confirmation du mot de passe et le mot de passe sont les mêmes. ");
    }else if (response.error_code === 406){
      alert("L'adresse email indisponible ou incorrecte.");
    }

  };

  signUpFailure = error => {
    this.hideProgressDialog();
    this.setState({
      connecting: false
    });

    /*
    Snackbar.show({
      title: JSON.stringify(error),
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        title: 'Erreur',
        color: 'green',
        onPress: () => { 
            // Do something. 
          },
      },
    });

    */
    console.log(error);
    if (this.state.isConnected !== true){
      alert("Problème de connection Internet. Veuillez vérifier votre connection Internet");
    }else{
      alert(error);
    }
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
    
    marginVertical: 10,
    marginHorizontal: 8,
    borderColor: constants.colors.toolBar,
    fontSize: 14,
    color: "#000",
    borderWidth: 0.5
  },
  pickerStyle: {
    width: "100%",
    
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