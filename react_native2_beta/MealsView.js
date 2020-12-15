import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import { Card } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';


class MealsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      foods: [],
      // data for meals
      totalCal: [],
      totalCar: [],
      totalFat: [],
      totalPro: [],
      // for time picker
      mode: 'date',
      // edit meal
      showEdit: false,
      editId: "0",
      editName: "name",
      editDate: new Date(),
      oriDate: new Date(),
      // add meal
      showAdd: false,
      addName: "Name",
      addDate: new Date(),
      // edit food
      showEditFood: false,
      editFoodName: "name",
      editFoodMealId: "0",
      editFoodId: "0",
      editFoodCal: "0",
      editFoodPro: "0",
      editFoodFat: "0",
      editFoodCar: "0",
      // add food
      showAddFood: false,
      addFoodMealId: "0",
      addFoodName: "name",
      addFoodId: "0",
      addFoodCal: "0",
      addFoodPro: "0",
      addFoodFat: "0",
      addFoodCar: "0",
    }
  }

  async getMealInfo(meals) {
    var length = meals.length
    var mealInfo = { "cal": [], "fat": [], "pro": [], "car": [], "foods": [], "meals": meals };

    var fetches = [];
    // traverse meals and get foods with meal id
    for (var i = 0; i < length; i++) {
      var curId = meals[i].id;
      // fetch to get foods
      fetches.push(
        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + curId.toString() + '/foods/', {
          method: 'GET',
          headers: { 'x-access-token': this.props.accessToken }
        })
          .then(res => res.json())
          .then(res => {
            var foods = res.foods;
            var curCal = 0;
            var curPro = 0;
            var curFat = 0;
            var curCar = 0;
            mealInfo.foods.push(foods)
            // mealInfo.foods[i] = foods

            for (var j = 0; j < foods.length; j++) {
              var curFood = foods[j];
              curCal += curFood.calories;
              curPro += curFood.protein;
              curFat += curFood.fat;
              curCar += curFood.carbohydrates;
            }

            mealInfo.cal.push(curCal);
            mealInfo.pro.push(curPro);
            mealInfo.fat.push(curFat);
            mealInfo.car.push(curCar);
          }))
      await Promise.all(fetches).then(function () {
      });
    }
    await Promise.all(fetches).then(function () {
      return mealInfo;
    });
    return mealInfo;
  }

  componentDidMount() {
    // get meal
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(async (res) => this.getMealInfo(res.meals))
      .then(res => {
        // get meal info
        this.setState({
          meals: res.meals,
          foods: res.foods,
          totalCal: res.cal,
          totalCar: res.car,
          totalPro: res.pro,
          totalFat: res.fat,
        });
      });
  }

  componentDidUpdate() {
    // get meal
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => this.getMealInfo(res.meals))
      .then(res => {
        // get meal info
        // var todayMeal = this.getTodayMeal(res.meals);
        // var mealInfo = this.getMealInfo(todayMeal);
        // this.getMealInfo(todayMeal, 0);
        if (JSON.stringify(this.state.foods) !== JSON.stringify(res.foods) ||
          JSON.stringify(this.state.meals) !== JSON.stringify(res.meals) ||
          JSON.stringify(this.state.totalCal) !== JSON.stringify(res.cal) ||
          JSON.stringify(this.state.totalCar) !== JSON.stringify(res.car) ||
          JSON.stringify(this.state.totalPro) !== JSON.stringify(res.pro) ||
          JSON.stringify(this.state.totalFat) !== JSON.stringify(res.fat)) {
          this.setState({
            foods: res.foods,
            meals: res.meals,
            totalCal: res.cal,
            totalCar: res.car,
            totalPro: res.pro,
            totalFat: res.fat,
          });
        }
      });
  }

  // to select time
  getTimeNow() {
    var time = new Date();
    return time.toString().substring(4);
  }

  showDatepicker() {
    this.setState({
      mode: 'date',
    })
  }

  showTimepicker() {
    this.setState({
      mode: 'time',
    })
  }

  clearUpdate() {
    // enable scroll
    this.refs.mainView.setNativeProps({ scrollEnabled: true });
    this.refs.updateView.scrollTo({ x: 0, y: 0 });
    this.refs.updateFoodView.scrollTo({ x: 0, y: 0 });

    this.setState({
      // for time picker
      mode: 'date',
      // edit meal
      showEdit: false,
      editId: "0",
      editName: "name",
      editDate: new Date(),
      oriDate: new Date(),
      // add meal
      showAdd: false,
      addName: "Name",
      addDate: new Date(),
      // edit food
      showEditFood: false,
      editFoodName: "name",
      editFoodMealId: "0",
      editFoodId: "0",
      editFoodCal: "0",
      editFoodPro: "0",
      editFoodFat: "0",
      editFoodCar: "0",
      // add food
      showAddFood: false,
      addFoodName: "name",
      addFoodMealId: "0",
      addFoodId: "0",
      addFoodCal: "0",
      addFoodPro: "0",
      addFoodFat: "0",
      addFoodCar: "0",
    })
  }

  onChange(event, selectedDate) {
    if (this.state.showAdd) {
      this.setState({
        addDate: selectedDate,
      })
    } else {
      this.setState({
        editDate: selectedDate,
      })
    }
  }

  // show edit meal and retrieve info of meal to edit
  toShowEdit(i) {
    // scroll to top and lock background screen
    this.refs.mainView.scrollTo({ x: 0, y: 0 });
    this.refs.mainView.setNativeProps({ scrollEnabled: false });
    this.refs.updateView.scrollTo({ x: 0, y: 0 });

    if (this.state.showAdd || this.state.showAddFood || this.state.showEditFood) {
      return;
    }
    var curMeal = this.state.meals[i];
    var curDate = new Date(curMeal.date);
    // offset for time zone
    curDate = new Date(curDate.getTime() - (curDate.getTimezoneOffset() * 60000));
    this.setState({
      editId: curMeal.id,
      editName: curMeal.name,
      editDate: curDate,
      oriDate: curDate,
      showEdit: true,
    })
  }

  // delete meal
  toDelete(i) {
    var curMeal = this.state.meals[i];
    Alert.alert(
      "Delete Confirm",
      "Are you sure to delete the meal: " + curMeal.name + "?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            // update
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + curMeal.id, {
              method: 'DELETE',
              headers: {
                'x-access-token': this.props.accessToken
              },
            }).then(res => res.json())
              .then(res => {
                alert("Your meal has been deleted!");
                this.forceUpdate();
              });
          }
        }
      ],
      { cancelable: false }
    );
  }

  updateMeal() {
    // add 
    if (this.state.showAdd) {
      fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.addName,
          date: this.state.addDate.toISOString(),
        })
      }).then(res => res.json())
        .then(res => {
          alert("Your meal has been added!");
          // clear states for add
          this.clearUpdate();
          this.forceUpdate();
        })
        .catch(err => {
          alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
    } else {
      // update
      fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.editId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.editName,
          date: this.state.editDate.toISOString(),
        })
      }).then(res => res.json())
        .then(res => {
          alert("Your meal has been updated!");
          // clear states for add
          this.clearUpdate();
          this.forceUpdate();

        })
        .catch(err => {
          alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
    }
  }

  toShowAddFood(i) {
    // scroll to top and lock background screen
    this.refs.mainView.scrollTo({ x: 0, y: 0 });
    this.refs.mainView.setNativeProps({ scrollEnabled: false });
    this.refs.updateFoodView.scrollTo({ x: 0, y: 0 });

    // not show if other window exist
    if (this.state.showAdd || this.state.showEidtFood || this.state.showEdit) {
      return;
    }

    var curMeal = this.state.meals[i];
    this.setState({
      addFoodMealId: curMeal.id,
      showAddFood: true,
    })
  }

  toShowEditFood(curFood, i) {
    // scroll to top and lock background screen
    this.refs.mainView.scrollTo({ x: 0, y: 0 });
    this.refs.mainView.setNativeProps({ scrollEnabled: false });
    this.refs.updateFoodView.scrollTo({ x: 0, y: 0 });

    // not show if other window exist
    if (this.state.showAdd || this.state.showAddFood || this.state.showEdit) {
      return;
    }

    var curMeal = this.state.meals[i];
    this.setState({
      editFoodName: curFood.name,
      editFoodMealId: curMeal.id,
      editFoodId: curFood.id,
      editFoodCal: curFood.calories ? curFood.calories.toString() : "0",
      editFoodPro: curFood.protein ? curFood.protein.toString() : "0",
      editFoodFat: curFood.fat ? curFood.fat.toString() : "0",
      editFoodCar: curFood.carbohydrates ? curFood.carbohydrates.toString() : "0",
      showEditFood: true,
    })
  }

  toDeleteFood(curFood, i) {
    var curMeal = this.state.meals[i];
    Alert.alert(
      "Delete Confirm",
      "Are you sure to delete the food " + curFood.name + " of meal " +curMeal.name + "?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            // update
            fetch('https://mysqlcs639.cs.wisc.edu/meals/' + curMeal.id + 
                    "/foods/" + curFood.id, {
              method: 'DELETE',
              headers: {
                'x-access-token': this.props.accessToken
              },
            }).then(res => res.json())
              .then(res => {
                alert("Your food has been deleted!");
                this.forceUpdate();
              });
          }
        }
      ],
      { cancelable: false }
    );
  }

  updateFood() {
    // add 
    if (this.state.showAddFood) {
      fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.addFoodMealId + "/foods/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.addFoodName,
          calories: parseFloat(this.state.addFoodCal) ? parseFloat(this.state.addFoodCal) : 0,
          protein:parseFloat(this.state.addFoodPro) ? parseFloat(this.state.addFoodPro) : 0,
          carbohydrates:parseFloat(this.state.addFoodCar) ? parseFloat(this.state.addFoodCar) : 0,
          fat:parseFloat(this.state.addFoodFat) ? parseFloat(this.state.addFoodFat) : 0,
        })
      }).then(res => res.json())
        .then(res => {
          alert("Your food has been added!");
          // clear states for add
          this.clearUpdate();
        })
        .catch(err => {
          alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
    } else {
      // update
      fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.editFoodMealId + 
            "/foods/" + this.state.editFoodId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.editFoodName,
          calories: parseFloat(this.state.editFoodCal) ? parseFloat(this.state.editFoodCal) : 0,
          protein:parseFloat(this.state.editFoodPro) ? parseFloat(this.state.editFoodPro) : 0,
          carbohydrates:parseFloat(this.state.editFoodCar) ? parseFloat(this.state.editFoodCar) : 0,
          fat:parseFloat(this.state.editFoodFat) ? parseFloat(this.state.editFoodFat) : 0,
        })
      }).then(res => res.json())
        .then(res => {
          alert("Your food has been updated!");
          // clear states for add
          this.clearUpdate();
        })
        .catch(err => {
          alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
    }
  }

  getFormattedMeal() {
    var formattedMeal = [];

    for (var i = 0; i < this.state.meals.length; i++) {
      var curMeal = this.state.meals[i];
      var curDate = new Date(curMeal.date);
      // offset for time zone
      curDate = new Date(curDate.getTime() - (curDate.getTimezoneOffset() * 60000));

      formattedMeal.push(
        <Card key={"show meal " + curMeal.id}>
          <Text style={styles.boldText}>{curMeal.name}</Text>
          <Card.Divider />
          <Text>Date: {curDate.toString().substring(4)} </Text>
          <Text>Total Calories: {this.state.totalCal[i]}</Text>
          <Text>Total Protein: {this.state.totalPro[i]}</Text>
          <Text>Total Carbohydrates: {this.state.totalCar[i]}</Text>
          <Text>Total Fat: {this.state.totalFat[i]}</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="Add Food"
              onPress={this.toShowAddFood.bind(this, i)} />
            <View style={styles.spaceHorizontal} />
            <Button color="#942a21" style={styles.buttonInline} title="Edit"
              onPress={this.toShowEdit.bind(this, i)} />
            <View style={styles.spaceHorizontal} />
            <Button color="#a1635f" style={styles.buttonInline} title="Delete"
              onPress={this.toDelete.bind(this, i)} />
          </View>
          {this.getFormattedFood(this.state.foods[i], i)}
        </Card>
      )

    }
    return formattedMeal;
  }

  getFormattedFood(foods, meal_i) {
    var formattedFoods = [];
    if (!foods) {
      return []
    }
    // add foods
    for (var i = 0; i < foods.length; i++) {
      var curFood = foods[i]
      formattedFoods.push(
        <View key={"show food " + curFood.id} style={{ margin: 10}}>
          <Text style={styles.boldText}>{curFood.name}</Text>
          <Card.Divider />
          <Text>Calories: {curFood.calories}</Text>
          <Text>Protein: {curFood.protein}</Text>
          <Text>Carbohydrates: {curFood.carbohydrates}</Text>
          <Text>Fat: {curFood.fat}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="Edit"
              onPress={this.toShowEditFood.bind(this, curFood, meal_i)} />
            <View style={styles.spaceHorizontal} />
            <Button color="#a1635f" style={styles.buttonInline} title="Delete"
              onPress={this.toDeleteFood.bind(this, curFood, meal_i)} />
          </View>
        </View>
      )
    }
    return formattedFoods;
  }

  render() {
    return (
      <ScrollView ref='mainView' style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
        <View style={styles.space} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="utensils" size={40} color="#900" style={{ marginRight: 10 }} />
          <Text style={styles.bigText}>Meals</Text>
        </View>
        <Text>Let's calculate your nutritions!</Text>
        <Text>Record your meals below.</Text>
        <View style={styles.space} />

        {/* add meal */}
        <Button color="#942a21" style={styles.buttonInline} title="Add Meal"
          onPress={() => {
            if (!(this.state.showEdit || this.state.showEidtFood || this.state.showEdit)) {
              this.setState({ showAdd: true });
              this.refs.mainView.scrollTo({ x: 0, y: 0 });
              this.refs.mainView.setNativeProps({ scrollEnabled: false });
              this.refs.updateView.scrollTo({ x: 0, y: 0 });
            }
          }} />
        <View style={styles.space} />

        {/* current meals */}
        {this.getFormattedMeal()}
        <View style={styles.space} />

        {/* add/edit meal */}
        <ScrollView ref="updateView" style={this.state.showAdd || this.state.showEdit ? styles.aboveCont : { display: "none" }}
          contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>

          <Text style={styles.secondText}>Meal Details</Text>
          {/* name */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Meal Name</Text>
          </View>
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAdd ? this.state.addName : this.state.editName} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAdd ? (name) => this.setState({ addName: name })
              : (name) => this.setState({ editName: name })}
            value={this.state.showAdd ? this.state.addName : this.state.editName}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Time */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Meal date and time</Text>
          </View>
          <Text>{this.state.showAdd ? this.state.addDate.toString().substring(4) : this.state.editDate.toString().substring(4)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="Set Date" onPress={() => this.showDatepicker()} />
            <View style={styles.spaceHorizontal} />
            <Button color="#942a21" style={styles.buttonInline} title="Set Time" onPress={() => this.showTimepicker()}
            />
          </View>

          <DateTimePicker
            value={this.state.showAdd ? this.state.addDate : this.state.editDate}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={(event, date) => this.onChange(event, date)}
            style={{ width: 250, backgroundColor: "#eeeeee" }}
          />

          <Button color="#a1635f" style={styles.buttonInline} title="Clear Time Settings"
            onPress={() => {
              this.state.showAdd ? this.setState({ addDate: new Date() })
                : this.setState({ editDate: this.state.oriDate })
            }} />

          <View style={styles.space}></View>
          <Text >Looks good! Ready to save your work?</Text>
          <View style={styles.spaceSmall} />


          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="Save" onPress={() => this.updateMeal()} />
            <View style={styles.spaceHorizontal} />
            <Button color="#a1635f" style={styles.buttonInline} title="Nevermind" onPress={() => { this.clearUpdate() }} />
          </View>
          <View style={styles.space} />

        </ScrollView>

        {/* add/edit food */}
        <ScrollView ref="updateFoodView" style={this.state.showAddFood || this.state.showEditFood ? styles.aboveCont : { display: "none" }}
          contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>

          <Text style={styles.secondText}>Food Details</Text>
          {/* name */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Food Name</Text>
          </View>
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAddFood ? this.state.addFoodName : this.state.editFoodName} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAddFood ? (name) => this.setState({ addFoodName: name })
              : (name) => this.setState({ editFoodName: name })}
            value={this.state.showAddFood ? this.state.addFoodName : this.state.editFoodName}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Calories */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories (kcal)</Text>
          </View>
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAddFood ? this.state.addFoodCal.toString() : this.state.editFoodCal.toString()} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAddFood ? (cal) => this.setState({ addFoodCal: cal }) :
              (cal) => this.setState({ editFoodCal: cal })}
            value={this.state.showAddFood ? this.state.addFoodCal : this.state.editFoodCal}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>
          
          {/* Protein */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Protein (grams)</Text>
          </View>
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAddFood ? this.state.addFoodPro.toString() : this.state.editFoodPro.toString()} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAddFood ? (pro) => this.setState({ addFoodPro: pro }) :
              (pro) => this.setState({ editFoodPro: pro })}
            value={this.state.showAddFood ? this.state.addFoodPro : this.state.editFoodPro}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Carbs */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Carbohydrates (grams)</Text>
          </View>
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAddFood ? this.state.addFoodCar.toString() : this.state.editFoodCar.toString()} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAddFood ? (car) => this.setState({ addFoodCar: car }) :
              (car) => this.setState({ editFoodCar: car })}
            value={this.state.showAddFood ? this.state.addFoodCar : this.state.editFoodCar}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Fat */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Fat (grams)</Text>
          </View>
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAddFood ? this.state.addFoodFat.toString() : this.state.editFoodFat.toString()} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAddFood ? (fat) => this.setState({ addFoodFat: fat }) :
              (fat) => this.setState({ editFoodFat: fat })}
            value={this.state.showAddFood ? this.state.addFoodFat : this.state.editFoodFat}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>


          <View style={styles.space}></View>
          <Text >Looks good! Ready to save your work?</Text>
          <View style={styles.spaceSmall} />


          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button color="#942a21" style={styles.buttonInline} title="Save" onPress={() => this.updateFood()} />
            <View style={styles.spaceHorizontal} />
            <Button color="#a1635f" style={styles.buttonInline} title="Nevermind" onPress={() => { this.clearUpdate() }} />
          </View>
          <View style={styles.space} />

        </ScrollView>

      </ScrollView>

    )
  }

}

const styles = StyleSheet.create({
  aboveCont: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.1,
    height: Dimensions.get('window').height * 0.7,
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: "#ffffff",
    zIndex: 1000,
    borderColor: "#000000",
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 500,
      height: 500,
    },
  },
  scrollView: {
    height: Dimensions.get('window').height
  },
  mainContainer: {
    flex: 1
  },
  scrollViewContainer: {},
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  secondText: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 5
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex"
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
  inputInline: {
    flexDirection: "row",
    display: "flex",
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
  boldText: {
    fontWeight: "600",
    marginBottom: 5
  },
});

export default MealsView;