import * as Notifications from 'expo-notifications';
import { getCurrentLanguage, translate } from './languageUtils';

export const sendLocalNotification = async (itemType) => {
  const lang = await getCurrentLanguage();

  let messageKey = '';
  switch (itemType.toLowerCase()) {
    case 'city':
      messageKey = 'Cmessage';
      break;
    case 'monument':
      messageKey = 'Mmessage';
      break;
    case 'country':
    default:
      messageKey = 'CountryMessage';
      break;
  }

  const message = translate(messageKey, lang);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: translate('success', lang),
      body: message,
    },
    trigger: null, 
  });
};
