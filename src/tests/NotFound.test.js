import NotFound from '../pages/NotFound';
import renderWithRouter from '../renderWithRouter';

describe('Teste o componente <NotFound />', () => {
  it('Se a página contém um heading \'h2\' com o texto \'Page requested not found\'', () => {
    const { getByRole } = renderWithRouter(<NotFound />);
    const title = getByRole('heading', {
      name: /page requested not found/i,
      level: 2,
    });

    expect(title).toBeInTheDocument();
  });
  it('Se a página mostra a imagem \'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif\'', () => {
    const { getByRole } = renderWithRouter(<NotFound />);
    const img = getByRole('img', {
      name: /pikachu crying because the page requested was not found/i,
    });
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
