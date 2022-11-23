import userEvent from '@testing-library/user-event';
import pokemonList from '../data';
import Pokedex from '../pages/Pokedex';
import renderWithRouter from '../renderWithRouter';

const isPokemonFavoriteById = {
  4: false,
  10: false,
  23: false,
  25: false,
  65: false,
  78: false,
  143: false,
  148: false,
  151: false,
};

describe('Teste o componente <Pokedex />', () => {
  it('Se a página contém um heading \'h2\' com o texto \'Encountered Pokémon\'', () => {
    const { getByRole } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );
    const title = getByRole('heading', {
      name: /encountered pokémon/i,
      level: 2,
    });

    expect(title).toBeInTheDocument();
  });

  it('Se é exibido o próximo Pokémon da lista quando o botão \'Próximo Pokémon\' é clicado', () => {
    const { getByRole, getByTestId } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const firstTwoPokemon = pokemonList.slice(0, 2);
    const nextPokemonButton = getByRole('button', { name: /próximo pokémon/i });
    const pokemonName = getByTestId('pokemon-name');
    const pokemonType = getByTestId('pokemon-type');

    firstTwoPokemon.forEach((
      {
        name,
        type,
        image,
      },
    ) => {
      const pokemonImg = getByRole('img', { name: `${name} sprite` });

      expect(pokemonName).toBeInTheDocument();
      expect(pokemonName).toHaveTextContent(name);

      expect(pokemonType).toBeInTheDocument();
      expect(pokemonType).toHaveTextContent(type);

      expect(pokemonImg).toBeInTheDocument();
      expect(pokemonImg.src).toBe(image);

      userEvent.click(nextPokemonButton);
    });
  });

  it('Se é mostrado apenas um Pokémon por vez', () => {
    const { getByRole, getByTestId } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const nextPokemonButton = getByRole('button', { name: /próximo pokémon/i });
    const pokemonName = getByTestId('pokemon-name');
    const pokemonType = getByTestId('pokemon-type');
    const pokemonWeight = getByTestId('pokemon-weight');

    pokemonList.forEach((
      {
        name,
        type,
        image,
        averageWeight: { measurementUnit, value } },
    ) => {
      const pokemonImg = getByRole('img', { name: `${name} sprite` });

      expect(pokemonName).toBeInTheDocument();
      expect(pokemonName).toHaveTextContent(name);

      expect(pokemonType).toBeInTheDocument();
      expect(pokemonType).toHaveTextContent(type);

      expect(pokemonWeight).toBeInTheDocument();
      expect(pokemonWeight).toHaveTextContent(
        `Average weight: ${value} ${measurementUnit}`,
      );

      expect(pokemonImg).toBeInTheDocument();
      expect(pokemonImg.src).toBe(image);

      userEvent.click(nextPokemonButton);
    });
  });
  it('Se a Pokédex tem os botões de filtro', () => {
    const types = [...new Set(
      pokemonList.reduce((array, { type }) => [...array, type], []),
    )];

    const { getAllByTestId, getByRole, getByText } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const nextButton = getByRole('button', { name: /próximo pokémon/i });
    const buttons = getAllByTestId('pokemon-type-button');
    const allButton = getByRole('button', { name: /all/i });

    expect(buttons).toHaveLength(types.length);

    types.forEach((type) => {
      const typeButton = getByRole('button', { name: type });
      const filteredPokemon = pokemonList.filter((pokemon) => pokemon.type === type);

      expect(allButton).toBeInTheDocument();
      expect(typeButton).toBeInTheDocument();

      userEvent.click(typeButton);

      filteredPokemon.forEach(({ name }) => {
        const pokemon = getByText(name);
        expect(pokemon).toBeInTheDocument();
        userEvent.click(nextButton);
      });
    });
  });
  it('Se a Pokédex contém um botão para desativar o filtro', () => {
    const { getByRole, getByText } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const allButton = getByRole('button', { name: /all/i });
    const nextButton = getByRole('button', { name: /próximo pokémon/i });

    expect(allButton).toBeInTheDocument();

    userEvent.dblClick(allButton);

    pokemonList.forEach(({ name }) => {
      const pokemon = getByText(name);

      expect(pokemon).toBeInTheDocument();
      expect(pokemon).toHaveTextContent(name);

      userEvent.click(nextButton);
    });
  });
});
