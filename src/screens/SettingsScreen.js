import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, Button } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker';
import Background from '../components/Background';
import BottomMenu from '../components/BottomMenu';
import SeparatorLine from '../components/Separator'; //This is extracted as component because a View can't be empty and will throw an error
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../core/theme';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');

export default function StatisticsScreen({ navigation, route }) {
    const userId = route.params.user.email;
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [imageSource, setImageSource] = useState();
    const [memberDate, setMemberDate] = useState('');
    const [hiddenCurrentPassword, setHiddenPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //use the useEffect hook to load user data once when the component is mounted
    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ?',
          [userId],
          (_, { rows }) => {
            if (rows.length > 0) {
              const user = rows.item(0);
              setUser(user);
              setName(user.name);
              setMemberDate(user.date.substring(0, 4));
              setHiddenPassword(user.password);
              setImageSource(user.image === null ? require('../assets/default-profile-picture.jpg') : {uri: user.image});
              console.log('User found:', user);
    
            } else {
              setUserFound(false);
              console.log('User not found');  
            }
          },
        );
      });
    }, []);

    const handlePasswordChange = () => {
      // Perform password change logic here
      if (newPassword !== confirmNewPassword) {
        setErrorMessage("New passwords don't match.");
        return;
      }

      if (hiddenCurrentPassword !== currentPassword) {
        setErrorMessage("Current password is not correct.");
        return;
      }

      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE users SET password = ? WHERE email = ?',
          [newPassword, userId],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log(`User with email ${userId} updated successfully`);
            } else {
              console.log(`No user found with email ${userId}`);
            }
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
      });
  
      // Call API or perform password change action
      // You can add your own implementation here
  
      // Reset form after successful password change
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrorMessage('');
    };

    const handlePersonalChange = () => {
      console.log(imageSource)
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE users SET name = ?, image = ? WHERE email = ?',
          [name, imageSource.uri, userId],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log(`User with email ${userId} updated successfully`);
            } else {
              console.log(`No user found with email ${userId}`);
            }
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
      });
    }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImageSource({uri: result.assets[0].uri});
      }
    };

    return (
      <Background>
        <Text style={styles.containerImage}>
          <TouchableOpacity onPress={pickImage}>
              <Image source={imageSource} style={styles.image}/>
          </TouchableOpacity>  
        </Text>
        <Text style={styles.date}>
            Member since {memberDate}
        </Text>
        <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handlePersonalChange}>
          <Text style={styles.buttonText}>Change Personal Info</Text>
        </TouchableOpacity>
        <SeparatorLine />
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <BottomMenu user={user} navigation={navigation} />
      </Background>
    )
}

const imageSize = 200;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    containerImage: {
      // Set width and height for the container to create a circle
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize / 2, // Make the image circular
      overflow: 'hidden', // Ensure the image stays within the circular bounds
      backgroundColor: '#f0f0f0', // Optional: Add a background color for the circular container
    },
    image: {
      width: imageSize,
      height: imageSize,
      // Optional: You can add additional styles for the image
    },
    date: {
      fontSize: 15,
      fontStyle: 'italic',
      marginTop: '7%',
      marginBottom: '7%'
    },
    textInput: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 12,
        backgroundColor: 'yellow',
        width: '100%',
        marginTop: '5%',
        marginBottom: '5%'
    },
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    separator: {
      height: 1, 
      backgroundColor: '#ccc', 
      marginVertical: 10,
    },
});