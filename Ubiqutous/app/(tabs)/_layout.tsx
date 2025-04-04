import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';


export default function TabLayout() {

  return (
    <Tabs
      //rinitialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#C4D9FF',
          height: "10%",
        },
      }}
    >

<Tabs.Screen
        name="index"
        options={{
          tabBarStyle: {
            display: 'none',
          },
        }}
      />

<Tabs.Screen
        name="login"
        options={{
          tabBarStyle: {
            display: 'none',
          },
        }}
      />

<Tabs.Screen
        name="register"
        options={{
          tabBarStyle: {
            display: 'none',
          },
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/icons/Home.png')}
              style={{
                width: 24,
                height: 24,
                backgroundColor: focused ? '#A0B5DB' : 'transparent',
                borderRadius: 12,
              }}
            />
          )
        }}
      />

    </Tabs>
  );
}
