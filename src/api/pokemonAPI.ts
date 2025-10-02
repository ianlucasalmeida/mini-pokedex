// src/api/pokemonAPI.ts

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const fetchPokemonList = async (offset = 0, limit = 20) => {
  const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar a lista de Pokémon.');
  }
  return response.json();
};

export const fetchPokemonByName = async (name: string) => {
  const response = await fetch(`${API_URL}/${name}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Pokémon não encontrado.');
    }
    throw new Error('Erro ao buscar o Pokémon.');
  }
  return response.json();
};