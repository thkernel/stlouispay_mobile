import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  PushNotificationIOS
} from "react-native";

import {
  Container,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Icon,
  Fab
} from "native-base";

import Moment from "moment";
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';
import { ActivityIndicator } from "react-native-paper";
import ThemeColors from "../constants/ThemeColors";


const windowObject = Dimensions.get("window")
const screenObject = Dimensions.get("screen")

const Properties ={
  window:windowObject,
  screen:screenObject,
};

const height = Dimensions.get("window").height / 3;



export default class Polls extends Component {
  
constructor(props) {
    super(props);

    this.state = {
      loadingPolls:true,
      polls: null,
      loadingHWErrors:null,

    };
  }

  render() {
    return (
      <Container>
        <View style={{marginBottom:35/*,backgroundColor:'#f0f0f0'*/}}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >


           { this._renderPolls() }
          </ScrollView>
        </View>
      </Container>
    );
  }


_showPollDetails = async (poll) => {
    let {navigation} = this.props;

    navigation.navigate("ShowPollDetails",{
      poll: poll
    })
  }



  _renderPolls() {
        if (this.props.polls != null && this.props.polls != undefined && this.props.polls.length > 0) {
          
          return (
            this.props.polls.map( (pollItem,index) => {
                return(
                   <ListItem avatar key={index} onPress={()=> {                
                     this._showPollDetails(pollItem);
                     console.log("POLL ITEM WAS PRESSED: ", pollItem);
                   }}>

                      <Left>
                      <Thumbnail source={{uri: pollItem.cover_url}}   style={styles._h_w_avatar} />
                      </Left>

                      <Body>
                        <Text numberOfLines={1} style={styles._h_w_names}>{pollItem.title}</Text>
                      </Body>
                      <Right>
                        
                      </Right>
                  </ListItem>
                );
            })
          );
        } else {
          const height =
            Dimensions.get("window").height / 3
            if(this.props.loadingPolls){
              return (
                <View style={{ flex: 1, alignItems: "center", marginTop: height }}>
                  <ActivityIndicator size="large"/>
                </View>
              );
            }else if(this.props.pollsEmpty){
              return (
              <Text style={{color:'orange',fontSize:16,fontWeight:'bold',textAlign:'center',paddingHorizontal:12, marginTop:screenObject.height/3}}>
                      Aucune carte de visite!
                    </Text>
              )
            }
        }
    }




  

  


 


  

  

  _renderItem ({item, index}) {
      return (
          <View style={styles.slide}>
              <Text style={styles.title}>{ item.title }</Text>
          </View>
      );
  }


  


}

const Divider = (props) => (
  <View style={{flexDirection:'row' ,width:'20%', alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
    <View style={{backgroundColor:'rgba(26,35,126,0.8)',marginVertical:8,height:1, width:'70%'}}/>
  </View>
)

const styles = StyleSheet.create({
  lineHeight: {
    height: 21
  },
  fab: {
    backgroundColor: ThemeColors.secondary
  },main: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 25
  },
  iconGroup: {
    flexDirection: "row",
    justifyContent:'space-between',
    paddingHorizontal: 16
  },
  newsItemLinkContainer:{
    flexDirection:'row',
    paddingVertical:5,
    alignSelf:'center',
    marginVertical:8
  },
  newsItemLinkText:{
    color:'#2196F3',
    fontSize:16,
    paddingVertical:5,
    paddingHorizontal:8,
    flexDirection:'row',
    borderRadius:1,
    borderColor:'#1A237E',
    borderWidth:0.5,
    margin:6
  },
  headerView:{
    elevation:8,
    backgroundColor: "#00695c",
    height: Platform.select({
        "ios":44,
        "android":56
    })
  },
  searchInput:{ 
    flex: 1,
    fontSize: 18, 
    color: "white"
  },
  titleContainer:{
    color:'white',
    fontFamily:'candara',
    fontSize:18,
    textAlignVertical:'center'
  },
  mt20: {
    marginTop: 20
  },
  subtitlesIndicator: {
    color: "#fff",
    fontSize: 17,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: "center",
    borderRadius: 4,
    backgroundColor: "rgba(255,00,00,0.60)",
    borderColor: "rgb(255,00,00)",
    borderWidth: 1
  },
  searchHistoryItemText: {
    color: "rgb(100,100,60)",
    fontSize: 18
  },
  subtitles: {
    color: "#000",
    fontSize: 17,
    marginHorizontal: 10
  },
  titles: {
    color: "#000",
    fontSize: 22,
    fontStyle: "italic",
    marginVertical: 10,
    marginHorizontal: 10,
    textAlign: "center"
  },
  newsItem: {
    flexDirection: "column",
    paddingHorizontal: 5,
    marginHorizontal: 4
  },
  newsItemContent: {
    flexDirection: "column",
    marginHorizontal: 3
  },
  newsItemContentTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  newsItemContentDescription: {
    color: "#000",
    fontStyle: "italic",
    fontSize: 18,
    textAlign: "justify"
  },
  pharmacyItem: {
    flexDirection: "row",
    paddingHorizontal: 10
  },
  pharmacyItemIcon: {
    width: 68,
    height: 68,
    marginHorizontal: 15
  },
  pharmacyItemTitle: {
    color: "#000",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 18
  },
  divider: {
    alignSelf: "center",
    width: "30%",
    marginVertical: 16,
    backgroundColor: "#000",
    height: 1
  },
  dividerSmall: {
    alignSelf: "center",
    width: "15%",
    backgroundColor: "#3F51B5",
    height: 1
  }
});