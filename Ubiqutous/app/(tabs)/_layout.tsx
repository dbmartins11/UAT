import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, View } from 'react-native';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: "10%",
          backgroundColor: '#C4D9FF',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ color, focused }) => (
            <View>
            {focused
              ? <Image
              source={require('../../assets/icons/Home-f.png')}
              style = {styles.icon}
            />
              : <Image
              source={require('../../assets/icons/Home.png')}
              style = {styles.icon}
            />
            }
            
          </View>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ color, focused }) => (
            <View>
              {focused
                ? <Image
                source={require('../../assets/icons/Profile-f.png')}
                style = {styles.icon}
              />
                : <Image
                source={require('../../assets/icons/Profile.png')}
                style = {styles.icon}
              />
              }
              
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          //tabBarStyle: { display: "none" }
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          href: null,
          tabBarStyle: { display: "none" }
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          href: null,
          tabBarStyle: { display: "none" }
        }}
      />
    </Tabs>
  );
}

const styles = {
  icon: {
    width:40,
    height: 40,
  }
}
