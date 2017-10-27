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
    knex.destroy();
});
```
The code is much more readable. Here first then displays the 'rows' in 'pretty' mode, if error occurs it will go to the catch with only error as parameter and then finally is called in both cases (error or success) to destroy the connection pool

**commit**







