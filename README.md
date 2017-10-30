# Data access in Node using Knex
## Course Outline
1. Introduction
    - What is knex?
    - Setup and configuration
    - Write some code
    - Database Options
2. Building queries
    - Query builder in detail
    - Quick fire demos
    - Object graphs / eager loading
3. Schema, migration and seeding 
    - Schema building 
    - Knex cli
    - Migrations
    - Seeding
4. Real world data access
    - Write data access code

## Preq
    - Nodejs (Course coming soon)
    - Relational database (Course coming soon)
# 1. Introduction    
## 1.1 What is Knex
Knex is a data access library helping to work with relational databases using node. It provides you with a lot of great features like
- Connection pooling
- Database Migration
- Data seeding
- Protect against SQL injection
- Transactions
- Callbacks promises streams and more
In short it is a **Query builder schema builder and standarize** database connections. example

mysql code
```
CREATE TABLE item(
    id INT NOT NULL AUTO_INCREMENT
)
```
postgres code
```
CREATE TABLE item(
    id SERIAL
);
```
knex standarized format 
```
knex.schema.createTable('item', function(table){
    table.increments();
});
```
## 1.2 Adding knex to node project
1. install knex `npm install knex --save`
2. Install appropriate database library
    - PostGreSql - `npm install pg`
    - SQlite - `npm install sqlite3`
    - MYSql - `npm install mysql`
    - Mariadb - `npm install mariasql`
    - oracle - `npm install strong-oracle`

In our case we will install knex, pg and sqlite3
`npm install --save knex pg sqlite3`

## 1.3 Starting the knex project
create file app.js at root of folder
with following code in it
```
const config = {
    client: 'sqlite3',
    connection:{
        filename:'./book.sqlite'
    },
    useNullAsDefault: true
}
//it returns a function so passign the configuration to it
let knex = require('knex')(config);
console.log('completed');
```
now run using `node app.js`
Usually u could set connection pool size by using 
```
pool:{min:1, max: 10}
```
inside the configuration object
## 1.4 First Query
The book database consist of two tables author table and book table written by author
Both tables has autoincrement id key and book table has a foreign key author_id to point back to author table. 
The table structure consists of 

author
- id
- firstname
- lastname

book
- id
- author_id
- title
- rating

1 to many relationship between the author table and the book table that means one author could have many books but book only has one author
### Setting the query for sqlite

```
knex.select('title', 'rating').from('book').asCallback(function(err, rows){
if(err){
    console.error(err);
}
else{
    console.log(rows);
}
});
```
now run the program
### Setting the query with postgresql

1. pull the book.sql file from github or download files
3. change the config object for postgresql
```
const configPG = {
    client:'pg',
    connection:{
        host: 'localhost',
        user:'kamalpandey',
        database:'book',
        password:''
    }
};
let knex = require('knex')(configPG);
```
Run the application it should show the result as previously shown

**commit**

## 1.5 Options for databases
1. SQlite
2. MySql
3. PostgreSql
4. Oracle

### 1.5.1 Sqlite
- No separate server process
- In-Process library that writes directly to file

#### Used in 
- All Android devices 
- IOS devices
- Mac
- Firefox, chrome and safari
- Skype, itunes etc
- Televisions, cars etc
Most used database among all dbs

#### When not to use
- Concurrent application use
- Many concurrent write ops

#### Sqlite for developement
- No setup
- Copy deployement
- Source Control

### 1.5.2 MySql
- Most popular open source client/server relational database
- Used by facebook, twitter, youtube and yahoo
- Currently owned by Oracle
- Dual licensed (Open source and commercial)

### 1.5.3 MariaDb
- Forked from mySql
- Drop-in replacement of MySql
- Entirely open source
- GPL2 Licenced (read licensing types)

### 1.5.4 PostGreSQL
- Huge feature list
- Rich datatype support
- Support over a dozen language
- Strongly confirms to ANSI-SQL 2008 standards
- Run on all major OS

### 1.5.5 Oracle
- Very popular closed source DB
- Expensive license required
- Outstanding feature set

## 1.6 Setup Your Development
1. Writing configurations in separate file
    - Create db_config.js file at root of the application
    - Copy the configuration code from app.js to this file in this format
```
    let config = {
    sqlite: {
        client: 'sqlite3',
        connection:{
            filename:'./book.sqlite'
        },
        useNullAsDefault: true 
    },
    postgreSql: {
        client:'pg',
        connection:{
            host: 'localhost',
            user:'kamalpandey',
            database:'book',
            password:''
        } 
    }
}

module.exports =  config;
```

and in app.js use it with importing and using the imported config 
```
const config = require('./dbConfig.js');
// for postgresql and config.sqlite
let knex = require('knex')(config.postgreSql);
```
2. As the output is not much readable we can solve this problem by help of various methods lets configure them 
    - Clean the screen when program runs- Create a file display.js at root of project with the following code

```
module.exports = {
   clear: clear
}
function clear(){
    process.stdout.write('\033c');
}
```
use this in db config file
```
const display = require('./display.js');
display.clear();
```
but the output is still not very good lets make another function write in display.js file and export it

