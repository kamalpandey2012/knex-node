const config = require('./dbConfig.js');
const display = require('./display.js');
//it returns a function so passign the configuration to it
let knex = require('knex')(config.postgreSql);
display.clear();

//select statement using promises
knex.select('title','rating').from('book')
.then(function(rows){
    display.write(rows, 'pretty');
})
.catch(function(err){
    display.write(err);
})
.finally(function(){
    knex.destroy();
});

