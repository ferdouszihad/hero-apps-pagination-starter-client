//Definition & imports
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// Middlewares
require("dotenv").config();
app.use(cors());
app.use(express.json());

//ports & clients
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@mern-cluster.voqlfwt.mongodb.net/?appName=mern-cluster`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//server-Main
async function run() {
  try {
    await client.connect();
    const database = client.db("heroAppsDB");
    const appsCollection = database.collection("apps");

    app.get("/apps", async (req, res) => {
      try {
        const apps = await appsCollection.find().toArray();
        res.send(apps);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/app/:id", async (req, res) => {
      try {
        const appId = req.params.id;
        if (id.length != 24) {
          res.status(400).json({ error: "Invalid ID" });

          return;
        }
        const query = new ObjectId(appId);
        const app = await appsCollection.findOne({ _id: query });
        res.json(app);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Hero Apps Server listening on port ${PORT}`);
});

// Basic routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Hero Apps Server" });
});