```
function write(data, mode){
    let output = data;
    switch(mode){
        case "json":
        //stringify(data, replacer, space)
        output = JSON.stringify(data,null,4);
    }
    console.log(output);
}
```
use it in app.js 
```
display.write(rows, 'json');
```
to make some more beautiful by using prettyjson
`npm install --save prettyjson`

in display.js
```
const pretty = require('prettyjson');
```
in app.js
```
display.write(rows, 'pretty');
```
lets give it more colors
```
case "pretty":
         const ops= {
            keysColor: 'cyan',
            dashColor: 'magenta',
            stringColor: 'white',
            numberColor: 'yellow'
        }
        output = pretty.render(data, ops);
break;
```
to check which query the following statement is running use debug key in dbConfig.js configurations of both sqlite and postgresql. 
```
debug: true
```
Now run the code, at the top you will see the sql query that is used by knex

**commit**

# 2. Building queries
## 2.1 Querying with promises
Promise is an object that represents an operation that hasn't completed yet. It's similar to callback with some better readable code and less christmas tree problem

Lets convert our as callback code to promises here we will be using only one then, you could use multiple thans that will run one after another (remember christmas tree)

in app.js
```
knex.select('title','rating').from('book')
.then(function(rows){
    display.write(rows, 'pretty');
})
.catch(function(err){
    display.write(err);
})
.finally(function(){
    display.write('done');
    knex.destroy();
});
```
The code is much more readable. Here first then displays the 'rows' in 'pretty' mode, if error occurs it will go to the catch with only error as parameter and then finally is called in both cases (error or success) to destroy the connection pool

**commit**

## 2.2 Selecting Data
- Selecting all columns. Pass no parameter to select query it will default to all columns
- The sequence is not important for knex query builder

```
knex.from('book').select(['title','rating'])
...
```

this is also a valid syntax with same result and here we have passed columns as arrays which is also acceptable


some more iterations or aliases for knex query builder

```
knex.table('book').column('title', 'rating')...
```

```
knex('book').column('title', 'rating')...
```

there is no better or worse method, all are same so use according to your convenience.

Now let's refractor some code to focus more on query builder not on promises
```
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
```

Get back to some of the select queries 

1. Query should return only the **first element**
```
let query = knex('book').select('title','rating').first();
```

2. Returns only **3 elements** or in simple terms **limit** the result
```
let query = knex('book').select('title','rating').limit(2);
```

3. We want only the ratings
```
let query = knex('book').select('ratings');
```
Look at the result some ratings are duplicate, 

4. Assume we don't want duplicate data
```
let query = knex('book').select('rating').distinct();
```
5. What if you want to write raw queries. Even if you write raw queries you will get benefit of connection pooling, and if you use bindings then your parameter values are escaped from sql injection attacks. Assume we want count and we call that column to be bookCount
```
let query = knex('book').select(knex.raw("COUNT(*) as bookCount));
```

6. If we don't want query builder but whole query to be written manually
```
let query = knex.raw("SELECT * FROM book WHERE author_id=1");
```

7. Assume author id is coming from other part of code
```
const authorId = 1;
let query = knex.raw("SELECT * FROM book WHERE author_id = " + authorId);
```
but its a bit risky code as anyone can play with the parameter

8. What if authorId is coming from frontend. This time anyone can play with this parameter hence using the bind statement
```
const authorId = 1;
let query = knex.raw("SELECT * FROM book WHERE author_id = ?", [authorId]);
```
here the value to be filled will be replaced by '?' and will be passed later by array according to the position of '?' in query. 

If we use raw query string we loose the capability of knex to standarize the result. Check this effect by changing our db to postgreSql

9. What if we want to order the result according to some column and descending order (ascending order is by default)
[orderBy, orderByRaw]
```
let query = knex('book').select('title','rating').orderBy('title','desc');
```

```
let query = knex('book').select('title','rating').orderByRaw('title desc');
```

10. What if we want to paginate the data [offset]. We will get title and id and orderBy id with limit of 2 ie. page size of 2 records.
```
let query = knex('book').select('title','id').orderBy('id').limit(2);
```

11. Now jump to page 2 
```
let query = knex('book').select('title','id').orderBy('id').limit(2).offset(2);
```
now we are getting another page result

12. Getting minimum rating on books [count, min, max, sum, avg]
```
let query = knex('book').min('rating as lowScore');
```

13. We want to group our result to some column [ groupby, groupByRaw]
```
let query = knex('book').select('author_id').min('rating as lowScore').groupBy('author_id');
```

