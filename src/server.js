const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const routes = require("./routes");

const app = express();

require("./database/database"); // Conexão com banco de dados

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes);

app.listen(3333);
