import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import pokemonList from '../data';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

describe('Teste o componente <PokemonDetails />', () => {
  it('Se as informações detalhadas do Pokémon selecionado são mostradas na tela', () => {
    const { getByRole, queryByRole, getByText, history } = renderWithRouter(<App />);
    pokemonList.forEach(({ id, name, summary }) => {
      act(() => history.push(`/pokemon/${id}`));
      const pokemonDetails = getByRole('heading', {
        name: `${name} Details`,
        level: 2,
      });
      const pokemonSummary = getByRole('heading', {
        name: /summary/i,
        level: 2,
      });
      const navLink = queryByRole('link', { name: /more details/i });
      const pokemonDescription = getByText(summary);

      expect(navLink).not.toBeInTheDocument();
      expect(pokemonDetails).toBeInTheDocument();
      expect(pokemonSummary).toBeInTheDocument();
      expect(pokemonDescription).toBeInTheDocument();
    });
  });

  it('Se existe na página uma seção com os mapas contendo as localizações do Pokémon', () => {
    const { getByRole, getAllByAltText, getByText, history } = renderWithRouter(<App />);
    pokemonList.forEach(({ id, name, foundAt }) => {
      act(() => history.push(`/pokemon/${id}`));
      const pokemonLocations = getByRole('heading', {
        name: /Game Locations of /i,
        level: 2,
      });
      const locationsImages = getAllByAltText(`${name} location`);
      const locationsNames = foundAt.map(({ location }) => (
        getByText(location)
      ));

      expect(pokemonLocations).toBeInTheDocument();
      expect(locationsImages).toHaveLength(foundAt.length);
      expect(locationsNames).toHaveLength(foundAt.length);

      foundAt.forEach(({ location, map }, index) => {
        expect(locationsImages[index].src).toBe(map);
        expect(locationsImages[index].alt).toBe(`${name} location`);
        expect(locationsNames[index]).toHaveTextContent(location);
      });
    });
  });

  it('Se o usuário pode favoritar um Pokémon através da página de detalhes', () => {
    const { getByRole, history } = renderWithRouter(<App />);
    pokemonList.forEach(({ id }) => {
      act(() => history.push(`/pokemon/${id}`));
      const favoriteCheckbox = getByRole('checkbox', { name: /pokémon favoritado\?/i });

      expect(favoriteCheckbox).toBeInTheDocument();
      expect(favoriteCheckbox.parentNode).toHaveTextContent('Pokémon favoritado?');

      userEvent.click(favoriteCheckbox);

      expect(favoriteCheckbox).toBeChecked();

      userEvent.click(favoriteCheckbox);

      expect(favoriteCheckbox).not.toBeChecked();
    });
  });
});
