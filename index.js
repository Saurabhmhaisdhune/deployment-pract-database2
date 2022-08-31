import { MongoClient } from "mongodb";
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();

const app = express()
const PORT=process.env.PORT;

// const MONGO_URL = "mongodb://127.0.0.1";

const MONGO_URL= process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected ✌😊");
  return client;
}

const client = await createConnection();

app.use(cors())
app.use(express.json());

app.get('/', function (request, response) {
  response.send("welcome to shopping app")
});

app.get('/shopping', async function (request, response) {
  const datas = await client.db("shopping").collection("app").find({}).toArray();
 response.send(datas)
});

app.put("/shopping/:id", async function (request, response) {

  const { id }=request.params;
  console.log(request.params, id);
  const data= request.body;

  const result=await client
  .db("shopping")
  .collection("app")
  .updateOne({ id : id },{$set:data});

  result.modifiedCount > 0
  ?response.send({msg:"movie successfully updated"})
  :response.status(400).send({msg:"movie not found"});
});

app.delete("/shopping/:id", async function (request, response) {

  const { id }=request.params;
  console.log(request.params, id);

  const result=await client
  .db("shopping")
  .collection("app")
  .deleteOne({ id : id });

  result.deletedCount > 0
  ?response.send({msg:"movie successfully deleted"})
  :response.status(401).send({msg:"movie not found"});
});

app.post('/shopping', async function (request, response) {
  const data = request.body;
  const result = await client.db("shopping").collection("app").insertOne(data);
  response.send(result);
 });


app.listen(PORT,()=>console.log(`APP is running ${PORT}`))