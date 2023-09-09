import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from 'react-native-progress/Bar';
import { theme } from '../core/theme';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');


export default function Goals(props) {
    const userId = 'martin3@gmail.com'; //TO DO REMOVE THIS! THIS IS TEMP!
    const [components, setComponents] = useState([]);

    //use the useEffect hook to load budget data once when the component is mounted
    useEffect(() => {
        //Getting budget if there are any for this a user
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM goals where user_email = ?;', [userId], (_, { rows }) => {
              // Store the query result in state
              rows._array.map((goal) =>  {
                console.log(JSON.stringify(goal))
                handleAddComponent(goal.id, goal.goal_name, goal.saved_amount, goal.target_amount)
              });
            });
          });
    }, []);

    const handleGoalTitlePrompt = () => {
        Alert.prompt(
            'What is your goal?',
            'Enter the title:',
            (text) => {
              if (text !== null) {
                handleAmountPrompt(text);
              }
            }
        );
    };

    const handleAmountPrompt = (goalTitle) => {
        Alert.prompt(
            'Enter Amount',
            'Enter the amount:',
            (number) => {
              if (number !== null) {
                const amount = parseFloat(number);
                handleData(goalTitle, amount);
              }
            }
        );
    };
    
    const handleData = (goalTitle, amount) => {
        const currentBalance = 0; //if we are here it means that it's a new added goal. Initialize currentBalance for the new component

        // Generate a unique key for the new component
        const newComponentKey = new Date().getTime().toString();
        
        handleAddComponent(newComponentKey, goalTitle, amount, currentBalance);

        db.transaction((tx) => {
            tx.executeSql(
            'insert into goals (id, user_email, goal_name, saved_amount, target_amount) values (?, ?, ?, ?, ?)',
            [newComponentKey, userId, goalTitle, currentBalance, amount],
            (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                console.log(`Goal for user - ${userId} successfully inserted`);
                } else {
                console.log(`Goal for user - ${userId} was not successfully inserted`);
                }
            },
            (error) => {
                console.error('Error updating Goal:', error);
            }
            );
        });
    };

    const handleAddComponent = (newComponentKey, goalTitle, amount, saved_amount) => {
        // Create a new component object with its own state
        const newGoalComponent = {
            key: newComponentKey,
            title: goalTitle,
            goal: amount,
            currentBalance: saved_amount, // Initialize currentBalance for the new component
        };

        // Update the state to include the new component
        setComponents(prevComponents => [...prevComponents, newGoalComponent]);
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
                    let updateBalance = component.currentBalance + parseFloat(amount);

                    db.transaction((tx) => {
                        tx.executeSql(
                            'update goals set saved_amount = ? where id = ?',
                            [updateBalance, component.key],
                            (_, { rowsAffected }) => {
                                if (rowsAffected > 0) {
                                console.log(`Goal for user - ${userId} successfully updated`);
                                } else {
                                console.log(`Goal for user - ${userId} was not successfully updated`);
                                }
                            },
                            (error) => {
                                console.error('Error updating goal:', error);
                            }
                        );
                    });

                    return {
                      ...component,
                      currentBalance: updateBalance,
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
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>Set a new goal</Text>
                    <Text style={{fontSize: 12}}>Reach more goals</Text>
                </View>
                <TouchableOpacity onPress={handleGoalTitlePrompt} style={styles.button}>
                    <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
            </View> 
            <ScrollView style={{width: '100%', marginTop: '10%'}}>
                <Text style={{fontSize: 16}}>Active goals</Text>
                <View style={{flex: 1, width: '100%', alignItems: 'center'}}> 
                    {components.map((component) => (
                            <TouchableOpacity
                                key={component.key}
                                onPress={() => updateComponentBalance(component.key)}
                                style={{justifyContent: 'center'}}
                            >
                                <View style={styles.dynamicComponent}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{component.title}</Text>
                                            <Text>{(component.currentBalance / component.goal) * 100}%</Text>
                                        </View>
                                        <View style={{marginTop: 5}}>
                                            <Text>${component.currentBalance}/${component.goal}</Text>
                                            <ProgressBar progress={component.currentBalance / component.goal} size={20} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    ))}
                </View>
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