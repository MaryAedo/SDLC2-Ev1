const express = require('express');
const app = express();
const port = 3000;

function greet(name) {
  const appColor = process.env.APP_COLOR || 'TechMarket';
  if (!name) return `Hola! Soy ${appColor}`;
  return `Hola, ${name}! Bienvenido a CI/CD. (Desde ${appColor})`;
}

module.exports = { greet };

app.get('/', (req, res) => {
  res.send(greet(req.query.name));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Aplicación escuchando en http://localhost:${port}`);
  });
}
