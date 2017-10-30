const config = require('./dbConfig.js').postgreSql;
const display = require('./display');
const knex = require('knex')(config);

//promise library for making .all promise
const Promise = require('bluebird');

display.clear();

let pAuthorRows = knex('author').where("id",1).debug(false).then();
let pBookRows = knex('book').where("author_id",1).debug(false).then();

Promise.all([pAuthorRows, pBookRows]).then(function(results){
    let author = results[0][0];
    author.books = results[1];
    display.write(author, "json");
// display.write(author,'json');
})
.finally(function(){
    knex.destroy();
});

