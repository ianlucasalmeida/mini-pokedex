// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pokemon, PokemonListItem } from '../types/pokemonTypes';
import { fetchPokemonList, fetchPokemonByName } from '../api/pokemonAPI';
import LoadingError from '../components/LoadingError';

type RootStackParamList = {
  Home: undefined;
  Detail: { pokemon: Pokemon };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const loadPokemon = useCallback(async (newOffset: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonList(newOffset);
      setPokemonList(data.results);
      setOffset(newOffset);
    } catch (e) {
      setError('Não foi possível carregar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon(0);
  }, [loadPokemon]);

  const handleSearch = async () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      loadPokemon(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonByName(query);
      navigation.navigate('Detail', { pokemon: data });
      setSearchQuery('');
    } catch (e: any) {
      setError(e.message || 'Erro na busca.');
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonByName(name);
      navigation.navigate('Detail', { pokemon: data });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonId = (url: string) => {
    const id = url.split('/').filter(Boolean).pop();
    return id ? String(id).padStart(3, '0') : '???';
  };

  const renderItem = ({ item }: { item: PokemonListItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSearchByName(item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.pokemonInfo}>
          <Text style={styles.pokemonId}>#{getPokemonId(item.url)}</Text>
          <Text style={styles.pokemonName}>{item.name}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#EF5350" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <Text style={styles.headerSubtitle}>Busque e descubra Pokémons</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Buscar Pokémon..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                loadPokemon(0);
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        )}
      </View>

      <LoadingError
        loading={loading}
        error={error}
        onRetry={() => (searchQuery ? handleSearch() : loadPokemon(offset))}
      />

      {!loading && !error && (
        <FlatList
          data={pokemonList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Nenhum Pokémon encontrado</Text>
              <Text style={styles.emptySubtext}>Tente buscar por outro nome</Text>
            </View>
          }
        />
      )}

      {!searchQuery && !loading && !error && pokemonList.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, offset === 0 && styles.paginationButtonDisabled]}
            onPress={() => loadPokemon(Math.max(0, offset - 20))}
            disabled={offset === 0}
            activeOpacity={0.7}
          >
            <Text style={[styles.paginationButtonText, offset === 0 && styles.paginationButtonTextDisabled]}>
              ← Anterior
            </Text>
          </TouchableOpacity>
          
          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {Math.floor(offset / 20) + 1}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => loadPokemon(offset + 20)}
            activeOpacity={0.7}
          >
            <Text style={styles.paginationButtonText}>Próxima →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#EF5350',
    paddingVertical: 25,
    paddingHorizontal: 20,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },
  searchButton: {
    backgroundColor: '#EF5350',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonId: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  paginationButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#EF5350',
    minWidth: 120,
  },
  paginationButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  paginationButtonTextDisabled: {
    color: '#999',
  },
  pageIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;