// src/components/LoadingError.tsx
import React from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';

interface Props {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingError: React.FC<Props> = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.text}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar novamente" onPress={onRetry} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingError;