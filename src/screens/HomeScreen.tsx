// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
      setSearchQuery(''); // Limpa a busca após o sucesso
    } catch (e: any) {
      setError(e.message || 'Erro na busca.');
      setPokemonList([]); // Limpa a lista em caso de erro na busca
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: PokemonListItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSearchByName(item.name)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Helper para navegar ao clicar no item da lista
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome (ex: pikachu)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        <Button title="Buscar" onPress={handleSearch} />
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
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum Pokémon encontrado.</Text>
          }
        />
      )}

      {!searchQuery && !loading && !error && pokemonList.length > 0 && (
        <View style={styles.pagination}>
          <Button
            title="Anterior"
            onPress={() => loadPokemon(Math.max(0, offset - 20))}
            disabled={offset === 0}
          />
          <Button title="Próxima" onPress={() => loadPokemon(offset + 20)} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  list: { paddingBottom: 20 },
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemText: { fontSize: 18, textTransform: 'capitalize' },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;