import FavoritePokemon from '../pages/FavoritePokemon';
import renderWithRouter from '../renderWithRouter';

describe('Teste o componente <FavoritePokemon />', () => {
  it('Se não houver Pokémon favorito, deve exibir a mensagem \'No favorite pokemon found\'', () => {
    const { getByText } = renderWithRouter(<FavoritePokemon />);
    const paragraph = getByText(/no favorite pokémon found/i);

    expect(paragraph).toBeInTheDocument();
  });
  it('Se são exibidos todos os cards de Pokémon favoritados', () => {
    const favoritePokemon = [
      {
        id: 25,
        name: 'Pikachu',
        type: 'Electric',
        averageWeight: {
          value: '6.0',
          measurementUnit: 'kg',
        },
        image: 'https://cdn2.bulbagarden.net/upload/b/b2/Spr_5b_025_m.png',
      },
      {
        id: 4,
        name: 'Charmander',
        type: 'Fire',
        averageWeight: {
          value: '8.5',
          measurementUnit: 'kg',
        },
        image: 'https://cdn2.bulbagarden.net/upload/0/0a/Spr_5b_004.png',
      },
    ];
    const { getByRole, getAllByTestId } = renderWithRouter(
      <FavoritePokemon pokemonList={ favoritePokemon } />,
    );

    const pokemonName = getAllByTestId('pokemon-name');
    const pokemonType = getAllByTestId('pokemon-type');
    const pokemonWeight = getAllByTestId('pokemon-weight');

    favoritePokemon.forEach(({ name, image }, index) => {
      const pokemonImg = getByRole('img', { name: `${name} sprite` });

      expect(pokemonName[index]).toBeInTheDocument();
      expect(pokemonType[index]).toBeInTheDocument();
      expect(pokemonWeight[index]).toBeInTheDocument();
      expect(pokemonImg).toBeInTheDocument();
      expect(pokemonImg.src).toBe(image);
    });
  });
});
