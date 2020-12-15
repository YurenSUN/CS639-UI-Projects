import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import ProfileView from './ProfileView'
import MealsView from './MealsView'

class TabsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    let tabs = createBottomTabNavigator();

    return (
      < tabs.Navigator 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Today') {
                iconName = "ios-calendar";
              } else if (route.name === 'Exercises') {
                iconName = "ios-walk";
              } else if (route.name === 'Profile') {
                iconName = "ios-person";
              } else if (route.name === 'Meals'){
                iconName = "ios-pizza"
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#942a21',
            inactiveTintColor: 'gray',
          }}>
        <>
          {/* today's view */}
          <tabs.Screen name="Today">
            {(props) => <TodayView {...props} username={this.props.username} accessToken={this.props.accessToken} />}
          </tabs.Screen>

          {/* exercises */}
          <tabs.Screen name="Exercises">
            {(props) => <ExercisesView {...props} username={this.props.username} accessToken={this.props.accessToken} />}
          </tabs.Screen>

          {/* exercises */}
          <tabs.Screen name="Meals">
            {(props) => <MealsView {...props} username={this.props.username} accessToken={this.props.accessToken} />}
          </tabs.Screen>

          {/* profile */}
          <tabs.Screen name="Profile">
            {(props) => <ProfileView {...props} username={this.props.username} accessToken={this.props.accessToken} />}
          </tabs.Screen>
        </>
      </tabs.Navigator >
    )
  }
}

export default TabsView;