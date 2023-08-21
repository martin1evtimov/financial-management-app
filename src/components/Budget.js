import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';
import { theme } from '../core/theme';


export default function Budget(props) {
    const iconArray = [
        <Ionicons name="cart" size={30} color="black" />,
        <Ionicons name="airplane" size={30} color="black" />,
        <Ionicons name="car" size={30} color="black" />,
        <Ionicons name="restaurant" size={30} color="black" />,
        // Add more icons?
      ];

    const handleCategoryPrompt = () => {
        Alert.alert(
            'Choose Category',
            'Choose an option from the list:',
            [
                { text: 'Groceries', onPress: () => handleAmountPrompt('Groceries', 0) },
                { text: 'Travel', onPress: () => handleAmountPrompt('Travel', 1) },
                { text: 'Transportation', onPress: () => handleAmountPrompt('Transportation', 2) },
                { text: 'Restaurants and bars', onPress: () => handleAmountPrompt('Restaurants and bars', 3) },
                // Add more options
                { text: 'Cancel', style: 'cancel' },
            ],
        );
    };

    const handleAmountPrompt = (categoryName, category) => {
        Alert.prompt(
            'Enter Amount',
            'Enter the amount:',
            (number) => {
              if (number !== null) {
                const amount = parseFloat(number);
                handleData(categoryName, category, amount);
              }
            }
        );
    };
    
    const handleData = (categoryName, amount, category) => {
        handleAddComponent(categoryName, amount, category);
        console.log('Amount:', amount);
        console.log('Category', category);
    };

    const [components, setComponents] = useState([]);

    const handleAddComponent = (categoryName, category, amount) => {
        // Generate a unique key for the new component
        const newComponentKey = new Date().getTime().toString();

        // Create a new component object with its own state
        const newBudgetComponent = {
            key: newComponentKey,
            categoryName: categoryName,
            category: category,
            goal: amount,
            currentBalance: 0, // Initialize currentBalance for the new component
        };

        // Update the state to include the new component
        setComponents(prevComponents => [...prevComponents, newBudgetComponent]);
    };

    const updateComponentBalance = (componentKey, amount) => {
        Alert.prompt(
            'Enter Amount',
            'Enter the amount:',
            (amount) => {
              if (amount !== null) {
                setComponents((prevComponents) =>
                prevComponents.map((component) => {
                  if (component.key === componentKey) {
                    return {
                      ...component,
                      currentBalance: component.currentBalance + parseFloat(amount),
                    };
                  }
                  return component;
                })
              );
              }
            }
        );
    };

    return (
        <View style={styles.main}>
            <View style={styles.addPanel}>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>Create a budget</Text>
                    <Text style={{fontSize: 12}}>Save more by setting a budget</Text>
                </View>
                <TouchableOpacity onPress={handleCategoryPrompt} style={styles.button}>
                    <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
            </View> 
            <ScrollView style={{width: '100%', marginTop: '10%'}}>
                <Text style={{fontSize: 16}}>My Budgets</Text>
                {components.map((component) => (
                    <TouchableOpacity
                        key={component.key}
                        onPress={() => updateComponentBalance(component.key)}
                    >
                        <View style={styles.dynamicComponent}>
                            <View style={{ flexDirection: 'row' }}>
                                {iconArray[component.category]}
                                <View>
                                    <Text>{component.categoryName}</Text>
                                    <ProgressBar progress={component.currentBalance / component.goal} size={20} />
                                </View>
                            </View>
                            <View>
                                <Text>${component.currentBalance}/${component.goal}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>  
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 0.8, 
        width: '100%', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    addPanel: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%', 
        marginTop: '5%',
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    plusSign: {
        fontSize: 24,
        color: 'white',
    },
    dynamicComponent: {
        padding: 10,
        marginVertical: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
});