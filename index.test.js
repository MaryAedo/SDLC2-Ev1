// index.test.js

const { greet } = require('./index');

describe('Función greet', () => {
  beforeEach(() => {
    process.env.APP_COLOR = 'Mundo';
  });

  afterEach(() => {
    delete process.env.APP_COLOR;
  });

  test('debe saludar con nombre', () => {
    expect(greet('Desarrollador')).toBe(
      'Hola, Desarrollador! Bienvenido a CI/CD. (Desde Mundo)'
    );
  });

  test('debe saludar por defecto cuando no hay nombre', () => {
    expect(greet()).toBe('Hola! Soy Mundo');
  });
});
