const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@simple-crud.fod3bbj.mongodb.net/?retryWrites=true&w=majority&appName=simple-crud`;

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
    const jobsCollection = client.db("Career_Code").collection("Jobs");
    const applicationsCollection=client.db('Career_Code').collection('applications')
    // jobs Api
    // Find all jobs 
    app.get("/jobs", async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find a job
    app.get('/jobs/:id', async(req,res)=>{
      const id =req.params.id;
      const query ={_id : new ObjectId(id)};
      const result = await jobsCollection.findOne(query);
      res.send(result)

    })
    // Get applications
    app.get('/applications',async(req,res)=>{
      const email=req.query.email;
      const query={
        applicant:email
      }
      const result= await applicationsCollection.find(query).toArray();
      res.send(result);
    } )

    // job application api
    app.post('/applications',async(req,res)=>{
      const application=req.body;
      const result=await applicationsCollection.insertOne(application);
      res.send(result);
    })

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
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
