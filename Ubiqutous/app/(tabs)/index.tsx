import { Image, StyleSheet, Platform } from 'react-native';



export default function HomeScreen() {
  return (
    <Image
      source={require('../../assets/images/icon.png')}
      style={styles.reactLogo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
