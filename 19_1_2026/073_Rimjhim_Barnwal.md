# LAB ASSIGNMENT - 1
<img width="940" height="713" alt="image" src="https://github.com/user-attachments/assets/6449dc48-3424-4c3f-98de-97d72a87b852" />

**<br>**
+ *Node Server Timed Rate Limiter:*
```
const express = require("express");
const { createClient } = require("redis");

const app = express();

const redisClient = createClient({
   url: "redis://localhost:6379"
});

redisClient.connect();

const WINDOW = 10;   // seconds
const MAX_REQUESTS = 5;

app.use(async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate:${ip}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, WINDOW);
    }

    if (current > MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests. Try again later."
      });
    }

    next();

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/", (req, res) => {
  res.send("Request allowed");
});

app.listen(3000, () => {
  console.log("Rate limiter running on port 3000");
});

```
