// App.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#EF5350" />
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.pokeball}>
          <View style={styles.pokeballTop} />
          <View style={styles.pokeballCenter}>
            <View style={styles.pokeballButton} />
          </View>
          <View style={styles.pokeballBottom} />
        </View>
        <Text style={styles.splashTitle}>Pokédex</Text>
        <Text style={styles.splashSubtitle}>Carregando...</Text>
      </Animated.View>
    </View>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return <SplashScreen onFinish={() => setIsReady(true)} />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: '#EF5350',
          background: '#f5f5f5',
          card: '#ffffff',
          text: '#333333',
          border: '#e0e0e0',
          notification: '#EF5350',
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: 'normal' as 'normal',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500' as '500',
          },
          light: {
            fontFamily: 'System',
            fontWeight: '300' as '300',
          },
          thin: {
            fontFamily: 'System',
            fontWeight: '100' as '100',
          },
        },
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#EF5350" />
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#EF5350',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  pokeball: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  pokeballTop: {
    width: 120,
    height: 60,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomWidth: 3,
    borderBottomColor: '#333',
  },
  pokeballCenter: {
    width: 120,
    height: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -3,
  },
  pokeballButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#333',
  },
  pokeballBottom: {
    width: 120,
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    borderTopWidth: 3,
    borderTopColor: '#333',
    marginTop: -3,
  },
  splashTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  splashSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});