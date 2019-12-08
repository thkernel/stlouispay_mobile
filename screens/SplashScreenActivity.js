import React from 'react'

import {Text, View, Image, StyleSheet, StatusBar, Dimensions} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import ProgressBarAnimated from 'react-native-progress-bar-animated';

export default class SplashScreenActivity extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userInfos:null,
            progressWithOnComplete:20,
            progressWidth: Dimensions.get('window').width-30
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#003d33" hidden={false} />

                <Image
                    source={require("../assets/mix-kosante.png")}
                    style={styles.splashScreenLogo}/>

                <Text style={styles.copyrightText}>
                    &copy; 2019 ♦ Ko-Santé+
                </Text>
                <Text style={styles.poweredByText}>
                    Powered by KOLANE Frédérick  
                </Text>

                <View style={styles.splashScreenContainer}>
                    <ProgressBarAnimated
                        width={this.state.progressWidth}
                        height={4}
                        value={this.state.progressWithOnComplete}
                        
                        onComplete={() => {
                            Alert.alert('Hey!', 'onComplete event fired!');
                        }}
                    />
                </View>
                
            </View>
        )
    }

    async componentDidMount(){
        
        let timeout = 100*Math.random();
        
        let userInfos = await AsyncStorage.getItem("@userInfos");
        this.setState({
            userInfos:userInfos
        })

        let animateId = ()=>{
            let {navigation} = this.props;
            try{
                if(this.state.userInfos!==null){
                    navigation.navigate("Home")
                }else{
                    navigation.navigate("Login")
                }
            }catch(error){
                navigation.navigate("Login")
            }
        };

        setTimeout(animateId, parseInt(timeout));

        clearTimeout(animateId);
    }

    async componentWillMount(){
        
    }
}


const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    copyrightText:{
        color:'#000',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
        marginTop: 15,
        paddingHorizontal: 22,
    },
    splashScreenLogo:{
        width: 200,
        height: 200
    },
    poweredByText:{
        fontStyle:'italic',
        color:'#3F51B5',
        fontSize:16
    },
    splashScreenContainer:{
        marginTop:18,
        paddingHorizontal: 50,
    }
});