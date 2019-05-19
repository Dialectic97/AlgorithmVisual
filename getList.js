const path = require('path')
const os = require('os')
const fs = require('fs')
let root = path.join(__dirname,'static/AnimationFrame/algorithm')
function readDirSync(path = root){
    console.log(path);
    let pa = fs.readdirSync(path);
    let array = [];
    for(let i = 0; i < pa.length; i++) {
        //console.log(pa[i]);
        array.push(pa[i].slice(0, pa[i].length-3));
    }
    //console.log(array)
    return array;
}
module.exports = readDirSync;