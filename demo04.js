const config = require('./dbConfig').postgreSql;
const display = require('./display');
const knex = require('knex')(config);

display.clear();
const doc = {firstname:'Dr', lastname:'sess'};
const books = [
    {title: "The cat in the hat", rating: 1},
    {title:"The another world", rating:100}
];

knex.transaction(function(trx){
    return trx 
    .insert(doc, "id").into("author")
    .then(function(idArray){
        let authorId = idArray[0];
        for(let i=0; i<books.length; i++){
            books[i].author_id = authorId;
        }
        return trx.insert(books).into('book');
    });
}).then(function(){
    display.write(books.length + ' books Added', "pretty");
}).catch(function(err){
    console.error(err);
}).finally(function(){
    knex.destroy();
});
