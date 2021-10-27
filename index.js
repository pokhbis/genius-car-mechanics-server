const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cghak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//check wheather username and password match with the cmd or not
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        //clg to check if db connection has estabilshed or not
        // console.log("connected to db");
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");


        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        //GET single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("getting specfic service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })



        //   // create a document to insert
        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("hit the post api", req.body);
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });


        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        //entry/item to be inserted. POST API method is fundamentally silmilar to this method
        //   const doc = {
        //     title: "Record of a Shriveled Datum",
        //     content: "No bytes, no problem. Just insert a document, in MongoDB",
        //   }
        //   const result = await haiku.insertOne(doc);
        //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // below code uncommented may give error in some case
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("running");
});

app.get('/hello', (req, res) => {
    res.send('hello updated!')
})

app.listen(port, () => {
    console.log("listening from port", port);
})