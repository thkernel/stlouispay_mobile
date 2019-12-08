import React from 'react';

import { Animated, ScrollView, Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, PanResponder } from 'react-native';

export default class AwesomeCarousel extends React.Component {
    
    constructor(props) {
        super(props);

        let {width} = Dimensions.get("window");

        this.state = { 
            width:width,
            page:0,
            translate: new Animated.Value(0)
        }
    }

    render=()=>{
        let {data} = this.props;
        let styles =  this.getStyles();
        return (
            <Animated.View {...this.panResponder.panHandlers} style={styles.slider}>
                {this.renderItem(data[data.length-1],-1)}
                {data.map(this.renderItem.bind(this))}
                {this.renderItem(this.props.data[0],data.length)}
            </Animated.View>
        )
    }

    renderItem = (item,index)=>{
        let styles =  this.getStyles();
        return (
            <View key={"imag-link-"+index} style={styles.slide}>
                <Image source={item.screen} style={styles.screen}/>
                <Animated.Image source={item.poster} style={[styles.poster, this.posterTranslate(index)]}/>
                <Animated.Text  style={[styles.title, this.posterTranslate(index)]}>{item.name}</Animated.Text>
            </View>
        )
    }

    posterTranslate = (index)=>{
        let factor=2
        if(index === this.state.page){
            return this.translateX(Animated.divide(this.state.translate, factor))
        }

        if(index === this.state.page + 1){
            return this.translateX(
                Animated.add(this.state.translate, this.state.width),factor
            )
        }

        if(index === this.state.page - 1){
            return this.translateX(
                Animated.add(this.state.translate,this.state.width*-1),factor
            )
        }
    }

    translateX(anim){
        return {
            transform:[{
                translateX:anim
            }]
        }
    }

    componentDidMount(){
        //alert(this.props.data)
    }

    componentWillMount(){
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder:(event,gestureState)=>false,
            onStartShouldSetPanResponderCapture:(event,gestureState)=>false,
            onMoveShouldSetPanResponder:(event,gestureState)=> Math.abs(gestureState.dx)>7,
            onMoveShouldSetPanResponderCapture:(event,gestureState)=> true,
            onPanResponderTerminationRequest:()=> false,
            onPanResponderMove: Animated.event([null,{dx:this.state.translate}]),
            onPanResponderRelease:this.endGesture.bind(this),
            onPanResponderTerminate:(event,gestureState)=> {
                console.log("terminate")
            },
            onShouldBlockNativeResponder:(event,gestureState)=> true
        })
    }

    endGesture = (event,gestureState)=>{
        let toValue=0; 
        if(Math.abs(gestureState.dx)/this.state.width>0.2){
            if(gestureState.dx<0){
                toValue = this.state.width*-1
            }else{
                toValue = this.state.width
            }
        }


        Animated.timing(
            this.state.translate,{
                duration:390,
                backgroundColor: "#1B1B1B",
                toValue:toValue,
                useNativeDriver:true
            }
        ).start(()=>{
            this.state.translate.setValue(0);
            if(toValue<0){
                this.nextPage()
            }else if(toValue>0){
                this.prevPage()
            }
        });
    }

    nextPage  = () =>{
        let page =this.state.page+1
        if(page>=this.props.data.length){
            page=0
        }
        this.setState({page})
    }

    prevPage  = () =>{
        let page =this.state.page-1
        if(page<0){
            page=this.props.data.length - 1
        }
        this.setState({page})
    }

    getStyles = () =>{
        return {
            slide:{
                width:this.state.width,
                height:390,
                position: 'relative',
            },
            poster:{
                position: 'absolute',
                top:150,
                height:150,
                width:75,
                transform:[{
                    translateX:this.state.translate
                }]
            },
            screen:{
                width:this.state.width,
                height:300
            },
            title:{
                color:'#000',
                fontSize: 18,
                top:20,
                left:200
            },
            slider:{
                flexDirection: 'row',
                height:300,
                left:(this.state.page+1)*-1*this.state.width,
                width:(this.props.data.length+2)*this.state.width,
                transform:[{
                    translateX:this.state.translate
                }]
            }
        }
    }
}