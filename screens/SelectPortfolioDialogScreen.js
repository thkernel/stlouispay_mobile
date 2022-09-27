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
    Picker,
    Dimensions,
    ActivityIndicator
} from 'react-native';


import moment from 'moment';

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
const height = Dimensions.get("window").height / 3;




export default class SelectPortfolioDialogScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selectedPortfolio: "",
            portfolios: null,
            card: null,
            loadingPortfolios: true,
            loadingPortfoliosFailed: false
          
        };

    }


    componentDidMount = async() => {
      let {params} = this.props.navigation.state;

      let {navigation} = this.props;
      let user_token= await AsyncStorage.getItem("@userInfos");

      await this.setState({
            
        user_token: user_token,
        card: params.card
      });

    // Get Card by uid
    await this.fetchPortfolios();
    
    

  }

  fetchPortfolios = async () => {
    await this.setState({
      loadingPortfolios:true,
      loadingPortfoliosFailed: false
    })

    RequestHandler.getPortfolios(
      this.getPortfoliosSuccess,
      this.getPortfoliosFailure
    );


  }

  getPortfoliosSuccess = response => {

    if (response){
      this.setState({
        portfolios: response,
        loadingPortfolios:false
      });
    }

    console.log("FETCH PORTFOLIOS DATA: ", response);
    this.state.portfolios.map( (item, index)=>{
     console.log("CURRENT PORTFOLIO: ",item.id + "index: "+index );
    })
    
  };

  getPortfoliosFailure = error => {
    this.setState({
      loadingPortfoliosFailed: true,

      
    });

        console.log("FETCH DATA: ", error);

  };

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
      return (
        <View>
          {this._renderContent() }
          </View>
        
      );
    }

    _renderContent(){
      if (this.state.portfolios != null && this.state.portfolios != undefined ) {
        return(
            <View>
              <StatusBar backgroundColor="#003d33" hidden={false} />
              <ScrollView>
                <View style={styles.headerView}>
                    <View style={styles.tilesArea}>
                        <Text style={styles.toolbarTitle}>Enregsitrement de la carte de visite</Text>
                    </View>
                </View>

                <View>
                  <Text style={{fontSize:18,marginTop:15, marginHorizontal:10,color:'#000'}}>
                    Portfolio
                  </Text>

                  <Picker
                    selectedValue={this.state.selectedPortfolio }
                    onValueChange={(itemValue, itemIndex) => this.setState({selectedPortfolio: itemValue})}>
                    {  
                      this.state.portfolios.map( (itemValue,itemIndex)=>{
                        
                       return <Picker.Item label={itemValue.name} value={itemValue.id} key={itemIndex} />
                       
                      }) 
                    }
                  </Picker>
                  
                </View>
                <View>
                  <TouchableOpacity style={{elevation:2,backgroundColor:constants.colors.toolBar, borderWidth:0.5, marginHorizontal:8, borderRadius:2}} onPress={()=>{this.saveCardInPortfolio()}}>
                      <Text style={{height:45, textAlign:'center',fontSize:18, color:'#fff', paddingTop:10, paddingVertical:10}} >   
                          Enregistrer
                      </Text>                        
                  </TouchableOpacity> 
                </View>
                </ScrollView>
            </View>
        );
      }else
      {
        
        if(this.state.loadingPortfolios){
          return (
            <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
              <ActivityIndicator color="#912455" size="large"/>
            </View>
          );
        }else if(this.state.loadingPortfoliosFailed){
          return (
            <View style={styles.container}>
              <Text style={styles.text}>Aucun portfolio</Text>
            
          </View>
          )
        }
      }
    }

    
    

    saveCardInPortfolio =()=>{
        let {selectedPortfolio,card,user_token} = this.state;


        //console.log("SELECTED PORTFOLIO: ", selectedPortfolio);
        //console.log("SELECTED CARD: ", card);
        //console.log("CURRENT USER: ", user_token);

        
        let payload ={
            user_token: user_token,
            card_id: card.id,
            portfolio_id: selectedPortfolio,
            
        }

        
        console.log("DONNEES ENVOYEES: ", payload);
                
        
        RequestHandler.saveCardInPortfolio(
            payload, 
            this.saveCardInPortfolioSuccess,
            this.saveCardInPortfolioFailure
        )
        
    }

    saveCardInPortfolioSuccess = (response) => { 
        //this.hideProgressDialog();
        console.log("COMMANDE SUCCESS: ", response);

        if (response.status === 'ok') {
          console.log(" C'EST OK");

        try{
             console.log("DANS TRY");

          let {navigation} = this.props;
          console.log(" NAVIGATION:", navigation);

          alert("Carte enregistrée dans le portfolio avec succès.");

          navigation.navigate("Home");
          console.log("APRES NAVIGATION");
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
        alert("Erreur d'enregistrement de la carte.")
      }
    }

    saveCardInPortfolioFailure = (e) => { 
        //this.hideProgressDialog();
        console.log("ERREUR: ", e);
        alert("Erreur d'enregistrement de la carte.")

        //Alert.alert("Hmmmm",JSON.stringify(e));
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
    },
    _qrcode:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30
    }
});