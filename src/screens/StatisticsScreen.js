import React, { useState } from 'react'
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native'
import Background from '../components/Background'
import BottomMenu from '../components/BottomMenu'
import Overview from '../components/Overview'
import Budget from '../components/Budget'
import Goals from '../components/Goals'
import Transactions from '../components/Transactions'
import { theme } from '../core/theme'

export default function StatisticsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTab = (tabName) => (
    <TouchableOpacity
      key={tabName}
      style={[
        styles.tab,
        { backgroundColor: activeTab === tabName ? theme.colors.primary : theme.colors.secondary },
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={styles.tabText}>{tabName}</Text>
    </TouchableOpacity>
  );
  
  return (
    <Background>
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <View style={styles.gridColumn}>
                {renderTab("Overview")}
              </View>
              <View style={styles.gridColumn}>
                {renderTab("Budget")}
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridColumn}>
                {renderTab("Goals")}
              </View>
              <View style={styles.gridColumn}>
                {renderTab("Transactions")}
              </View>
            </View>
          </View>
          <View style={styles.contentContainer}>
            {/* Content for the active tab goes here */}
            {activeTab === "Overview" && <Overview/>}
            {activeTab === "Budget" && <Budget/>}
            {activeTab === "Goals" && <Goals/>}
            {activeTab === "Transactions" && <Transactions/>}
          </View>

        <BottomMenu navigation={navigation} />
    </Background>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'white',
  },
  gridContainer: {
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  tab: {
    margin: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '80%',
    borderRadius: 10
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
});