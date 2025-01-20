const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Session Middleware
app.use(session({
  secret: 'deinGeheimerSchlüssel', // Ein geheimer Schlüssel für die Session
  resave: false,
  saveUninitialized: true
}));

// Middleware, um die POST-Daten zu parsen
app.use(bodyParser.urlencoded({ extended: true }));

const validEmail = 'anna@anna.de';
const validPassword = '1234';

// Login-Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === validEmail && password === validPassword) {
    // Erfolgreiches Login - Session speichern
    req.session.loggedIn = true; // Session-Flag setzen
    req.session.email = email;   // Speichert die E-Mail in der Session
    res.redirect('/secret');     // Weiterleitung zur geheimen Seite
  } else {
    // Ungültige Anmeldedaten
    res.send('Ungültige Anmeldedaten!');
  }
});

// Geheime Seite - nur zugänglich für angemeldete Benutzer
app.get('/secret', (req, res) => {
  if (req.session.loggedIn) {
    // Wenn der Benutzer eingeloggt ist, geheime Informationen anzeigen
    res.send(`
      <html>
        <head><title>Geheime Seite</title></head>
        <body>
          <h1>Willkommen auf der geheimen Seite!</h1>
          <p>Hier sind einige Informationen über mich:</p>
          <ul>
            <li>Name: Anna</li>
            <li>Hobby: Programmieren</li>
            <li>Beruf: Softwareentwicklerin</li>
          </ul>
          <p>Du bist eingeloggt als: ${req.session.email}</p>
          <a href="/logout">Logout</a>
        </body>
      </html>
    `);
  } else {
    // Wenn der Benutzer nicht eingeloggt ist, wird er auf die Login-Seite umgeleitet
    res.redirect('/');
  }
});

// Logout-Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/secret');
    }
    res.redirect('/'); // Nach Logout zurück zur Login-Seite
  });
});

// Startseite mit Login-Formular
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Login</title></head>
      <body>
        <h2>Login</h2>
        <form action="/login" method="POST">
          <label for="email">Email:</label>
          <input type="email" name="email" required><br>
          <label for="password">Password:</label>
          <input type="password" name="password" required><br>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

