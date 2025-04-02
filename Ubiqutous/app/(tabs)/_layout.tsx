import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';



export default function TabLayout() {
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#098AC8',
          height: "10%",
        },
      }}>
      <Tabs.Screen
        name="index"
       
      />
      
    </Tabs>
  );
}
