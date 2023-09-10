import React, {useState , useEffect} from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');

export default function Overview(props) {
  const userId = 'martin@gmail.com'; //TO DO REMOVE THIS! THIS IS TEMP!
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - daysToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  const [barData, setBarData] = useState([]);
  const stackData = [
    {
      stacks: [
        {value: 800, color: 'orange'},
        {value: 1000, color: '#4ABFF4', marginBottom: 2},
      ],
      label: 'Jul',
    },
    {
      stacks: [
        {value: 1500, color: 'orange'},
        {value: 1800, color: '#4ABFF4', marginBottom: 2},
      ],
      label: 'Aug',
    },
    {
      stacks: [
        {value: 500, color: 'orange'},
        {value: 800, color: '#4ABFF4', marginBottom: 2},
      ],
      label: 'Sept',
    },
  ];
  
  useEffect(() => {
    db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM transactions WHERE user_email = ? AND date BETWEEN ? AND ?;',
      [userId, startDate.toISOString(), endDate.toISOString()],
      (_, { rows }) => {
        const currentWeekTransactions = rows._array;

        // Create an object to store transactions for each day of the week
        const weekTransactionsByDay = {
          Sunday: [],
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        };
  
        // Group transactions by day of the week
        currentWeekTransactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          const dayOfWeek = transactionDate.toLocaleDateString('en-US', { weekday: 'long' }).split(',')[0]; //Using .split(',')[0] because for some reason I get this without it, e.g. Sunday, 10/09/2023
          if (weekTransactionsByDay[dayOfWeek]) {
            weekTransactionsByDay[dayOfWeek].push(transaction);
          }
        });

        //Temporary storage for the amount of the transactions
        const transactionsByDayOfWeek = {
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
        }

        //Loop through the transactions to get the amount of each day
        Object.keys(transactionsByDayOfWeek).forEach((dayOfWeek) => {
          transactionsByDayOfWeek[dayOfWeek] = weekTransactionsByDay[dayOfWeek].reduce(
            (total, transaction) => total + transaction.amount,
            0
          );
        });

        //Set the data to be shown in the bar chart
        setBarData([
          {value: transactionsByDayOfWeek['Monday'], label: 'M', frontColor: '#177AD5'},
          {value: transactionsByDayOfWeek['Tuesday'], label: 'T', frontColor: '#177AD5'},
          {value: transactionsByDayOfWeek['Wednesday'], label: 'W', frontColor: '#177AD5'},
          {value: transactionsByDayOfWeek['Thursday'], label: 'T', frontColor: '#177AD5'},
          {value: transactionsByDayOfWeek['Friday'], label: 'F', frontColor: '#177AD5'},
          {value: transactionsByDayOfWeek['Saturday'], label: 'S', frontColor: '#177AD5'},
          {value: transactionsByDayOfWeek['Sunday'], label: 'S', frontColor: '#177AD5'},
        ]);  
      }
    );
  });
  }, []);

  return (
    <View style={{ flex: 0.8, width: '100%', flexDirection: 'column'}}>
      <View>
        <Text style={{fontSize: 18}}>Weekly Spending</Text>
        <BarChart
              width={Dimensions.get('window').width/1.5}
              barWidth={20}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              data={barData}
              yAxisThickness={0}
              xAxisThickness={0}
          />
      </View>

      <View style={{marginTop: '10%'}}>
        <Text style={{fontSize: 18, marginBottom: '5%'}}>Monthly Spending</Text>
        <BarChart 
              width={Dimensions.get('window').width/2}
              rotateLabel
              barWidth={12}
              spacing={40}
              noOfSections={4}
              barBorderRadius={6}
              stackData={stackData}
          />
      </View>
    </View>
  )
}