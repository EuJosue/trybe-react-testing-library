import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Pokemon from '../components/Pokemon';
import pokemonList from '../data';
import Pokedex from '../pages/Pokedex';
import renderWithRouter from '../renderWithRouter';

const isPokemonFavoriteById = {
  4: true,
  10: true,
  23: false,
  25: false,
  65: false,
  78: false,
  143: false,
  148: false,
  151: false,
};

describe('Teste o componente <Pokemon />', () => {
  it('se é renderizado um card com as informações de determinado Pokémon', () => {
    const { getByRole, getByTestId } = renderWithRouter(
      <Pokemon
        pokemon={ pokemonList[0] }
        isFavorite={ false }
      />,
    );

    const { name, type, image,
      averageWeight: { value, measurementUnit } } = pokemonList[0];

    const pokemonName = getByTestId('pokemon-name');
    const pokemonType = getByTestId('pokemon-type');
    const pokemonWeight = getByTestId('pokemon-weight');
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
    expect(pokemonImg.alt).toBe(`${name} sprite`);
  });

  it('se o card do Pokémon indicado na Pokédex contém um link de navegação para exibir detalhes deste Pokémon.', () => {
    const { getByRole } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const moreDetailsLink = getByRole('link', { name: /more details/i });
    const nextButton = getByRole('button', {
      name: /próximo pokémon/i,
    });

    pokemonList.forEach(({ id }) => {
      expect(moreDetailsLink).toBeInTheDocument();
      expect(moreDetailsLink.href).toContain(`/pokemon/${id}`);
      userEvent.click(nextButton);
    });
  });

  it('se ao clicar no link \'More details\', é feito o redirecionamento para a página de detalhes do Pokémon', () => {
    const { getByRole, history } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const moreDetailsLink = getByRole('link', { name: /more details/i });

    userEvent.click(moreDetailsLink);

    const { pathname } = history.location;

    expect(pathname).toContain(`/pokemon/${pokemonList[0].id}`);
  });

  it('se a URL exibida no navegador muda para \'/pokemon/<id>\', onde <id> é o id do Pokémon cujos detalhes se deseja ver', () => {
    const { getByRole, history } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );
    const moreDetailsLink = getByRole('link', { name: /more details/i });
    const nextPokemonButton = getByRole('button', { name: /próximo pokémon/i });

    pokemonList.forEach(({ id }) => {
      userEvent.click(moreDetailsLink);
      userEvent.click(nextPokemonButton);

      const { pathname } = history.location;

      expect(pathname).toBe(`/pokemon/${id}`);

      act(() => history.push('/'));
    });
  });

  it('se existe um ícone de estrela nos Pokémon favoritados', () => {
    const { getByRole } = renderWithRouter(
      <Pokedex
        pokemonList={ pokemonList }
        isPokemonFavoriteById={ isPokemonFavoriteById }
      />,
    );

    const nextPokemonButton = getByRole('button', { name: /próximo pokémon/i });

    pokemonList.forEach(({ name, id }) => {
      if (isPokemonFavoriteById[id]) {
        const favoriteStar = getByRole('img', { name: `${name} is marked as favorite` });
        expect(favoriteStar.src).toContain('/star-icon.svg');
        expect(favoriteStar.alt).toBe(`${name} is marked as favorite`);
      }

      userEvent.click(nextPokemonButton);
    });
  });
});
