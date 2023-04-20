const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const ehb = require("express-handlebars");

// Configurando o bodyParser para poder utilizar o req.body
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando a conexão com o MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'meudbteste'
});

app.use(express.json());
app.use(express.static('public'));

// Verificando se a conexão com o MySQL foi estabelecida com sucesso
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.engine('handlebars', ehb.engine());
app.set('view engine', 'handlebars');
app.use(
    express.urlencoded({
        extended: true,
    })
);

function verify(req, res, next)
{
  var sesseion = req.sesseion;
  if (req.sesseion == true)
  {
    next();
  }
}


// Rota para fazer o login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const sql = `SELECT * FROM usuarios WHERE username = '${username}' AND password = '${password}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.render('homepage')
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.get("/", async (req, res, next) =>{

    res.render("home");


});


app.get("/homepage", verify, async (req, res, next) =>{

    res.render("homepage");


});
const port = 3000;
// Iniciando o servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});