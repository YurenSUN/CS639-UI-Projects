import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView, Dimensions } from 'react-native';
import { Card } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';



class TodayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      meals: [],
      foods: [],
      // goals
      goalTime: 0,
      goalCal: 0,
      goalCar: 0,
      goalFat: 0,
      goalPro: 0,
      // data for today
      todayCalBurn: 0,
      todayTime: 0,
      todayCal: [],
      todayCar: [],
      todayFat: [],
      todayPro: [],
    }

  }

  getTodayExer(exercises) {
    var todayExer = [];
    var today = new Date();
    if (!exercises) {
      return todayExer;
    }
    for (var i = 0; i < exercises.length; i++) {
      var exerDate = exercises[i].date;
      var curDate = new Date(exerDate);
      // offset for time zone
      curDate = new Date(curDate.getTime() - (curDate.getTimezoneOffset() * 60000));

      // isostring is YYYY-MM-DDTHH:mm:ss.sssZ or ±YYYYYY-MM-DDTHH:mm:ss.sssZ
      if (curDate.toString().includes(today.toString().substring(0, 16))) {
        todayExer.push(exercises[i]);
      }
    }
    return (todayExer);
  }

  getTodayMeal(meals) {
    var todayMeal = [];
    var today = new Date();
    if (!meals) {
      return todayMeal;
    }
    for (var i = 0; i < meals.length; i++) {
      var mealDate = meals[i].date;
      var curDate = new Date(mealDate);
      // offset for time zone
      curDate = new Date(curDate.getTime() - (curDate.getTimezoneOffset() * 60000));

      // isostring is YYYY-MM-DDTHH:mm:ss.sssZ or ±YYYYYY-MM-DDTHH:mm:ss.sssZ
      if (curDate.toString().includes(today.toString().substring(0, 16))) {
        todayMeal.push(meals[i]);
      }
    }
    return (todayMeal);
  }


  computeTime(todayExer) {
    var todayTime = 0;
    for (var i = 0; i < todayExer.length; i++) {
      todayTime += todayExer[i].duration;
    }
    return (todayTime);
  }

  computeCalBurnt(todayExer) {
    var todayCalBurn = 0;
    for (var i = 0; i < todayExer.length; i++) {
      todayCalBurn += todayExer[i].calories;
    }
    return (todayCalBurn);
  }

  async getMealInfo(mealsRaw) {
    var meals = this.getTodayMeal(mealsRaw);
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
    // get daily exercises
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        var todayExer = this.getTodayExer(res.activities);
        var todayTime = this.computeTime(todayExer);
        var todayCalBurn = this.computeCalBurnt(todayExer);
        this.setState({
          exercises: todayExer,
          todayTime: todayTime,
          todayCalBurn: todayCalBurn,
        });
      });

    // get goal
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          goalTime: res.goalDailyActivity,
          goalCal: res.goalDailyCalories,
          goalPro: res.goalDailyProtein,
          goalCar: res.goalDailyCarbohydrates,
          goalFat: res.goalDailyFat,
        });
      });

    // get meal
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(async (res) => this.getMealInfo(res.meals))
      .then(res => {
        // get meal info
        // var todayMeal = this.getTodayMeal(res.meals);
        // var mealInfo = this.getMealInfo(todayMeal);
        // this.getMealInfo(todayMeal)
        this.setState({
          meals: res.meals,
          foods: res.foods,
          todayCal: res.cal,
          todayCar: res.car,
          todayPro: res.pro,
          todayFat: res.fat,
        });
      });
  }

  // update info if changed
  componentDidUpdate() {
    // get daily exercises
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        var todayExer = this.getTodayExer(res.activities);
        var todayTime = this.computeTime(todayExer);
        var todayCalBurn = this.computeCalBurnt(todayExer);
        if (JSON.stringify(this.state.exercises) !== JSON.stringify(todayExer) ||
          this.state.todayTime !== todayTime ||
          this.state.todayCalBurn !== todayCalBurn) {
          this.setState({
            exercises: todayExer,
            todayTime: todayTime,
            todayCalBurn: todayCalBurn,
          });
        }
      });

    // get goal
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        if (this.state.goalTime !== res.goalDailyActivity ||
          this.state.goalCal !== res.goalDailyCalories ||
          this.state.goalPro !== res.goalDailyProtein ||
          this.state.goalCar !== res.goalDailyCarbohydrates ||
          this.state.goalFat !== res.goalDailyFat) {
          this.setState({
            goalTime: res.goalDailyActivity,
            goalCal: res.goalDailyCalories,
            goalPro: res.goalDailyProtein,
            goalCar: res.goalDailyCarbohydrates,
            goalFat: res.goalDailyFat,
          });
        };
      });

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
          JSON.stringify(this.state.todayCal) !== JSON.stringify(res.cal) ||
          JSON.stringify(this.state.todayCar) !== JSON.stringify(res.car) ||
          JSON.stringify(this.state.todayPro) !== JSON.stringify(res.pro) ||
          JSON.stringify(this.state.todayFat) !== JSON.stringify(res.fat)) {
          this.setState({
            foods: res.foods,
            meals: res.meals,
            todayCal: res.cal,
            todayCar: res.car,
            todayPro: res.pro,
            todayFat: res.fat,
          });
        }
      });
  }


  getFormattedExer() {
    var formattedExer = [];

    for (var i = 0; i < this.state.exercises.length; i++) {
      var curExer = this.state.exercises[i];
      var curDate = new Date(curExer.date);
      // offset for time zone
      curDate = new Date(curDate.getTime() - (curDate.getTimezoneOffset() * 60000));

      formattedExer.push(
        <Card key={"show exer " + curExer.id}>
          <Text style={styles.boldText}>{curExer.name}</Text>
          <Card.Divider />
          <Text>Date: {curDate.toString().substring(4)} </Text>
          <Text>Calories Burnt: {curExer.calories} </Text>
          <Text>Duration: {curExer.duration} </Text>
        </Card>
      )
    }
    return formattedExer;
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
          <Text>Total Calories: {this.state.todayCal[i]}</Text>
          <Text>Total Protein: {this.state.todayPro[i]}</Text>
          <Text>Total Carbohydrates: {this.state.todayCar[i]}</Text>
          <Text>Total Fat: {this.state.todayFat[i]}</Text>
          {this.getFormattedFood(this.state.foods[i])}
        </Card>
      )

    }
    return formattedMeal;
  }

  getFormattedFood(foods) {
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
        </View>
      )
    }
    return formattedFoods;
  }

  render() {

    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
        <View style={styles.space} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Ionicons name="ios-today" size={40} color="#900" style={{ marginRight: 10 }} />
          <Text style={styles.bigText}>Today</Text>
        </View>
        <Text>Whats on the agenda for today?</Text>
        <Text>Below are all of your goals and exercises.</Text>
        <View style={styles.space} />
        <Card>
          <Text style={styles.boldText}>Goals Status</Text>
          <Card.Divider />
          <Text>Daily Activities: {this.state.todayTime}/{this.state.goalTime} </Text>
          <Text>Daily Calories total: {this.state.todayCal.length ? this.state.todayCal.reduce((accumulator, currentValue) => accumulator + currentValue) - this.state.todayCalBurn : 0
            - this.state.todayCalBurn}/{this.state.goalCal} </Text>
          <Text style={{marginLeft: 5}}>Daily Calories Burnt: {this.state.todayCalBurn}</Text>
          <Text style={{marginLeft: 5}}>Daily Calories intake: {this.state.todayCal.length ? this.state.todayCal.reduce((accumulator, currentValue) => accumulator + currentValue): 0
            }</Text>  
          <Text>Daily Protein: {this.state.todayPro.length ? this.state.todayPro.reduce((accumulator, currentValue) => accumulator + currentValue) : 0}
                                /{this.state.goalPro} </Text>
          <Text>Daily Carbohydrates: {this.state.todayCar.length ? this.state.todayCar.reduce((accumulator, currentValue) => accumulator + currentValue) : 0}
                            /{this.state.goalCar} </Text>
          <Text>Daily Fat: {this.state.todayFat.length ? this.state.todayFat.reduce((accumulator, currentValue) => accumulator + currentValue) : 0}
                            /{this.state.goalFat} </Text>

                            

        </Card>
        <View style={styles.space} />

        {/* exercises */}
        <Text style={styles.secondText}>Exercises</Text>
        {this.getFormattedExer()}
        <View style={styles.space} />

        {/* meals */}
        <Text style={styles.secondText}>Meals</Text>
        {this.getFormattedMeal()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
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
  boldText: {
    fontWeight: "600",
    marginBottom: 5
  },
});

export default TodayView;