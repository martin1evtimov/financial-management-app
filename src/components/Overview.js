import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";


export default function Overview(props) {
    const stackData = [
        {
          stacks: [
            {value: 10, color: 'orange'},
            {value: 20, color: '#4ABFF4', marginBottom: 2},
          ],
          label: 'Jan',
        },
        {
          stacks: [
            {value: 14, color: 'orange'},
            {value: 18, color: '#4ABFF4', marginBottom: 2},
          ],
          label: 'Feb',
        },
        {
          stacks: [
            {value: 7, color: '#4ABFF4'},
            {value: 11, color: 'orange', marginBottom: 2},
          ],
          label: 'Mar',
        },
      ];

    const barData = [
        {value: 250, label: 'M', frontColor: '#177AD5'},
        {value: 500, label: 'T', frontColor: '#177AD5'},
        {value: 745, label: 'W', frontColor: '#177AD5'},
        {value: 320, label: 'T', frontColor: '#177AD5'},
        {value: 600, label: 'F', frontColor: '#177AD5'},
        {value: 256, label: 'S', frontColor: '#177AD5'},
        {value: 300, label: 'S', frontColor: '#177AD5'},
    ];

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