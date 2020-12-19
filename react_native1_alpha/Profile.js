import { Logs } from 'expo';
import react, { useEffect } from 'react';
import React from 'react';
import { render } from 'react-dom';
import { StyleSheet, TextInput, Button, View, Dimensions, Text, ScrollView } from 'react-native';

export default function Profile({ navigation, route }) {
	// get the token
	const { token, username, password } = route.params;
	const [info, setInfo] = React.useState('');

	// info to update
	const [first, setFirst] = React.useState('');
	const [last, setLast] = React.useState('');
	const [cal, setCal] = React.useState('');
	const [pro, setPro] = React.useState('');
	const [carb, setCarb] = React.useState('');
	const [fat, setFat] = React.useState('');
	const [act, setAct] = React.useState('');

	// fetch data
	useEffect(() => {
		fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
			method: 'GET',
			headers: {
				'x-access-token': token,
			}
		}).then(res => res.json())
			.then(json => {
				// update info if changed
				if (JSON.stringify(info) !== JSON.stringify(json)) {
					setInfo(json)
				}
			})
	});

	return (
		<ScrollView contentContainerStyle={formStyles.scrollCont}>
			<Text style={formStyles.label}>My Profile</Text>
			<Text >Let's get to know you!</Text>
			<Text style={{ marginBottom: 10 }}>Specify your information below.</Text>

			{/* personal info */}
			<Text style={formStyles.secondLabel}>Personal Information</Text>

			<Text style={formStyles.thirdLabel}>First Name</Text>
			<TextInput style={formStyles.input}
				placeholder={info.firstName}
				value={first}
				onChangeText={setFirst} 
				placeholderTextColor={'#666'}/>

			<Text style={formStyles.thirdLabel}>Last Name</Text>
			<TextInput style={formStyles.input}
				placeholder={info.lastName}
				value={last}
				onChangeText={setLast} 
				placeholderTextColor={'#666'}/>

			{/* fitness goals */}
			<Text style={formStyles.secondLabel}>Fitness Goals</Text>
			<Text style={formStyles.thirdLabel}>Daily Calories (kcal)</Text>
			<TextInput style={formStyles.input}
				placeholder={info.goalDailyCalories ? String(info.goalDailyCalories) : "0"}
				value={cal}
				onChangeText={setCal} 
				placeholderTextColor={'#666'}/>

			<Text style={formStyles.thirdLabel}>Daily Protein (grams)</Text>
			<TextInput style={formStyles.input}
				placeholder={info.goalDailyProtein ? String(info.goalDailyProtein) : "0"}
				value={pro}
				onChangeText={setPro} 
				placeholderTextColor={'#666'}/>

			<Text style={formStyles.thirdLabel}>Daily Carbs (grams)</Text>
			<TextInput style={formStyles.input}
				placeholder={info.goalDailyCarbohydrates ? String(info.goalDailyCarbohydrates) : "0"}
				value={carb}
				onChangeText={setCarb} 
				placeholderTextColor={'#666'}/>

			<Text style={formStyles.thirdLabel}>Daily Fat (grams)</Text>
			<TextInput style={formStyles.input}
				placeholder={info.goalDailyFat ? String(info.goalDailyFat) : "0"}
				value={fat}
				onChangeText={setFat} 
				placeholderTextColor={'#666'}/>

			<Text style={formStyles.thirdLabel}>Daily Activity (mins)</Text>
			<TextInput style={formStyles.input}
				placeholder={info.goalDailyActivity ? String(info.goalDailyActivity) : "0"}
				value={act}
				onChangeText={setAct} 
				placeholderTextColor={'#666'}/>

			<Text style={[formStyles.secondLabel, { marginTop: 10, marginBottom: 0 }]}>Looks good! All set?</Text>
			<View style={formStyles.btnGroup}>
				<Button title="LOGOUT" onPress={() => navigation.navigate('log')}></Button>
				<Button title="SAVE PROFILE" onPress={() => {
					// check whether the input for goal are float
					var num = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
					if ((!num.test(cal) && cal) || (!num.test(pro) && pro) ||
						(!num.test(carb) && carb) || (!num.test(fat) && fat) ||
						(!num.test(act) && act)) {
						alert("Please set positive floats or integers for goals!");
					} else {
						// update
						fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
							method: 'PUT',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'x-access-token': token,
							},
							body: JSON.stringify({
								"firstName": first ? first : info.firstName,
								"lastName": last ? last : info.lastName,
								"goalDailyCalories": cal ? cal : info.goalDailyCalories,
								"goalDailyProtein": pro ? pro : info.goalDailyProtein,
								"goalDailyCarbohydrates": carb ? carb : info.goalDailyCarbohydrates,
								"goalDailyFat": fat ? fat : info.goalDailyFat,
								"goalDailyActivity": act ? act : info.goalDailyActivity,
							})
						}).then(res => res.json())
							.then(json => {
								alert(json.message);
							});
					}

				}}></Button>
			</View>
		</ScrollView>
	);
}


const formStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollCont: {
		// flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 50,
		paddingBottom: 50,
	},
	btnGroup: {
		flexDirection: "row",
		margin: 10,
		justifyContent: 'space-between',
	},
	input: {
		alignItems: 'center',
		marginBottom: 10,
		height: 30,
		width: Dimensions.get("window").width * 0.4,
		borderRadius: 0,
		borderColor: 'black',
		borderWidth: 1,
		padding: 5,
	},
	label: {
		fontSize: 40,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	secondLabel: {
		fontSize: 20,
		fontWeight: '700',
		margin: 5,
	},
	thirdLabel: {
		fontWeight: "600",
		marginBottom: 2,
	}
});