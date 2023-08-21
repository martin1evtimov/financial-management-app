import React, { useState } from 'react'
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Background from '../components/Background'
import Button from '../components/Button'
import BottomMenu from '../components/BottomMenu'


export default function Dashboard({ navigation }) {
  const [balance, setBalance] = useState(5000);
  const [income, setIncome] = useState(10000);
  const [expense, setExpense] = useState(5000);
  const [transaction, setTransaction] = useState(0);

  const handleAddIncome = () => {
    Alert.prompt('Add Income', 'Enter the amount:', (amount) => {
      if (amount && !isNaN(amount)) {
        const newIncome = parseFloat(amount);
        setIncome((prevIncome) => prevIncome + newIncome);
        setBalance((prevBalance) => prevBalance + newIncome);
        setTransaction((prevTransaction) => prevTransaction + 1)
      }
    });
  };

  const handleAddExpense = () => {
    Alert.prompt('Add Expense', 'Enter the amount:', (amount) => {
      if (amount && !isNaN(amount)) {
        const newExpense = parseFloat(amount);
        setExpense((prevExpense) => prevExpense + newExpense);
        setBalance((prevBalance) => prevBalance - newExpense);
        setTransaction((prevTransaction) => prevTransaction + 1)
      }
    });
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>Hello, Martin</Text>
        </View>

        <View style={styles.incomeExpensesButtons}>
          <Button mode="contained" onPress={handleAddIncome}>Add income</Button>
          <Button mode="contained" onPress={handleAddExpense}>Add expense</Button>
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
              <Text>6</Text>
            </View>

            <View style={styles.menuItemContainer}>
              <MenuItem iconName="cash-outline" text="Budget" />
              <Text>4</Text>
            </View>

            <View style={styles.menuItemContainer}>
              <MenuItem iconName="logo-usd" text="Money Saved" />
              <Text>35%</Text>
            </View>

            <View style={styles.menuItemContainer}>
              <MenuItem iconName="swap-horizontal-outline" text="Transaction" />
              <Text>{transaction}</Text>
            </View>
          </View>
        </View>
      </View>
      <BottomMenu navigation={navigation}/>
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
