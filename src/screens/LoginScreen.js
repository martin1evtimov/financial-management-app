import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test7.db');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [userFound, setUserFound] = useState(true); // State variable to track if the user is found

  const onLoginPressed = () => {
    setUserFound(true);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    //const accountError = 
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ?',
        [email.value],
        (_, { rows }) => {
          if (rows.length > 0) {
            const user = rows.item(0);
            console.log('User found:', user);
            
            if (user.password === password.value) {
              navigation.reset({
                index: 0,
                routes: [{ 
                  name: 'Dashboard',
                  params: user 
                }],
              })
            } else {
              setUserFound(false);
              console.log('Password does not match');
            }

          } else {
            setUserFound(false);
            console.log('User not found');  
          }
        },
        (error) => {
          console.error('Error executing SQL:', error);
        }
      );
    });
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      {userFound ?  null : (
        <Text style={styles.errorMessage}>User not found. Please check your credentials.</Text>
      )}
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red'
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
