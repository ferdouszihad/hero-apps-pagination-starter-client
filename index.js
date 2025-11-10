const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Hero Apps Server" });
});

const uri =
  "mongodb+srv://hero-apps:DQj74uciUGmFMxo0@cluster0.zh14pzm.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("heroAppsDB");
    const appsCollection = database.collection("appsCl");

    app.get("/apps", async (req, res) => {
      try {
        const apps = await appsCollection.find({}).toArray();

        res.json(apps);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } );
    
    
     app.get("/appsCount", async (req, res) => {
       const count = await appsCollection.estimatedDocumentCount();
       res.send({ count });
     });

    app.get("/app/:id", async (req, res) => {
      try {
        const appId = req.params.id;
        console.log(appId);
        const query = new ObjectId(appId);
        const app = await appsCollection.findOne({ _id: query });
        res.json(app);
      } catch (error) {
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
