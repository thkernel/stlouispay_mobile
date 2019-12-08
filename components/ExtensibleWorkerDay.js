import React from 'react'

import { TouchableOpacity, Text, } from 'react-native'

export default class ExtensibleWorkerDay extends Component {
    constructor(props){
        this.state = {
            extended:false,
            extendedComponent:null
        }
    }


    render() {
        return (
             <TouchableOpacity key={`availableDay-${index}`}  style={styles.availableDay}
                    onPress={()=>{this.props.onPress?this.props.onPress:{}}}>
                <Text style={{fontSize:16,fontWeight:'bold', fontStyle:'italic', paddingVertical:10, marginTop:0, alignSelf:'center', textAlign:'center', color:constants.colors.statusBar}}>
                    {this.props.content}
                </Text>
                {
                    this.state.extended?(
                        this.state.extendedComponent?(
                            this.state.extendedComponent
                        ):(
                            null 
                        )
                    ):(
                        null
                    )
                }
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    sideDivider:{
        backgroundColor:'#000',
        height:1,
        width:'90%',
        alignSelf:'center',
        paddingHorizontal:16,
        marginHorizontal: 10,
    },
    availableDay:{
        borderColor:constants.colors.statusBar,
        borderWidth:0.5,
        borderRadius:4,
        marginVertical:4,
        width:'90%',
        alignSelf:'center'
    },
    availabilityDetails:{
        color:constants.colors.toolBar,
        textAlign:'center',
        fontWeight:'bold',
        fontSize:18, 
        paddingVertical:12
    }
});