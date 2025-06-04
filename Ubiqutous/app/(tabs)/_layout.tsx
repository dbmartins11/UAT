import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, Image, View } from 'react-native';
import { ThemeProvider } from '../../components/ThemeContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Função para agendar notificação a cada 5 minutos
const scheduleTravelReminder = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync(); // Evita duplicação

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Ready for your next trip?',
      body: 'Discover a new destination now!',
    },
    trigger: {
      seconds: 300, // 5 minutos
      repeats: true,
    },
  });
};

export default function TabLayout() {
  useEffect(() => {
    const registerForNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.warn('Notification permission not granted.');
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        await scheduleTravelReminder(); // Agendar notificação recorrente
      } else {
        console.warn('Must use physical device for notifications');
      }
    };

    registerForNotifications();
  }, []);

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: '7%',
            paddingTop: '2.5%',
            paddingHorizontal: '7%',
            backgroundColor: '#C4D9FF',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: ' ',
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={
                    focused
                      ? require('../../assets/icons/Home-f.png')
                      : require('../../assets/icons/Home.png')
                  }
                  style={styles.icon}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: ' ',
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={
                    focused
                      ? require('../../assets/icons/Profile-f.png')
                      : require('../../assets/icons/Profile.png')
                  }
                  style={styles.icon}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            tabBarLabel: ' ',
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={
                    focused
                      ? require('../../assets/icons/Search-f.png')
                      : require('../../assets/icons/Search.png')
                  }
                  style={styles.icon}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: ' ',
            tabBarIcon: ({ focused }) => (
              <View>
                <Image
                  source={
                    focused
                      ? require('../../assets/icons/Settings-f.png')
                      : require('../../assets/icons/Settings.png')
                  }
                  style={styles.icon}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen name="index" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        <Tabs.Screen name="login" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        <Tabs.Screen name="register" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        <Tabs.Screen name="city" options={{ href: null }} />
        <Tabs.Screen name="country" options={{ href: null }} />
        <Tabs.Screen name="lists" options={{ href: null }} />
        <Tabs.Screen name="editprofile" options={{ href: null }} />
        <Tabs.Screen name="monument" options={{ href: null }} />
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
