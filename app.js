const config = require('./dbConfig.js').postgreSql;
const display = require('./display.js');
const treeize = require('treeize');

//it returns a function so passign the configuration to it
let knex = require('knex')(config);
display.clear();

//select statement using promises
// let query = knex('book').select('title','rating');
let query = knex('book')
.join('author','author.id','=','book.author_id')
.select(
    'author.firstname','author.lastname',
    'book.title as books:title', 'book.rating as books:rating', 'book.id as books:id'
)
.where('author.id',1);

run(query, 'json');

function run(knexQuery, mode){
   return knexQuery.then(function(rows){
       let tree = new treeize();
       tree.grow(rows);
       let authors = tree.getData();
        display.write(authors, mode);
    })
    .catch(function(err){
        display.write(err);
    })
    .finally(function(){
        display.write('done');
        knex.destroy();
    });
}



