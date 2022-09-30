var express = require("express");
var seneca = require("seneca")();
var plugin = require("./product-storage.js");
seneca.use(plugin);
seneca.use("seneca-entity");

let reqget= 0;
let reqpost = 0;
seneca.add("role:api, cmd:product", function (args, done) {
   
    //POST METHOD
    if (args.req$.method == "POST") {
        reqpost++;
        console.log("> products POST: received request")
        var product = {
            product: args.product,
            price: args.price,
            category: args.category,
        };
        seneca.act({
                role: "product",
                cmd: "add",
                data: product
            },
            function (err, print) {
                console.log("< products POST: sending response")
                done(err, print);
            }
        );
    }
    //GET METHOD
    if (args.req$.method == "GET") {
        reqget++;
        console.log("> products GET: received request")
        seneca.act({
            role: "product",
            cmd: "get-all"
        }, function (err, print) {
            console.log("< products GET: sending response")
            done(err, print);
        });
    }
    //DELETE METHOD
    if (args.req$.method == "DELETE") {
        console.log("> DELETE: received the request")
        seneca.act({
            role: "product",
            cmd: "get-all"
        }, function (err, print) {
            for (const item of print) {
                seneca.act({
                        role: "product",
                        cmd: "delete",
                        id: item.id
                    },
                    function (err, print) {}
                );
            }
            console.log("< DELETE: sending the response")
            done(err, {
                message: " product is Deleted successfully."
            });
        });
    }
    console.log(`Processed Request Count--> Get:${reqget}, Post:${reqpost}`)
    
});

seneca.act("role:web", {
    use: {
        prefix: "/api",
        pin: {
            role: "api",
            cmd: "*"
        },
        map: {
            product: {
                GET: true,
                POST: true,
                DELETE: true
            },
        },
    },
});

var application = express();
application.use(require("body-parser").json());
application.use(seneca.export("web"));
const HOST = "127.0.0.1"
const PORT = 3009;
application.listen(PORT, HOST, function(){
    console.log(`Server is listening on ${HOST}:${PORT}`);
    console.log("Endpoints are here : ");
    console.log(`Method: POST :  http://${HOST}:${PORT}/api/product`);
    console.log('payload example: {“product”:”Laptop”, “price”:201.99, “category”:”PC”}');
    console.log(`GET METHOD: http://${HOST}:${PORT}/api/product`);
    console.log(`DELETE METHOD: http://${HOST}:${PORT}/api/product`);
});