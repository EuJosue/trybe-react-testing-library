import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from '../renderWithRouter';

describe('Testa o componente <App />', () => {
  it('Há 3 links fixos de navegação', () => {
    const { getByRole } = renderWithRouter(<App />);
    const linkHome = getByRole('link', { name: 'Home' });
    const linkAbout = getByRole('link', { name: 'About' });
    const linkFavoritePokemon = getByRole('link', { name: 'Favorite Pokémon' });

    expect(linkHome).toBeInTheDocument();
    expect(linkAbout).toBeInTheDocument();
    expect(linkFavoritePokemon).toBeInTheDocument();
  });

  it('Ao clicar no link \'Home\' deverá ser redirecionado para a URL \'/\'', () => {
    const { getByRole, history } = renderWithRouter(<App />);
    const linkHome = getByRole('link', { name: 'Home' });

    userEvent.click(linkHome);

    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });

  it('Ao clicar no link \'About\' deverá ser redirecionado para a URL \'/about\'', () => {
    const { getByRole, history } = renderWithRouter(<App />);
    const linkAbout = getByRole('link', { name: 'About' });

    userEvent.click(linkAbout);

    const { pathname } = history.location;
    expect(pathname).toBe('/about');
  });

  it('Ao clicar no link \'Favorite Pokémon\' deverá ser redirecionado para a URL \'/favorites\'', () => {
    const { getByRole, history } = renderWithRouter(<App />);
    const linkFavoritePokemon = getByRole('link', { name: 'Favorite Pokémon' });

    userEvent.click(linkFavoritePokemon);

    const { pathname } = history.location;
    expect(pathname).toBe('/favorites');
  });

  it('Ao entrar em uma URL desconhecida deverá ser redirecionado para a página Not Found', () => {
    const { getByRole, history } = renderWithRouter(<App />);

    act(() => history.push('/página-que-não-existe'));

    const title = getByRole('heading', {
      level: 2,
      name: 'Page requested not found',
    });

    expect(title).toBeInTheDocument();
  });
});
