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






