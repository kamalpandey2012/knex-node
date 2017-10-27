const config = require('./dbConfig.js');
const display = require('./display.js');
//it returns a function so passign the configuration to it
let knex = require('knex')(config.postgreSql);

display.clear();

//similar to select in sql, selecting title and rating from table book and returning the
//result as a callback method and when returned running the anonymous function that is returning
//node style err and data
knex.select('title','rating').from('book').asCallback(function(err, rows){
  if(err){
      console.error(err);
  }  
  else{
      display.write(rows, 'pretty');
  }
  knex.destroy();
  console.log('completed');
});

