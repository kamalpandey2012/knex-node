const config = require('./dbConfig.js');
const display = require('./display.js');
//it returns a function so passign the configuration to it
let knex = require('knex')(config.postgreSql);
display.clear();

//select statement using promises
let query = knex('book').select('title','rating');

run(query, 'pretty');

function run(knexQuery, mode){
   return knexQuery.then(function(rows){
        display.write(rows, mode);
    })
    .catch(function(err){
        display.write(err);
    })
    .finally(function(){
        display.write('done');
        knex.destroy();
    });
}



