import React from 'react';
import { View, StyleSheet } from 'react-native';

const SeparatorLine = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1, // Set the height of the line
    backgroundColor: '#ccc', // Set the line color
    marginVertical: 10, // Adjust the vertical spacing as needed
  },
});

export default SeparatorLine;