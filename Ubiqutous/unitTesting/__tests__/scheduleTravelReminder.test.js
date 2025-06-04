import { scheduleTravelReminder } from '../utils/sendNotification';
import * as Notifications from 'expo-notifications';

// Mock da biblioteca de notificações
jest.mock('expo-notifications', () => ({
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

describe('scheduleTravelReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks antes de cada teste
  });

  it('should cancel all scheduled notifications', async () => {
    await scheduleTravelReminder();
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });

  it('should schedule a notification with correct content and trigger', async () => {
    await scheduleTravelReminder();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Ready for your next trip?',
        body: 'Discover a new destination now!',
      },
      trigger: {
        type: 'timeInterval',
        seconds: 10,
        repeats: true,
      },
    });
  });
});
