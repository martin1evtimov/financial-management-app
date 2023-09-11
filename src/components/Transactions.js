import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');

export default function Transactions(props) {
  const user = props.user;
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

  const [transactions, setTransactions] = useState([]);

  //use the useEffect hook to load transaction data once when the component is mounted
  useEffect(() => {
          //Getting transcations if there are any for this a user
          db.transaction(tx => {
              tx.executeSql('SELECT * FROM transactions where user_email = ?;', [user.email], (_, { rows }) => {
                  // Store the query result in state
                  setTransactions(rows._array)
              });
          });
  }, []);

  // Sort transactions by date in descending order
  const sortedTransactions = transactions.slice().sort((a, b) => {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
  
      // Sort in descending order
      return dateB - dateA;
  });

  return (
      <ScrollView style={styles.transactionMain}>
        {sortedTransactions.map((transaction, index) => (
          <View key={index} style={styles.transactionContainer}>
            <View style={{ marginRight: 10 }}>{iconArray[transaction.category]}</View> 
    
            <View style={styles.transactionDetails}>
              <View style={styles.transactionTextContainer}>
                <Text style={styles.transactionName}>{transaction.transaction_name}</Text>
                <Text style={styles.categoryName}>{transaction.category_name}</Text>
              </View>
              <View style={styles.amountAndDate}>
                <Text style={styles.amount}>- ${transaction.amount}</Text>
                <Text style={styles.date}>{transaction.date.substring(0, 10)}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
  );      
}

const styles = StyleSheet.create({
    transactionMain: { 
      flex: 0.8,
       width: '100%' 
    },
    transactionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    transactionDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
      marginTop: 10,
    },
    transactionTextContainer: {
      flex: 1,
    },
    transactionName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    categoryName: {
      fontSize: 14,
      color: 'gray',
    },
    amountAndDate: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'red', // Adjust the color as needed
    },
    date: {
      fontSize: 14,
      color: 'gray', // Adjust the color as needed
    },
});