const { connect, connection } = require('mongoose');
require('dotenv').config();


const connectionString = process.env.MONGOURI 

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;