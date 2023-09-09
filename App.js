import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';
import { theme } from './src/core/theme';
import { StyleSheet, Text, View } from 'react-native';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  StatisticsScreen,
  SettingsScreen,
} from './src/screens'

const Stack = createStackNavigator();

const db = SQLite.openDatabase('test7.db');

export default function App() {

  // Creating the users table
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (' +
      'email TEXT PRIMARY KEY, ' +
      'balance DECIMAL, ' +
      'income DECIMAL, ' +
      'expenses DECIMAL, ' +
      'password TEXT, ' +
      'name TEXT, ' +
      'date DATETIME, ' +
      'image TEXT' +
      ');'
    );
  });

  // Creating the transactions table
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS transactions (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'user_email TEXT, ' +
      'transaction_name TEXT, ' +
      'category_name TEXT, ' +
      'date DATETIME, ' +
      'category INTEGER, ' +
      'amount DECIMAL, ' +
      'FOREIGN KEY (user_email) REFERENCES users(email)' +
      ');'
    );
  });

  // Creating the goals table
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS goals (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'user_email TEXT, ' +
      'goal_name TEXT, ' +
      'saved_amount DECIMAL, ' +
      'target_amount DECIMAL, ' +
      'FOREIGN KEY (user_email) REFERENCES users(email)' +
      ');'
    );
  });

  // Creating the budgets table
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS budgets (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'user_email TEXT, ' +
      'category_name Text, ' +
      'category DECIMAL, ' +
      'saved_amount DECIMAL, ' +
      'budget_amount DECIMAL, ' +
      'FOREIGN KEY (user_email) REFERENCES users(email)' +
      ');'
    );
  });

  // db.transaction(tx => {
  //   tx.executeSql('PRAGMA table_info("users");', [], (_, { rows }) => {
  //     // Store the query result in state
  //     console.log(rows); 
  //   });
  // });

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
