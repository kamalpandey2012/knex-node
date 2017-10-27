let config = {
    sqlite: {
        client: 'sqlite3',
        connection:{
            filename:'./book.sqlite'
        },
        useNullAsDefault: true ,
        debug:true
    },
    postgreSql: {
        client:'pg',
        connection:{
            host: 'localhost',
            user:'kamalpandey',
            database:'book',
            password:''
        },
        debug:true 
    }
}

module.exports =  config;
