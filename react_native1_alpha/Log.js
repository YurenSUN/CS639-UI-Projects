import { Logs } from 'expo';
import React from 'react';
import { render } from 'react-dom';
import { StyleSheet, TextInput, Button, View, Dimensions, Text } from 'react-native';
import base64 from 'base-64';
import react from 'react';

export default function Log({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={formStyles.container}>
      <Text style={formStyles.label}>Fitness Tracker</Text>
      <Text style={{ marginBottom: 10 }}>Welcome! Please login or signup to continue</Text>
      <TextInput style={formStyles.input}
        placeholder="UserName"
        value={username}
        onChangeText={setUsername} />
      <TextInput style={formStyles.input}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />
      <View style={formStyles.btnGroup}>
        <Button title="SIGNUP" onPress={() => {
          // suctescess login, clear login info first
          setUsername("");
          setPassword("");
          navigation.navigate('sign')}}></Button>
        <Button title="LOGIN" onPress={() => {
          fetch('https://mysqlcs639.cs.wisc.edu/login', {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + base64.encode(username + ":" + password),
            }
          }).then(res => res.json())
            .then(json => {
              if (!json.token) {
                alert("Username or password is incorrect! Please try again!");
              } else {
                // suctescess login, clear login info first
                setUsername("")
                setPassword("")

                // receive token, pass and navigate
                navigation.navigate('profile', {
                  token:json.token,
                  username: username,
                  password: password,
                });
              }
            });
        }}></Button>
      </View>
    </View >
  );
}

function logPressed(username, password, navigation) {
  navigation.navigate('sign')
}






const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGroup: {
    flexDirection: "row",
    margin: 10,
    justifyContent: 'space-between',
    width: Dimensions.get("window").width * 0.4,
  },
  input: {
    alignItems: 'center',
    marginTop: 10,
    height: 30,
    width: Dimensions.get("window").width * 0.4,
    borderRadius: 0,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
  },
  label: {
    fontSize: 40,
    fontWeight:'bold',
  },
});

