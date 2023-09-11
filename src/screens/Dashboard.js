import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Background from '../components/Background';
import Button from '../components/Button';
import BottomMenu from '../components/BottomMenu';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');

export default function Dashboard({ route, navigation }) {
  const user = route.params;
  const [balance, setBalance] = useState(user.balance);
  const [income, setIncome] = useState(user.income);
  const [expense, setExpense] = useState(user.expenses);
  const [transaction, setTransaction] = useState(0);
  const [goals, setGoals] = useState(0);
  const [budget, setBudget] = useState(0);

  //use the useEffect hook to load these data once when the component is mounted
  useEffect(() => {
    //Getting transcations if there are any for this a user
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM transactions where user_email = ?;', [user.email], (_, { rows }) => {
        // Store the query result in state
        setTransaction(rows.length)
      });
    });
  
    //Getting goals if there are any for this a user
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM goals where user_email = ?;', [user.email], (_, { rows }) => {
        // Store the query result in state
        setGoals(rows.length);
      });
    });
  
    //Getting budgets if there are any for this a user
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM budgets where user_email = ?;', [user.email], (_, { rows }) => {
        // Store the query result in state
        setBudget(rows.length);
      });
    });
  }, []); 

  const updateUserIncome = (userId, income, balance) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users SET income = ?, balance = ? WHERE email = ?',
        [income, balance, userId],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`User with email ${userId} updated successfully income`);
          } else {
            console.log(`No user found with email ${userId}`);
          }
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    });
  };
  
  const updateUserExpense = (userId, expense, balance) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users SET expenses = ?, balance = ? WHERE email = ?',
        [expense, balance, userId],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`User with email ${userId} updated successfully expenses`);
          } else {
            console.log(`No user found with email ${userId}`);
          }
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    });
  };
  
  const insertTransaction = (userId, transaction_name, categoryName, category, amount) => {
    const date = new Date();
    const isoDate = date.toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        'insert into transactions (user_email, transaction_name, category_name, date, category, amount) values (?, ?, ?, ?, ?, ?)',
        [userId, transaction_name, categoryName, isoDate, category, amount],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Transaction for user - ${userId} successfully inserted`);
          } else {
            console.log(`Transaction for user - ${userId} was not successfully inserted`);
          }
        },
        (error) => {
          console.error('Error updating transaction:', error);
        }
      );
    });
  };

  const handleAddIncome = () => {
    Alert.prompt('Add Income', 'Enter the amount:', (amount) => {
      if (amount && !isNaN(amount)) {
        const newIncome = parseFloat(amount);
        setIncome((prevIncome) => prevIncome + newIncome);
        setBalance((prevBalance) => prevBalance + newIncome);
      }
    });
  };

  useEffect(() => {
    // This code will execute when income or balance changes
    updateUserIncome(user.email, income, balance);
  }, [income]);

  useEffect(() => {
    // This code will execute when income or balance changes
    updateUserExpense(user.email, expense, balance);
  }, [expense]);

  const handleAddExpense = (transaction_name, categoryName, category) => {
    Alert.prompt('Add Expense', 'Enter the amount:', (amount) => {
      if (amount && !isNaN(amount)) {
        const newExpense = parseFloat(amount);
        setExpense((prevExpense) => prevExpense + newExpense);
        setBalance((prevBalance) => prevBalance - newExpense);
        setTransaction((prevTransaction) => prevTransaction + 1);
        insertTransaction(user.email, transaction_name, categoryName, category, amount); // Doesn't need this in userEffect since we only keep track of the transcation without showing it
      }
    });
  };

  const handleTransacationName =(categoryName, category) => {
    Alert.prompt(
      'Name of the transaction?',
      'Enter name',
      (transactionName) => {
        if(transactionName) {
          handleAddExpense(transactionName, categoryName, category);
        }
      });
  };

  const handleCategoryPrompt = () => {
    Alert.alert(
        'Choose Category',
        'Choose an option from the list:',
        [
            { text: 'Groceries', onPress: () => handleTransacationName('Groceries', 0) },
            { text: 'Travel', onPress: () => handleTransacationName('Travel', 1) },
            { text: 'Transportation', onPress: () => handleTransacationName('Transportation', 2) },
            { text: 'Restaurants and bars', onPress: () => handleTransacationName('Restaurants and bars', 3) },
            // Can add more options?
            { text: 'Cancel', style: 'cancel' },
        ],
    );
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>Hello, {user.name}</Text>
        </View>

        <View style={styles.incomeExpensesButtons}>
          <Button mode="contained" onPress={handleAddIncome}>Add income</Button>
          <Button mode="contained" onPress={handleCategoryPrompt}>Add expense</Button>
        </View>

        <View style={styles.componentContainerBalance}>
          <View style={styles.incomeExpensesContainerText}>
            <Text style={styles.componentIndicationText}>Balance</Text>
            <Text style={styles.componentText}>$ {balance}</Text>
          </View>
        {/* Your balance tracking component code here */}
        </View>

        <View style={styles.incomeExpensesContainer}>
          <IncomeComponent value={income} />
          <ExpensesComponent value={expense} />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomContainerText}>Statistics</Text>
          <View style={styles.menuContainer}>
            <View style={styles.menuItemContainer}>
              <MenuItem iconName="ios-flag" text="Goals" />
              <Text>{goals}</Text>
            </View>

            <View style={styles.menuItemContainer}>
              <MenuItem iconName="cash-outline" text="Budget" />
              <Text>{budget}</Text>
            </View>

            <View style={styles.menuItemContainer}>
              <MenuItem iconName="logo-usd" text="Money Saved" />
              <Text>{(Math.floor((balance / income) * 100) || 0)}%</Text>
            </View>

            <View style={styles.menuItemContainer}>
              <MenuItem iconName="swap-horizontal-outline" text="Transaction" />
              <Text>{transaction}</Text>
            </View>
          </View>
        </View>
      </View>
      <BottomMenu user={user} navigation={navigation}/>
    </Background>
  )
}

const IncomeComponent = (props) => {
  return (
    <View style={styles.componentContainer}>
        <Ionicons name='arrow-up-sharp' size={24} color="green" />
        <View style={styles.incomeExpensesContainerText}>
          <Text style={styles.componentIndicationText}>Income</Text>
          <Text style={styles.componentText}>$ {props.value}</Text>
        </View>
      {/* Your income tracking component code here */}
    </View>
  );
};

const ExpensesComponent = (props) => {
  return (
    <View style={styles.componentContainer}>
      <Ionicons name='arrow-down-sharp' size={24} color="red" />
      <View style={styles.incomeExpensesContainerText}>
        <Text style={styles.componentIndicationText}>Expenses</Text>
        <Text style={styles.componentText}>$ {props.value}</Text>
      </View>
      {/* Your expenses tracking component code here */}
    </View>
  );
};

const MenuItem = ({ iconName, text }) => {
  return (
    <View style={styles.menuItemSymbol}>
      <Ionicons name={iconName} size={24} color="black" />
      <Text style={styles.menuItemText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  incomeExpensesButtons: {
    marginTop: 10
  },
  incomeExpensesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '15%',
  },
  componentContainerBalance: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: '10%',
    backgroundColor: 'rgba(46, 46, 46, 0.5)',
    borderRadius: 10, 
    alignItems: 'center',
    marginTop: 10
  },
  incomeExpensesContainerText: {
    
  },
  componentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '50%',
    backgroundColor: 'rgba(46, 46, 46, 0.5)',
    borderRadius: 10, 
    alignItems: 'center',
  },
  componentIndicationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white'
  },
  componentText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white'
  },
  bottomContainer: {
    justifyContent: 'space-between',
    marginBottom: 20
  },
  bottomContainerText: {
    fontSize: 30,
    //fontFamily: 'arial',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(46, 46, 46, 0.5)',
    borderRadius: 10,
    marginTop: 15
  },
  menuItemContainer: {
    width: '48%',
    height: 100,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  menuItemSymbol: {
    alignItems: 'center'
  },
  menuItemText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10 
  },
  bottomIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
});
