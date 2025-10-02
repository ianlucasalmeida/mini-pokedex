// src/screens/DetailScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, Button } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Pokemon } from '../types/pokemonTypes';

type RootStackParamList = {
  Detail: { pokemon: Pokemon };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { pokemon } = route.params;

  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{pokemon.name}</Text>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text>Sem imagem disponível</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos:</Text>
          <Text style={styles.text}>
            {pokemon.types.map((t) => t.type.name).join(', ')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades:</Text>
          <Text style={styles.text}>
            {pokemon.abilities.map((a) => a.ability.name).join(', ')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats:</Text>
          {pokemon.stats.map((s) => (
            <Text key={s.stat.name} style={styles.statText}>
              {s.stat.name}: {s.base_stat}
            </Text>
          ))}
        </View>
        
        <Button title="Voltar para a Lista" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { alignItems: 'center', padding: 20 },
  name: { fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize', marginBottom: 10 },
  image: { width: 250, height: 250, marginBottom: 20 },
  section: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  text: { fontSize: 16, textTransform: 'capitalize' },
  statText: { fontSize: 16, textTransform: 'capitalize', lineHeight: 24 },
});

export default DetailScreen;