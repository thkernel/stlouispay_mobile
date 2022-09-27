import React from "react";
import { StyleSheet } from "react-native";
import { ScrollableTab, Text, Tab, Tabs, Icon, TabHeading } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import Polls from "./Polls";
import Opinions from "./Opinions";
import CompletedPolls from "./CompletedPolls";
//import Calls from "./Calls";
import ThemeColors from "../constants/ThemeColors";
import RequestHandler from "../utils/RequestHandler";



export default class MyTabs extends React.Component {
  state = {
    polls: null,
    votes: null,
    pollOpinions: null,
    completedPolls: null,
    loadingPolls: true,
    pollsEmpty: true,


    
  };

  render() {
    return (
      <Tabs
        initialPage={0}
        renderTabBar={() => (
          <ScrollableTab style={{ backgroundColor: ThemeColors.primary }} />
        )}
      >
        
        <Tab
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.tabStyle}
          textStyle={styles.tabText}
          activeTextStyle={styles.activeTabText}
          heading="cartes recentes"
        >
          <Polls polls={this.state.polls} pollsEmpty={this.state.pollsEmpty} loadingPolls={this.state.loadingPolls} navigation={this.props.navigation} />
        </Tab>
        <Tab
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.tabStyle}
          textStyle={styles.tabText}
          activeTextStyle={styles.activeTabText}
          heading="mes organisations"
        >

        <Opinions pollOpinions={this.state.pollOpinions} pollOpinionsEmpty={this.state.pollOpinionsEmpty} loadingPollOpinions={this.state.loadingPollOpinions} navigation={this.props.navigation} />
          
        </Tab>
        <Tab
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.tabStyle}
          textStyle={styles.tabText}
          activeTextStyle={styles.activeTabText}
          heading="scanner"
        >
           <CompletedPolls completedPolls={this.state.completedPolls} completedPollsEmpty={this.state.completedPollsEmpty} loadingCompletedPolls={this.state.loadingCompletedPolls} navigation={this.props.navigation} />
        </Tab>
      </Tabs>
    );
  }

  
  

  
  
  componentWillMount = async () => {

    //let polls = await AsyncStorage.getItem("@polls");

    /*
    if (polls != null){
    
      await this.getPollsFromAsyncStorage();
    }else{
      await this.fetchPolls();
    }

    */

    await this.fetchPolls();
    await this.fetchCompletedPolls();
    await this.fetchPollOpinions();
  }


  fetchPolls = async (response) => {
    RequestHandler.getActivePolls(
      this.getPollsSuccess,
      this.getPollsFailure
    );


  }

  getPollsSuccess = response => {
    console.log("GET ACTIVE POLLS SUCCESS: ", response);

    if (response.status !== "empty"){
      this.setState({
        polls: response,
        loadingPolls:false,
        pollsEmpty: false,
      });

      console.log("FETCH DATA: ", response);
      //this.savePollsOnAsyncStorage();
    
    }else{
      this.setState({
        loadingPolls:false,
        pollsEmpty: true,
      });
    }


  }

  getPollsFailure = error => {
    this.setState({
      loadingPollsFailed: error+"",
      polls: null,
      loadingPolls:false,
      pollsEmpty: true,
    });

        console.log("FETCH DATA: ", error);

  }

  fetchCompletedPolls = async (response) => {
    RequestHandler.getCompletedPolls(
      this.getCompletedPollsSuccess,
      this.getCompletedPollsFailure
    );


  }

  getCompletedPollsSuccess = response => {

    if (response.status !== "empty"){
      this.setState({
        completedPolls: response,
        loadingCompletedPolls:false,
        completedPollsEmpty: false,


      });

      console.log("FETCH COMPLETED POLLS: ", response);
      //this.savePollsOnAsyncStorage();
    }else{
      this.setState({
        loadingCompletedPolls:false,
        completedPollsEmpty: true,
      });
    }
  }

  getCompletedPollsFailure = error => {
    this.setState({
      loadingCompletedPollsFailed: error+"",
      loadingCompletedPolls:false
    });

        console.log("FETCH COMPLETED POLLS: ", error);

  }


  fetchPollOpinions = async (response) => {
     

    console.log("CALLING FETCH POLL OPINIONS");
    
    RequestHandler.getPollOpinions(
      this.getPollOpinionsSuccess,
      this.getPollOpinionsFailed
    );

  }

  getPollOpinionsSuccess = response => {
        if (response.status !== "empty"){

          this.setState({
            loadingPollOpinions: false,
            pollOpinionsEmpty: false,
            pollOpinions: response
          });

          console.log("DEBUT DE RESPONSE de MY OPINIONS: ", response.status);
              console.log("POLL OPINIONS: ", response);
        }else{

          this.setState({
            loadingPollOpinions: false,
            pollOpinionsEmpty: true,
            
          });

        }

    
    
  };

  getPollOpinionsFailed = error => {
    this.setState({
      loadingPollOpinions: false
    });

    console.log("POLL OPINIONS ERROR: ", error);
        
  };





  fetchOpinions = async (response) => {
     let user_token = await AsyncStorage.getItem("@userInfos");

    console.log("PROPS USER TOKEN:", user_token);
    loadingMyOpinions=true;
    await this.setState({
      loadingMyOpinions
    })
    RequestHandler.myOpinions(
      user_token,
      this.myOpinionSuccess,
      this.myOpinionFailed
    );

  }

  myOpinionSuccess = response => {
    this.setState({
      loadingMyOpinions: false,
      opinions: response.comments
    });

    console.log("DEBUT DE RESPONSE de MY OPINIONS: ", response.status);
        console.log("DONNEES RECUS: ", response);

    
    if (response.status === "ok") {
      

  
    }
  };

  myOpinionFailed = error => {
    this.setState({
      loadingMyOpinions: false
    });
        
  };

  handleRequestErrors(error){
    loadingMyOpinions=false;
    this.setState({
      loadingMyOpinions,
      loadingHWErrors:error,
    })
  }


   savePollsOnAsyncStorage= async () => {
    let polls = this.state.polls;
    if (polls != null && polls != undefined){
      await AsyncStorage.setItem("@polls", JSON.stringify(polls));
    }

    
  }

  getPollsFromAsyncStorage = async () => {
        let data = await AsyncStorage.getItem("@polls");
        this.setState({
          polls: JSON.parse(data),
          loadingPollItems: false
        })

        console.log("GET POLLS FROM STORAGE: ", this.state.polls);

  }








}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: ThemeColors.primary
  },
  tabText: {
    textTransform: "uppercase",
    color: "lightgrey"
  },
  activeTabText: {
    textTransform: "uppercase",
    color: "white"
  }
});