import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from '../../components/ThemeContext'; // Garante que o caminho está certo!


export default function TabLayout() {
  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: "7%",
            paddingTop: '2.5%',
            paddingHorizontal: '7%',
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
                {focused ? (
                  <Image
                    source={require('../../assets/icons/Home-f.png')}
                    style={styles.icon}
                  />
                ) : (
                  <Image
                    source={require('../../assets/icons/Home.png')}
                    style={styles.icon}
                  />
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color, focused }) => (
              <View>
                {focused ? (
                  <Image
                    source={require('../../assets/icons/Profile-f.png')}
                    style={styles.icon}
                  />
                ) : (
                  <Image
                    source={require('../../assets/icons/Profile.png')}
                    style={styles.icon}
                  />
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color, focused }) => (
              <View>
                {focused ? (
                  <Image
                    source={require('../../assets/icons/Search-f.png')}
                    style={styles.icon}
                  />
                ) : (
                  <Image
                    source={require('../../assets/icons/Search.png')}
                    style={styles.icon}
                  />
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: " ", 
            tabBarIcon: ({ color, focused }) => (
              <View>
                {focused ? (
                  <Image
                    source={require('../../assets/icons/Settings-f.png')}
                    style={styles.icon}
                  />
                ) : (
                  <Image
                    source={require('../../assets/icons/Settings.png')}
                    style={styles.icon}
                  />
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            href: null,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            href: null,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="city"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="country"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="lists"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="editprofile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="monument"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}

const styles = {
  icon: {
    width: 40,
    height: 40,
  },
};
