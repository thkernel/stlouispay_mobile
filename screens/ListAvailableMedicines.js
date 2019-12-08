
import React from 'react'
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    Platform,
    TextInput
} from 'react-native'

import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from '@react-native-community/async-storage';

import Icon from "react-native-vector-icons/FontAwesome5";

import RequestHandler from "../utils/RequestHandler";

import contants from "../utils/constants";

import { List,Thumbnail, ListItem, Left, Right, Body } from "native-base";

import Snackbar from 'react-native-snackbar';

export default class ListAvailableMedicines extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            medicines:null,
            loadingMedicines:true,
            loadingMedicinesError:"",
            request:''
        }
    }

    render(){
        return (
            <View> 
                <StatusBar backgroundColor="#003d33" hidden={false} />
                <View style={styles.headerView}>
                    <View style={styles.iconGroup}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={()=>{this.goBack()}}>
                        <Icon
                            name="arrow-left" size={16} color={"#fff"} style={{ marginTop: 10}}
                        />
                        </TouchableOpacity>
                        <TextInput
                            ref= {(input)=>{ 
                                this.searchInput = input
                                }
                            }
                            underlineColorAndroid="transparent"
                            placeholderTextColor="white"
                            placeholder="Rechercher un médicament"
                            style={styles.searchInput}
                            value={this.state.request}
                            onChangeText={this._updateSearch}
                        />
                    </View>
                </View>

                <ScrollView>
                    <List style={{
                        marginBottom:60 //Accordingly to bottom nav 56
                    }}>
                        {this.renderAvailableMedicines()}
                    </List>
                </ScrollView>
            </View>
            
        )
    }

    renderAvailableMedicines = ()=>{
        let self = this;
        if(this.state.medicines !==null){
            let medicinesViews = [];

            let {medicines}=this.state;
            medicines.forEach (function(medicine,index){
                medicinesViews.push(
                    <ListItem avatar key={index} onPress={()=>{
                        self._updateRequestMedicine(medicine);
                    }}>
                        <Left>
                            <Thumbnail source={require("../assets/mix-kosante.png")} style={{width:60,height:60,borderRadius:30}}/>
                        </Left>

                        <Body>
                            <Text style={styles.medicineNameStyle} accessibilityLabel="Nom de la pharmacie">
                                {medicine.fullname}
                            </Text>

                            <Text style={styles.matchesStyles}>
                                Disponible dans {(medicine.countable>1? medicine.countable+" pharmacies":medicine.countable+" pharmacie")}
                            </Text>
                        </Body>
                    </ListItem>
                );
            });

            return medicinesViews;
        }else{
            if(self.state.loadingMedicines){
                const height = (Dimensions.get("window").height)/3
                return (
                    <View style={{flex:1,alignItems: "center", justifyContent:'center',marginTop:height }}>
                    <ActivityIndicator size='large'/>
                </View>
                )
            }else{
                const height = (Dimensions.get("screen").height)/3
                return (
                    <View style={{ flex:1, alignItems:'center', marginTop:height }}>
                        <Text style={{ textAlign: "center", color: "red", fontSize: 18 }}>
                        {this.state.loadingMedicinesError?this.state.loadingMedicinesError:'Aucun médicament trouvé'}
                        </Text>
                    </View>
                )
            }
        }
    }

    componentDidMount=()=>{
        this.searchInput.focus()
        this.fetchAvailableProducts()
    }

    _updateSearch = (request)=>{
        this.setState({request});
        this.searchMedicine(request);
    }

    _updateRequestMedicine = async (medicine)=>{
        this.searchMedicine(medicine)
    }

    goBack = ()=>{
        let {navigation} = this.props;
        navigation.navigate("Pharmacies");
    }

    fetchAvailableProducts=()=>{
        this.setState({loadingMedicines:true})
        RequestHandler.listAvailableProducts(
            this.fetchProductsSuccess,
            this.fetchProductsFailure,
        );
    }

    searchMedicine = (request)=>{
        this.setState({loadingMedicines:true})
        if(request.trim() !== ''){
            RequestHandler.requestProducts(
                request,
                this.fetchProductsSuccess,
                this.fetchProductsFailure
            );
        }else{
            RequestHandler.listAvailableProducts(
                this.fetchProductsSuccess,
                this.fetchProductsFailure,
            );
        }
    }

    fetchProductsSuccess=(response)=>{
        this.setState({
            medicines:response.data,
            loadingMedicines:false,
        })
    }

    fetchProductsFailure=(error)=>{
        this.setState({
            loadingMedicines:false,
            loadingMedicinesError:error
        })
    }
}

const styles = StyleSheet.create({
    headerView:{
        backgroundColor: "#00695c",
        height: Platform.select({
            "ios":44,
            "android":56
        })
    },
    iconGroup:{
        flexDirection: "row",
        paddingHorizontal: 12
    },
    toolbarTitle:{
        flex: 1,
        fontSize: 18,
        color:"#FFF",
        paddingHorizontal:8,
        marginTop:15
    },
    searchInput:{
        flex:1,
        flexDirection:'row',
        color: "#fff",
        fontSize: 18,
        marginTop:4,
        paddingHorizontal: 8
    },
    medicineNameStyle:{
        color:"#000"
    },
    matchesStyles:{
        color:"#000"
    }
})