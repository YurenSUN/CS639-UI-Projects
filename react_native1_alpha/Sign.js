import { Logs } from 'expo';
import React from 'react';
import { render } from 'react-dom';
import { StyleSheet, TextInput, Button, View, Dimensions, Text } from 'react-native';

export default function Sign({navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={formStyles.container}>
      <Text style={formStyles.label}>Fitness Tracker</Text>
      <Text style={{marginBottom: 10}}>Create a new account or back to log in.</Text>
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
        <Button title="BACK TO LOGIN"  onPress={() => {
          // suctescess login, clear login info first
          setUsername("");
          setPassword("");
          navigation.navigate('log');}}></Button>
        <Button title="CREATE A NEW ACCOUNT" onPress={() => {
          fetch('https://mysqlcs639.cs.wisc.edu/users', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              },
            body: JSON.stringify({
              "username": username, 
              "password": password,
            })
          }).then(res => res.json())
            .then(json => {
              alert(json.message);
              if(json.message === "User created!"){
                // suctescess login, clear login info first
                setUsername("")
                setPassword("")
                navigation.navigate('log')
              }
            });
        }}></Button>
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGroup: {
    flexDirection: "row",
    margin: 10,
    justifyContent: 'space-between',
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
  label:{
    fontSize: 40,
    fontWeight:'bold',
  },
});