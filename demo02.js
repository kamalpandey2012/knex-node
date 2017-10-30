const config = require('./dbConfig').postgreSql;
const display = require('./display');

const knex = require('knex')(config);
display.clear();

const wil = {firstname: 'Williom', lastname: 'shakespear'};
const ed = {firstname:'edward', lastname:'maya'};
const dave = {firstname:'dave', lastname:'turner'};
const jack = {firstname:'jack', lastname:'sparrow'};

// deleteRecords();
// createRecords();
updateRecords();

function createRecords(){
knex.insert([wil,ed,dave,jack]).into('author').returning('id').debug(false).then(function(id){
    console.log(id);
    return knex('author').debug(false); //select * from authors
})
.then(function(authors){
    display.write(authors,'pretty');
})
.finally(function(){
    knex.destroy();
});
}


//delete code
function deleteRecords(){
knex('author').where("id", ">",4).del().debug(false).then(function(count){
    console.log(count);
    return knex('author').debug(false);
}).then(function(authors){
    display.write(authors,'pretty');
}).finally(function(){
    knex.destroy();
});
}

//update records
function updateRecords(){
    knex('book').where('author_id',"=",1)
    .update({rating:0}).debug(false)
    .then(function(count){
        console.log(count);
        return knex('book').select("author_id","title","rating").debug(false);
    })
    .then(function(rows){
        display.write(rows,'pretty');
    })
    .finally(function(){
        knex.destroy();
    });
}

