import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function Transactions(props) {
    const iconArray = [
        <View style={{backgroundColor: '#FCE5CD', borderRadius: 100, width: 45, height: 45, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="cart" size={30} color="black" />
        </View>,
        <View style={{backgroundColor: '#BBE279', borderRadius: 100, width: 45, height: 45, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="airplane" size={30} color="black" />
        </View>,
        <View style={{backgroundColor: '#8DD3C7', borderRadius: 100, width: 45, height: 45, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="car" size={30} color="black" />
        </View>,
        <View style={{backgroundColor: '#FDB462', borderRadius: 100, width: 45, height: 45, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="restaurant" size={30} color="black" />
        </View>,
        // Add more icons?
    ];

    return (
        <View style={{flex: 0.8, width: '100%'}}>
            <View style={{flexDirection: 'row',}}>
                {iconArray[0]}

                <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                    <View>
                        <Text>Train</Text>
                        <Text>Transporation</Text>
                    </View>
                    <View>
                        <Text>- $20</Text>
                        <Text>01.09.2023</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}