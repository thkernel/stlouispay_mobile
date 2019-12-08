import React, { Component } from 'react'

import { View, Text, ImageBackground, StatusBar, TouchableOpacity, StyleSheet } from 'react-native'
import constants from '../../utils/constants';

import LinearGradient from 'react-native-linear-gradient';

import { Separator } from 'react-native-btr';

import Icon from 'react-native-vector-icons/Ionicons' 

export default class About extends Component {
    
    constructor(props){
        super(props)
        this.state = {  }
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <StatusBar hidden={true} />                
                    <LinearGradient start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 2.0}} locations={[0,0.5,0.6]} colors={['rgba(40,105,92,0.88)', 'rgba(40,53,147,0.88)', 'rgba(255,45,92,1)']} style={{flex:0.45,alignItems:'center', backgroundColor:constants.colors.toolBar}}>
                        <TouchableOpacity style={styles.fab} onPress={()=>this._navigate("Profile")}>
                            <Icon name={"ios-arrow-round-back"} size={30} color="#fff" />
                        </TouchableOpacity>
                        <ImageBackground style={{flex:0.5,alignItems:'center', justifyContent:'center'}}>
                            <View style={{flex:1,color:'#000', justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', marginTop:'50%', textAlign:'center',fontSize:30, fontFamily:'candara'}}>
                                    A propos de
                                </Text>
                                <Text style={{color:'#fff', marginTop:2, textAlign:'center',fontSize:30, fontFamily:'candara'}}>
                                    KoSanté+
                                </Text>
                            </View>

                        </ImageBackground>
                    </LinearGradient>

                    <ImageBackground style={{flex:0.55,alignItems:'center', backgroundColor:'#F2F2F2'}}>
                        <View style={{color:'#000', minHeight:270, marginTop:-35,fontSize:25, fontFamily:'candara', width:'92%', paddingHorizontal:5, backgroundColor:'#fff', borderRadius:1, elevation:4}}>
                            <Text style={{color:'#000', marginTop:10, textAlign:'center',fontSize:20, fontFamily:'candara'}}>
                                v {constants.app.version}
                            </Text>

                            <Text style={{color:'#000', marginTop:2, textAlign:'center',fontSize:22, fontFamily:'candara'}}>
                                {constants.app.poweredBy}
                            </Text>

                            <Divider/>

                            <Text style={{color:'#000',textDecorationLine:'underline', marginTop:10, textAlign:'center',fontSize:18, fontFamily:'candara'}}>
                                DEVELOPPEURS DU PROJET
                            </Text>
                            {
                                constants.app.developers.map((developer,index)=>(
                                    <Text key={`key-developer-${index}`} style={{color:'#000', marginTop:10, textAlign:'center',fontSize:18, fontFamily:'candara'}}>
                                        {developer.fullName}
                                    </Text>
                                ))
                            }

                            <TouchableOpacity style={styles.cardFooter}>
                                <Text style={{color:'#3b5998', paddingVertical:8, textAlign:'center',fontSize:20, fontFamily:'candara'}}>
                                    Confidentialité
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                
                    <View style={styles.footer}>
                        <Text style={styles.footerContentText}>
                            &copy; 2019 KoSanté+ - Santé pour tous
                        </Text>

                        <TouchableOpacity style={styles.footerFab} onPress={()=>{this._shareApplication()}}>
                            <Icon  name='md-share' size={24} color='#fff'/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    _navigate = async (route,params={})=>{
        let {navigation} = this.props;

        navigation.navigate(route,params)
    }

    _shareApplication = async ()=>{
        
    }
}

const Divider = (props) => (
    <View style={{flexDirection:'row' ,width:'20%', alignSelf:'center', alignItems:'center', justifyContent:'center'}}>
        <View style={{backgroundColor:'rgba(26,35,126,0.8)',marginVertical:8,height:1, width:'40%'}}/>
        <Icon name={"ios-ribbon"} size={24} color={props.color?props.color:'rgba(26,35,126,0.8)'}/>
        <View style={{backgroundColor:'rgba(26,35,126,0.8)',marginVertical:8,height:1, width:'40%'}}/>
    </View>
)



const styles = StyleSheet.create({
    verticalDivider:{
        backgroundColor:'white',
        width:'20%',
        position:'absolute',
        top:-5,
        left:'36%',
        height:0.5
    },
    cardFooter:{
        marginTop:20,
        borderRadius:4,
        borderColor:'#3b5998',
        borderWidth: 0.5,
        marginHorizontal: 40,
    },
    fab:{
        width:50,
        height:50,
        top:15,
        left:15,
        borderRadius:25,
        backgroundColor:'rgba(40,105,92,1)',
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    footerFab:{
        width:50,
        height:50,
        bottom:40,
        right:25,
        borderRadius:25,
        backgroundColor:constants.colors.blue.share,
        position: 'absolute',
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 8
    },
    horizontalDivider:{
        backgroundColor:'white',
        width:0.5,
        position:'absolute',
        bottom:-40,
        left:'46%',
        justifyContent:'center',
        height:'20%'
    },
    footerContentText:{
        position:'absolute',
        bottom:20,
        alignSelf: 'center',
        color:'#000',
        marginTop:10, 
        textAlign:'center',
        fontSize:18, 
        fontFamily:'candara'
    }
})