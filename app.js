const config = {
    client: 'sqlite3',
    connection:{
        filename:'./book.sqlite'
    },
    useNullAsDefault: true
};

const configPG = {
    client:'pg',
    connection:{
        host: 'localhost',
        user:'kamalpandey',
        database:'book',
        password:''
    }
};
//it returns a function so passign the configuration to it
let knex = require('knex')(configPG);
//similar to select in sql, selecting title and rating from table book and returning the
//result as a callback method and when returned running the anonymous function that is returning
//node style err and data
knex.select('title','rating').from('book').asCallback(function(err, rows){
  if(err){
      console.error(err);
  }  
  else{
      console.log(rows);
  }
  console.log('completed');
});
knex.destroy(); //close the connection pool
