const pretty = require('prettyjson');

module.exports = {
    clear: clear,
    write: write
}
function clear(){
    process.stdout.write('\033c');
}

function write(data, mode){
    let output = data;
    switch(mode){
        case "json":
        //stringify(data, replacer, space)
        output = JSON.stringify(data,null,4);
        break;
        case "pretty":
         const ops= {
            keysColor: 'cyan',
            dashColor: 'magenta',
            stringColor: 'white',
            numberColor: 'yellow'
        }
        output = pretty.render(data, ops);
        break;
    }
    console.log(output);
}