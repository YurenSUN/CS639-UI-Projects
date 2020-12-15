import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import { Card } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';


class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      showAdd: false,
      showEdit: false,
      // to edit a exercise
      editId: "0",
      editName: "name",
      editDuration: "0",
      editCal: "0",
      editDate: new Date(),
      oriDate: new Date(),
      // to add a exercise
      addName: "Name",
      addDuration: "0",
      addCal: "0",
      addDate: new Date(),
      mode: 'date',
    }

  }

  componentDidMount() {
    // get daily exercises
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          exercises: res.activities,
        });
      });
  }

  componentDidUpdate() {
    // get daily exercises
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        if (JSON.stringify(this.state.exercises) !== JSON.stringify(res.activities)) {
          this.setState({
            exercises: res.activities,
          });
        }
      });
  }

  getFormattedExer() {
    var formattedExer = [];
    if (!this.state.exercises) {
      return formattedExer;
    }
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

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button key={"show exer button" + curExer.id} color="#942a21" style={styles.buttonInline} title={"Edit"}
              onPress={this.toShowEdit.bind(this, curExer)} />
            <View style={styles.spaceHorizontal} />
            <Button color="#a1635f" style={styles.buttonInline} title="Delete"
              onPress={this.todelete.bind(this, curExer)} />
          </View>
        </Card>
      )
    }
    return formattedExer;
  }

  toShowEdit(curExer) {
    // scroll to top
    this.refs.mainView.scrollTo({ x: 0, y: 0 });
    this.refs.mainView.setNativeProps({ scrollEnabled: false });
    this.refs.updateView.scrollTo({ x: 0, y: 0 });

    var curDate = new Date(curExer.date);
    // offset for time zone
    curDate = new Date(curDate.getTime() - (curDate.getTimezoneOffset() * 60000));
    this.setState({
      editId: curExer.id,
      editName: curExer.name,
      editDuration: curExer.duration ? curExer.duration.toString() : "0",
      editCal: curExer.calories ? curExer.calories.toString() : "0",
      editDate: curDate,
      oriDate: curDate,
      showEdit: true,
    })
  }

  todelete(curExer) {
    Alert.alert(
      "Delete Confirm",
      "Are you sure to delete the exercise: " + curExer.name + "?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            // update
            fetch('https://mysqlcs639.cs.wisc.edu/activities/' + curExer.id, {
              method: 'DELETE',
              headers: {
                'x-access-token': this.props.accessToken
              },
            }).then(res => res.json())
              .then(res => {
                alert("Your exercise has been deleted!");
                this.forceUpdate();
              });
          }
        }
      ],
      { cancelable: false }
    );
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

  // clear update and close screen
  clearUpdate() {
    // enable scroll
    this.refs.mainView.setNativeProps({ scrollEnabled: true });
    this.refs.updateView.scrollTo({ x: 0, y: 0 });

    this.setState({
      showAdd: false,
      showEdit: false,
      // to edit a exercise
      editId: "0",
      editName: "",
      editDuration: "0",
      editCal: "0",
      editDate: new Date,
      // to add a exercise
      addName: "Name",
      addDuration: "0",
      addCal: "0",
      addDate: new Date(),
      mode: 'date',
    })
  }

  // add or edit exercise
  updateExer() {
    // add 
    if (this.state.showAdd) {
      fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.addName,
          duration: parseFloat(this.state.addDuration) ? parseFloat(this.state.addDuration) : 0,
          date: this.state.addDate.toISOString(),
          calories: parseFloat(this.state.addCal) ? parseFloat(this.state.addCal) : 0,
        })
      }).then(res => res.json())
        .then(res => {
          Alert.alert("Your exercise has been added!");
          // clear states for add
          this.clearUpdate();
          // this.setState({
          //   addName: "Name",
          //   addDuration: "0",
          //   addCal: "0",
          //   addDate: new Date(),
          //   mode: 'date',
          //   showAdd: false, //close screen
          // })
        })
        .catch(err => {
          alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
    } else {
      // update
      fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.state.editId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.accessToken
        },
        body: JSON.stringify({
          name: this.state.editName,
          duration: parseFloat(this.state.editDuration) ? parseFloat(this.state.editDuration) : 0,
          date: this.state.editDate.toISOString(),
          calories: parseFloat(this.state.editCal) ? parseFloat(this.state.editCal) : 0,
        })
      }).then(res => res.json())
        .then(res => {
          alert("Your exercise has been updated!");
          // clear states for add
          this.clearUpdate();
          // this.setState({
          //   editName: "",
          //   editDuration: "0",
          //   editCal: "0",
          //   oriDate: new Date(),
          //   editDate: new Date(),
          //   mode: 'date',
          //   showEdit: false, //close screen
          // })
        })
        .catch(err => {
          alert("Something went wrong! Verify you have filled out the fields correctly.");
        });
    }


  }

  render() {
    return (
      <ScrollView ref='mainView' style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
        <View style={styles.space} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon accessible={false}
            name="running" size={40} color="#900" style={{ marginRight: 10 }} />
          <Text style={styles.bigText}>Exercises</Text>
        </View>
        <Text accessible={false}>Let's get to work!</Text>
        <Text>Record your exercises below.</Text>
        <View style={styles.space} />

        {/* add exercises */}
        <View
          accessible={true}
          accessibilityLabel="Add Exercise Button">
          <Button

            color="#942a21" style={styles.buttonInline} title="Add Exercise"
            onPress={() => {
              this.setState({ showAdd: true });// scroll to top
              this.refs.mainView.scrollTo({ x: 0, y: 0 });
              this.refs.mainView.setNativeProps({ scrollEnabled: false });
              this.refs.updateView.scrollTo({ x: 0, y: 0 });
            }} />
        </View>

        <View style={styles.space} />

        {/* current exercises */}
        {this.getFormattedExer()}
        <View style={styles.space} />

        {/* add exercise */}
        <ScrollView ref="updateView" style={this.state.showAdd || this.state.showEdit ? styles.aboveCont : { display: "none" }}
          contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>

          <Text style={styles.secondText}>Exercise Details</Text>
          {/* name */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Name</Text>
          </View>
          <TextInput
            accessible={true}
            accessibilityLabel="Exercise Name: "
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={this.state.showAdd ? this.state.addName : this.state.editName} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAdd ? (name) => this.setState({ addName: name })
              : (name) => this.setState({ editName: name })}
            value={this.state.showAdd ? this.state.addName : this.state.editName}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Duration */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (mins)</Text>
          </View>
          <TextInput style={styles.input}
            accessible={true}
            accessibilityLabel="Exercise Duration: "
            accessibilityHint="in minutes."
            underlineColorAndroid="transparent"
            placeholder={this.state.showAdd ? this.state.addDuration.toString() : this.state.editDuration.toString()}
            placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAdd ? (duration) => this.setState({ addDuration: duration }) :
              (duration) => this.setState({ editDuration: duration })}
            value={this.state.showAdd ? this.state.addDuration : this.state.editDuration}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Calories */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories Burnt</Text>
          </View>
          <TextInput style={styles.input}
            accessible={true}
            accessibilityLabel="Exercise Calories Burnt: "
            accessibilityHint="in kilocalorie."
            underlineColorAndroid="transparent"
            placeholder={this.state.showAdd ? this.state.addCal.toString() : this.state.editCal.toString()} placeholderTextColor="#d9bebd"
            onChangeText={this.state.showAdd ? (cal) => this.setState({ addCal: cal }) :
              (cal) => this.setState({ editCal: cal })}
            value={this.state.showAdd ? this.state.addCal : this.state.editCal}
            autoCapitalize="none" />
          <View style={styles.spaceSmall}></View>

          {/* Time */}
          <View>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise date and time</Text>
          </View>
          <Text>{this.state.showAdd ? this.state.addDate.toString().substring(4) : this.state.editDate.toString().substring(4)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View
              accessible={true}
              accessibilityLabel="Set Date button"
              onMagicTap={() => Alert.alert("Click to set the date of your exercise in the date time picker below")}
            >
              <Button color="#942a21" style={styles.buttonInline} title="Set Date" onPress={() => this.showDatepicker()} />
            </View>

            <View style={styles.spaceHorizontal} />

            <View
              accessible={true}
              accessibilityLabel="Set Time button"
              onMagicTap={() => Alert.alert("Click to set the time of your exercise in the date time picker below")}
            >
              <Button color="#942a21" style={styles.buttonInline} title="Set Time" onPress={() => this.showTimepicker()} />
            </View>


          </View>

          <DateTimePicker
            accessibilityLabel="Date Time Picker"
            accessibilityHint="Set the time of your exercises"

            value={this.state.showAdd ? this.state.addDate : this.state.editDate}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={(event, date) => this.onChange(event, date)}
            style={{ width: 250, backgroundColor: "#eeeeee" }}
          />

          <View
            accessible={true}
            accessibilityLabel="Clear Time Settings button"
            onMagicTap={() =>
              Alert.alert("Click to reset to the original time when editing the exercise or the current time when adding an exercise")}>
            <Button

              color="#a1635f" style={styles.buttonInline} title="Clear Time Settings"
              onPress={() => {
                this.state.showAdd ? this.setState({ addDate: new Date() })
                  : this.setState({ editDate: this.state.oriDate })
              }} />
          </View>


          <View style={styles.space}></View>
          <Text >Looks good! Ready to save your work?</Text>
          <View style={styles.spaceSmall} />


          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View
              accessible={true}
              accessibilityLabel="Save button">
              <Button

                color="#942a21" style={styles.buttonInline} title="Save" onPress={() => this.updateExer()} />
            </View>
            <View style={styles.spaceHorizontal} />

            <View
              accessible={true}
              accessibilityLabel="Nevermind button"
              onMagicTap={() => Alert.alert("Click to return to exercise page without adding the exercise")}
            >
              <Button color="#a1635f" style={styles.buttonInline} title="Nevermind" onPress={() => { this.clearUpdate() }} />
            </View>
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

export default ExercisesView;