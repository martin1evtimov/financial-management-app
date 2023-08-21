import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Icon from '../components/Icon'

export default function BottomMenu(props) {
    return (
      <View style={styles.bottomIconsContainer}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Dashboard')}>
          <Icon name="ios-home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('StatisticsScreen')}>
          <Icon name="ios-search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('SettingsScreen')}>
          <Icon name="ios-settings" size={24} color="black" />
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
      },
});