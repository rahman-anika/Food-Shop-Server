const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcqim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const port = process.env.PORT || 5000;
const app = express();



app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.send("Hello World!");
});


client.connect((err) => {
    const productsCollection = client.db("foodShop").collection("products");
    const ordersCollection = client.db("foodShop").collection("orders");


    //  make route and get data
    app.get("/products", async (req, res) => {
        // productsCollection.find({}).toArray((err, results) => {
        //     res.send(results);
        // });

        const result = await productsCollection.find({}).toArray();
        res.send(result);

    });



    // get single prodcut

    app.get("/singleProduct/:id", async (req, res) => {
        console.log(req.params.id);
        // productsCollection
        //     .find({ _id: ObjectId(req.params.id) })
        //     .toArray((err, results) => {
        //         res.send(results[0]);
        //     });

        productsCollection
            .findOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
                res.send(result);

            });


    });



    //add product
    app.post("/addProducts", (req, res) => {
        console.log(req.body);
        productsCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
        });
    });



    //delete product from the database
    app.delete("/deleteProduct/:id", async (req, res) => {
        console.log(req.params.id);

        // productsCollection
        //     .deleteOne({ _id: ObjectId(req.params.id) })
        //     .then((result) => {
        //         res.send(result);
        //     });

        const result = await productsCollection
            .deleteOne({ _id: ObjectId(req.params.id) });

        res.send(result);

    });




    //update product
    app.put("/update/:id", async (req, res) => {
        const id = req.params.id;
        const updatedName = req.body;
        const filter = { _id: ObjectId(id) };

        // productsCollection
        //     .updateOne(filter, {
        //         $set: {
        //             name: updatedName.name,
        //             price: updatedName.price
        //         },
        //     })
        //     .then((result) => {
        //         res.send(result);
        //     });


        const result = await productsCollection
            .updateOne(filter, {
                $set: {
                    name: updatedName.name,
                    price: updatedName.price
                },
            });
        console.log(result);
        res.send(result);

    });



    //add order in database

    app.post("/addOrders", (req, res) => {
        ordersCollection.insertOne(req.body).then((result) => {
            res.send(result);
        });
    });



    // get all order by email query
    app.get("/myOrders/:email", async (req, res) => {
        console.log(req.params);
        // ordersCollection
        //     .find({ email: req.params.email })
        //     .toArray((err, results) => {
        //         res.send(results);
        //     });

        const result = await ordersCollection
            .find({ email: req.params.email })
            .toArray();
        // console.log(result);
        res.send(result);



    });


});

app.listen(port, (req, res) => {
    console.log('Listening at the port at ', port);

});