14. Filtering data [ where, orWhere, andWhere, whereRaw]
- Object style
```
let query = knex('author').where({'firstname':'Mark', 'lastname':'Twain'})
```
it will return one record
- key value style
```
let query = knex('author').where("id", 1);
```
- Operator syntax
```
let query = knex('author').where("id","=", 1); //for equal

let query = knex('author').where("id","<", 1); //for less then

let query = knex('author').where("id","<>", 1); //for not equal to
//and so on
```
- in syntex will return any value matching the condition
```
let query = knex('author').where("id","in", [1,2,3]);
```
- Passing subquery
```
let subQuery = knex('author').select('id').where('id','>',1);
let query = knex('author').where("id","in", subQuery);
```
- Grouping the conditions could be done by function method
```
let query = knex('author').where(function(){
    this.where("id",1).orWhere("id",">",3);
}).orWhere({'firstname':'Mark'});
```
**[whereExist, orWhereExist, whereNotExist, orWhereNotExist]**

```
let query = knex('book').whereExists(function(){
    this.from('author').whereRaw('1=1'); //will always true so will return all records
});
```
15. Selecting data from multiple tables ie. using join [join, leftJoin, leftOuterJoin, rightJoin, rightOuterJoin, outerJoin, fullOuterJoin, crossJoin, joinRaw]

```
let query = knex('book')
    .join('author', 'author_id', '=', 'book.author_id')
    .select('author.firstname', 'author.lastname', 'book.title' );
```

16. If want multiple criterias for join use function with methods like [on, orOn]

```
let query = knex('book')
.join('author', function(){
    this.on('author_id', '=', 'book.author_id').orOn('x','=','y');
})
.select('author.firstname', 'author.lastname','book.title');
```
Note: this is not a real query as x and y are not defined but you get the idea how to use it

**commit**

## 2.3 Object graphs and Eager loading
If a relational database is queried it returns data in flat tabular format but our applications require data in hierarchy of related objects, known as **object graphs**
As in our book database we may want to get author id, author name etc and also all the books written by that author.
This could be achieved by a technique known as **eager loading**
For ORM's it's a convenient feature but comes with cost of performance and configuration of the entity model.

We can solve this problem by knex without the overhead and configuration of an ORM just by pure code in following ways

1. We will create a single query that returns all of the data needed to make object graph then parse it to desired format.
```
let query = knex('book')
.join('author','author.id','=','book.author_id')
.select(
    'author.firstname','author.lastname',
    'book.title as title', 'book.rating as rating', 'book.id as id'
)
.where('author.id',1).debug(false);

run(query, 'json');
```
here the output will be in this format 
```
...
   {
        "firstname": "J.K.",
        "lastname": "Rowling",
        "title": "HARRY POTTER AND THE PHILOSOPHER'S STONE",
        "rating": 8,
        "id": 1
    },
 ...
```
but this is not the desired result, we need books array inside the author object so next we will change the structure of query a little bit
so that identification becomes more easy

change inside the select statement
```
  'author.firstname','author.lastname',
    'book.title as books:title', 'book.rating as books:rating', 'book.id as books:id'
```
You might be wondering whether there is a way to convert this returned data to the desired format automatically, here node community comes to your rescue with a module named 'treeize' so install it  `npm install --save treeize`
- first we will import treeize into our app.js file then 
- Inside the then query we will create instance of treeize object and then will ask it to grow tree with the rows data then we will print the data according to mode. The code is below
```
const treeize = require('treeize');
... now inside the then statement
let tree = new treeize();
tree.grow(rows);
let authors = tree.getData();
display.write(authors, mode);
```
This will create the books object array inside the author object.

**commit**

2. Sometimes its not always good get all data in a single query (according to data set)

Lets create another file with name demo1.js in the root folder only just to demonstrate the use of two queries and getting the same data as before

```
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
```
here we are using bluebird library that knex uses for its promise library and passing both queries to be run one after another and getting the result in results parameter then parsing it and making it desired datatype.

## 2.4 Insert, update and delete
demo02.js
1. Inserting Record
the insert code is very easy and self explanatory
```
const wil = {firstname: 'Williom', lastname: 'shakespear'};
const ed = {firstname:'edward', lastname:'maya'};
const dave = {firstname:'dave', lastname:'turner'};
const jack = {firstname:'jack', lastname:'sparrow'};

knex.insert(jack).into('author').debug(false).then(function(id){
    display.write(id);
    return knex('author').debug(false); //select * from authors
})
.then(function(authors){
    display.write(authors,'json');
})
.finally(function(){
    knex.destroy();
});
```

to insert more then one value pass array like
```
knex.insert([dave, jack]).into('author) 
...
```
2. deleting record
```
knex('author').where("id", ">",4).del().debug(false).then(function(count){
    console.log(count);
    return knex('author').debug(false);
}).then(function(authors){
    display.write(authors,'pretty');
}).finally(function(){
    knex.destroy();
});
```
3. Updating record
```
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
```
## 2.5 Transaction
It is an important feature of relational database that allows user to  keep your data consistent in the event of errors or even system failure. Transaction allow you to group actions together in a single unit of work. Each action within the unit of work must succeed for the transaction to take effect. If any operation in the transaction fails, the entire transaction rolls back, and the database returns to the state it was in before the transaction began. So transactions create all or nothing type of situations. Knex allows you to commit your transactions using an implicit promise aware syntax.

**demo04.js** code is self explaining. 






