const express = require("express");
const redis = require("redis");

const app = express();
const client = redis.createClient();

(async() => await client.connect())();

const rateLimiter = async (req, res, next) => {
   const key = "rate" ;
   const count = await client.incr(key);

   if(count === 1) await client.expire(key,10);

   if(count > 5) return
res.status(429).send("Too many requests");

   next();
};

app.use(rateLimiter);

app.get("/",async (req, res) => {
   let count = await client.get("count");
   count = count ? await
client.incr("count") : await
client.set("count", 1, {NX:true});
  res.send(`Visit count: ${count}`);
});
app.listen(3000, () => console.log("Server running on port 3000"));
