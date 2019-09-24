var http= require('http');
var mongo = require('mongodb');
var mc = mongo.MongoClient;
const db = mc.connect('mongodb://localhost:27017/test',{ useNewUrlParser: true,useUnifiedTopology: true })
var {a, b} = require('./testmany');
console.log(a(), b());
var server= http.createServer(engine);
var response= require('./methods.js');
console.log(response);
server.listen(1337, function(){
    console.log("server was hit by request");
});

function engine(request, response){
    // console.log(response,"\n\n");
    response.writeHead(200,{'Content-Type': 'application/json'});
    response.write(JSON.stringify({
        status: true,
        arr: [1, 3,3,4]
    }))
    response.end();
}

