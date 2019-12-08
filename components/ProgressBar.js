
import React from 'react';
import { Modal, View, Text, ActivityIndicator, Button } from 'react-native';

export default class ProgressDialog{
    static show() {
        return (
          <CustomProgressBar visible={true} />
        );
    }

    static hide() {
        return (
          <CustomProgressBar visible={false} />
        );
    }
}

const CustomProgressBar = ({ visible }) => (
    <Modal onRequestClose={() => null} visible={this.props.visible}>
      <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
          <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      </View>
    </Modal>
);