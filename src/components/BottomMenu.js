import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from '../components/Icon';

export default function BottomMenu(props) {
  const user  = props.user;
  const size = 24;
  
  return (
    <View style={styles.bottomIconsContainer}>
      <TouchableOpacity onPress={() => props.navigation.navigate('Dashboard', { user: user})}>
        <Icon name="ios-home" size={size} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('StatisticsScreen', { user: user})}>
        <Icon name="ios-search" size={size} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('SettingsScreen', { user: user})}>
        <Icon name="ios-settings" size={size} color="black" />
      </TouchableOpacity>    
    </View>
  )
}

const styles = StyleSheet.create({
    bottomIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 30,
        position: 'absolute',
        bottom: 40,
    }
});