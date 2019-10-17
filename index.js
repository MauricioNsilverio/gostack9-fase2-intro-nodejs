const express = require('express');

const server = express();

server.use(express.json());

// localhost:3000/teste

// route params = /users/1
// query params = ?teste=1
// request body = { "name": "Diego", "email": "diego@rocketseat.com.br" }

// CRUD - CREATE, READ, UPDATE, DELETE

const users = ['Bill Gates', 'Maurício', 'Steve Jobs'];

// Middleware global
server.use((req, res, next) => {
  console.time('Request');
  
  console.log(`Método: ${req.method}; URL: ${req.url};`);

  next();

  console.timeEnd('Request');
  
})

// Middleware local
function checkUsernameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Username is required' });
  }

  return next();
}

// Middleware local para alteração do req
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User doesn't exist" })
  }

  req.user = user; // vai pegar o user que foi passado na req e att o req.user com ele

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  // req.user é o user que o usuário passou através do index na requisição  
  return res.json(req.user);
})

server.post('/users', checkUsernameExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

server.put('/users/:index', checkUsernameExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
})

server.listen(3000);

