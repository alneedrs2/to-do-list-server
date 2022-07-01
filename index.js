const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1u8t.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("todoList").collection("item");

    app.post("/get-todo", async (req, res) => {
      const newList = req.body;
      const result = await itemCollection.insertOne(newList);
      res.send(result);
    });

    app.get("/get-todo", async (req, res) => {
      const result = await itemCollection.find().toArray();
      res.send(result);
    });

    app.get("/get-todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });
    app.put("/get-todo/:id", async (req, res) => {
      const id = req.params.id;
      const updateItems = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          task: updateItems.task,
        },
      };
      const result = await itemCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("todo is running and waiting for task");
});

app.listen(port, () => {
  console.log("todo server is running now in", port);
});
