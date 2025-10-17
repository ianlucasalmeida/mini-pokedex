// src/screens/DetailScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Pokemon } from '../types/pokemonTypes';

type RootStackParamList = {
  Detail: { pokemon: Pokemon };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const TYPE_COLORS: { [key: string]: string } = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { pokemon } = route.params;

  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const backgroundColor = TYPE_COLORS[primaryType] || '#A8A878';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header com gradiente */}
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(3, '0')}</Text>
          <Text style={styles.name}>{pokemon.name}</Text>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Sem imagem disponível</Text>
            </View>
          )}
        </View>

        {/* Card de informações */}
        <View style={styles.infoCard}>
          {/* Tipos */}
          <View style={styles.typesContainer}>
            {pokemon.types.map((t, index) => (
              <View
                key={index}
                style={[
                  styles.typeBadge,
                  { backgroundColor: TYPE_COLORS[t.type.name] || '#A8A878' },
                ]}
              >
                <Text style={styles.typeBadgeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>

          {/* Sobre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Altura:</Text>
              <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso:</Text>
              <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
            </View>
          </View>

          {/* Habilidades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.abilitiesContainer}>
              {pokemon.abilities.map((a, index) => (
                <View key={index} style={styles.abilityChip}>
                  <Text style={styles.abilityText}>{a.ability.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estatísticas Base</Text>
            {pokemon.stats.map((s, index) => {
              const statPercentage = (s.base_stat / 255) * 100;
              return (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>{s.stat.name}</Text>
                  <Text style={styles.statValue}>{s.base_stat}</Text>
                  <View style={styles.statBarBackground}>
                    <View
                      style={[
                        styles.statBarFill,
                        {
                          width: `${statPercentage}%`,
                          backgroundColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pokemonId: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  image: {
    width: 200,
    height: 200,
  },
  noImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: 'white',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  abilityChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  abilityText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    width: 120,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginLeft: 10,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default DetailScreen;