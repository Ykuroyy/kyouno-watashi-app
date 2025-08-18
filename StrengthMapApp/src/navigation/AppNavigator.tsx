import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ComparisonScreen from '../screens/ComparisonScreen';

export type RootStackParamList = {
  Home: undefined;
  Question: undefined;
  Result: {assessmentId: string};
  History: undefined;
  Comparison: {currentId: string; previousId: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFB6C1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'わたしの強みマップ'}}
        />
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{title: '自己分析'}}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{title: '分析結果'}}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{title: '過去の結果'}}
        />
        <Stack.Screen
          name="Comparison"
          component={ComparisonScreen}
          options={{title: '成長の変化'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;