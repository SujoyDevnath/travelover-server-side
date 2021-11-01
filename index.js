const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// user: travelover
// pass: 0CUIyu8UoMW3WMey

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8i5p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travelover");
        const servicesCollection = database.collection("services");
        const teamCollection = database.collection("team");
        const reviewsCollection = database.collection("reviews");
        const allOrdersCollection = database.collection("allOrders");

        //////////////////////////////////////////

        // GET SERVICES API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            console.log('services api worked');
            res.send(services);
        })
        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('the service id : ', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })
        // POST SERVICE
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            res.json(result)
        });

        ///////////////////////////////////////////////

        // GET TEAM API
        app.get('/team', async (req, res) => {
            const cursor = teamCollection.find({});
            const team = await cursor.toArray();
            console.log(team);
            res.send(team);
        })

        //////////////////////////////////////////////

        // GET REVIEWS API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            console.log(reviews);
            res.send(reviews);
        })

        ////////////////////////////////////////////

        // POST ALL ORDERS
        app.post('/allOrders', async (req, res) => {
            const allOrders = req.body;
            console.log('hit the post api', allOrders);

            const result = await allOrdersCollection.insertOne(allOrders);
            res.json(result)
        });
        // GET ALL ORDERS
        app.get('/allOrders', async (req, res) => {
            const cursor = allOrdersCollection.find({});
            const allOrders = await cursor.toArray();
            console.log('allOrders api worked');
            res.send(allOrders);
        })
        //UPDATE ALL ORDERS
        app.put('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedAllOrders = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedAllOrders.status,
                },
            };
            const result = await allOrdersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })
        // DELETE ALL ORDERS
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allOrdersCollection.deleteOne(query);
            console.log('delete this order', id);
            res.json(result);
        })

        /////////////////////////////////////////
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('travel api hitted');
})

app.listen(port, () => {
    console.log('listening to port', port);
})