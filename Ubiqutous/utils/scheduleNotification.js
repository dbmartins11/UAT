import * as Notifications from 'expo-notifications';

export const scheduleTravelReminder = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Ready for your next trip?',
      body: 'Discover a new destination now!',
    },
    trigger: {
      type: 'timeInterval',
      seconds: 300,
      repeats: true,
    },
  });
};
