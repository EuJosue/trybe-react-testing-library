import renderWithRouter from '../renderWithRouter';
import About from '../pages/About';

describe('Testa o componente <About />', () => {
  it('Contém as informações sobre a Pokédex', () => { });
  it('Contém um heading \'h2\' com o texto \'About Pokédex\'', () => {
    const { getByRole } = renderWithRouter(<About />);
    const title = getByRole('heading', { name: 'About Pokédex' });

    expect(title).toBeInTheDocument();
  });
  it('Contém dois parágrafos com textos sobre a Pokédex', () => {
    const { getByText } = renderWithRouter(<About />);
    const firstParagraph = getByText(/this application simulates a pokédex, a digital encyclopedia containing all pokémon/i);
    const secondParagraph = getByText(/one can filter pokémon by type, and see more details for each one of them/i);

    expect(firstParagraph).toBeInTheDocument();
    expect(secondParagraph).toBeInTheDocument();
  });
  it('Contém a seguinte imagem esperada de uma Pokédex', () => {
    const { getByRole } = renderWithRouter(<About />);
    const img = getByRole('img', { name: 'Pokédex' });

    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});
