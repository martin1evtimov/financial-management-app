import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';
import { theme } from '../core/theme';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');


export default function Budget(props) {
    const user = props.user;
    const userId = user.eemail;
    const [components, setComponents] = useState([]);


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

    //use the useEffect hook to load budget data once when the component is mounted
    useEffect(() => {
        //Getting budget if there are any for this a user
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM budgets where user_email = ?;', [user.email], (_, { rows }) => {
              // Store the query result in state
              rows._array.map((budget) =>  {
                console.log(JSON.stringify(budget))
                handleAddComponent(budget.id, budget.category_name, budget.category, budget.budget_amount, budget.saved_amount)
              });
            });
          });
    }, []);

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
    
    const handleData = (categoryName, category, amount) => {
        const currentBalance = 0; //if we are here it means that it's a new added budget. Initialize currentBalance for the new component

        // Generate a unique key for the new component
        const newComponentKey = new Date().getTime().toString();

        handleAddComponent(newComponentKey, categoryName, category, amount, currentBalance);

        db.transaction((tx) => {
            tx.executeSql(
            'insert into budgets (id, user_email, category_name, category, saved_amount, budget_amount) values (?, ?, ?, ?, ?, ?)',
            [newComponentKey, userId, categoryName, category, currentBalance, amount],
            (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                console.log(`Budget for user - ${userId} successfully inserted`);
                } else {
                console.log(`Budget for user - ${userId} was not successfully inserted`);
                }
            },
            (error) => {
                console.error('Error updating budget:', error);
            }
            );
        });
    };

    const handleAddComponent = (newComponentKey, categoryName, category, amount, balance) => {
        // Create a new component object with its own state
        const newBudgetComponent = {
            key: newComponentKey,
            categoryName: categoryName,
            category: category,
            goal: amount,
            currentBalance: balance, 
        };

        // Update the state to include the new component
        setComponents(prevComponents => [...prevComponents, newBudgetComponent]);
    };

    const updateComponentBalance = (componentKey) => {
        Alert.prompt(
            'Enter Amount',
            'Enter the amount:',
            (amount) => {
              if (amount !== null) {
                setComponents((prevComponents) =>
                prevComponents.map((component) => {
                  if (component.key === componentKey) {
                    let updatedBalance = component.currentBalance + parseFloat(amount);

                    db.transaction((tx) => {
                        tx.executeSql(
                            'update budgets set saved_amount = ? where id = ?',
                            [updatedBalance, component.key],
                            (_, { rowsAffected }) => {
                                if (rowsAffected > 0) {
                                console.log(`Budget for user - ${userId} successfully updated`);
                                } else {
                                console.log(`Budget for user - ${userId} was not successfully updated`);
                                }
                            },
                            (error) => {
                                    console.error('Error updating budget:', error);
                            }
                        );
                    });

                    return {
                      ...component,
                      currentBalance: updatedBalance,
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
                <View style={styles.panelTextSection}>
                    <Text style={styles.textTitle}>Create a budget</Text>
                    <Text style={styles.supportingText}>Save more by setting a budget</Text>
                </View>
                <TouchableOpacity onPress={handleCategoryPrompt} style={styles.button}>
                    <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
            </View> 
            <ScrollView style={styles.activeBudgetsMain}>
                <Text style={styles.budgetTitle}>My Budgets</Text>
                {components.map((component) => (
                    <TouchableOpacity
                        key={component.key}
                        onPress={() => updateComponentBalance(component.key)}
                    >
                        <View style={styles.dynamicComponent}>
                            <View style={styles.dynamicComponentMain}>
                                <View style={styles.icon}>
                                    {iconArray[component.category]}
                                </View>
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
    panelTextSection: {
        justifyContent: 'center'
    },
    textTitle: {
        fontWeight: 'bold', 
        fontSize: 14
    },
    supportingText: {
        fontSize: 12
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
    activeBudgetsMain: {
        width: '100%',
        marginTop: '10%'
    },
    budgetTitle: {
        fontSize: 16
    },
    activeBudgetsPanel: {
        flex: 1, 
        width: '100%', 
        alignItems: 'center'
    },
    dynamicComponent: {
        padding: 10,
        marginVertical: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dynamicComponentMain: {
        flexDirection: 'row' 
    },
    icon: {
        marginRight: 5
    }
});