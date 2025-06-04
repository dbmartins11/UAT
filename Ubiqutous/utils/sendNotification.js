// utils/sendNotification.js
import * as Notifications from 'expo-notifications';

export async function sendLocalNotification(destinationName) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Destination added!',
      body: `${destinationName} added to your list with success`,
      sound: 'default', // (opcional, mas pode ativar som se configurado)
    },
    trigger: null,
    // 💡 Para Android, garantir que usa o canal criado no layout
    android: {
      channelId: 'default',
    },
  });
}
