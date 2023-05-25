const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// Express Require 
const express = require("express");
const app = express();
app.use(express.json());

// Cors Require 
const cors = require("cors");
app.use(cors());

// Server  Port
const port = process.env.PORT || 8000;

// Stripe Payment system Require
const stripe = require("stripe")(
  "sk_test_51LXS98B5Y3AeAE8ixEr3XbAzakqMdCNqxsU9YIZyhx8IaSGdcIaHNUdF4zPSaludDIIwz7kxSsnL6bcAkD4EUURB00BKYOJvq7"
);

// Mongodb Database Connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akmwf4e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


// Rest Api Function 
async function run() {
  try {
    await client.connect();

    // Database Collection 
    const eventBlogsCollection = client.db("Uiu").collection("EventBlogs");
    const recentEventsCollection = client.db("Uiu").collection("RecentEvents");
    const upcomingEventsCollection = client
      .db("Uiu")
      .collection("UpcomingEvents");
    const EventRegistrationCollection = client
      .db("Uiu")
      .collection("EventRegistration");
    const userCollection = client.db("Uiu").collection("profile");
    const AnnouncmentCollection = client.db("Uiu").collection("Announcment");
    const BlogCollection = client.db("Uiu").collection("blogs");
    const FaqCollection = client.db("Uiu").collection("Faq");
    const activitesCollection = client.db("Uiu").collection("Activites");
    const ForumClubCollection = client.db("Uiu").collection("Forum&Club");
    const allRequestCollection = client.db("Uiu").collection("AllReques");
    const customMemberCollection = client.db("Uiu").collection("customMember");


    // admin here========= (userCollection)
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      res.send({ admin: isAdmin });
    });

    // User Section Here (userCollection)
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
    });

    app.put("/user/update/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateUser = {
        $set: userInfo,
      };
      const result = await userCollection.updateOne(
        filter,
        updateUser,
        options
      );
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await userCollection.findOne(query);
      res.send(users);
    });

    app.get("/myProfile", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // All Club & Forum Api For (ForumClubCollection)

    app.get("/service", async (req, res) => {
      const user = req.body;
      const users = await ForumClubCollection.find(user).toArray();
      res.send(users);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const booking = await ForumClubCollection.findOne(query);
      res.send(booking);
    });

    app.get("/service", async (req, res) => {
      const user = req.body;
      const service = await ForumClubCollection.find(user).toArray();
      res.send(service);
    });

    app.put("/user/service/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateUser = {
        $set: userInfo,
      };
      const result = await ForumClubCollection.updateOne(
        filter,
        updateUser,
        options
      );
      res.send(result);
    });

    app.get("/service/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await ForumClubCollection.findOne(query);
      res.send(users);
    });

    app.post("/service", async (req, res) => {
      const query = req.body;
      const service = await ForumClubCollection.insertOne(query);
      res.send(service);
    });

    // new member join forum & club Section  (customMemberCollection)
    app.post("/custom", async (req, res) => {
      const query = req.body;
      const service = await customMemberCollection.insertOne(query);
      res.send(service);
    });

    app.get("/custom", async (req, res) => {
      const user = req.body;
      const service = await customMemberCollection.find(user).toArray();
      res.send(service);
    });

    // Blog Section Api (BlogCollection)
    app.post("/blog", async (req, res) => {
      const query = req.body;
      const blogPost = await BlogCollection.insertOne(query);
      res.send(blogPost);
    });

    app.get("/myBlog", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = BlogCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // FaQ Section Api (FaqCollection)

    app.post("/faq", async (req, res) => {
      const query = req.body;
      const faqPost = await FaqCollection.insertOne(query);
      res.send(faqPost);
    });

    app.get("/myfaq", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = FaqCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // Forum & Club Activites Api Here (activitesCollection)

    app.post("/activites", async (req, res) => {
      const query = req.body;
      const faqPost = await activitesCollection.insertOne(query);
      res.send(faqPost);
    });

    app.get("/myActivites", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = activitesCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // Forum & Club announcment Api Here (AnnouncmentCollection)

    app.post("/announcment", async (req, res) => {
      const query = req.body;
      const announcment = await AnnouncmentCollection.insertOne(query);
      res.send(announcment);
    });

    app.get("/myAnnouncment", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = AnnouncmentCollection.find(query);
      const result = await cursor.toArray();
      return res.send(result);
    });

    // Stripe Payment System

    app.post("/create-payment-intent", async (req, res) => {
      const service = req.body;
      const price = service.amount;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    // Create a New Club & Fourm Request Api Here === (allRequestCollection)

    app.post("/allrequest", async (req, res) => {
      const query = req.body;
      const allRequest = await allRequestCollection.insertOne(query);
      res.send(allRequest);
    });

    app.get("/allrequest", async (req, res) => {
      const user = req.body;
      const users = await allRequestCollection.find(user).toArray();
      res.send(users);
    });

    app.delete("/allrequest/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deleteReq = await allRequestCollection.deleteOne(query);
      res.send(deleteReq);
    });


    // Forum & Club EventBlogs Api  (eventBlogsCollection)
    app.get("/eventblogs", async (req, res) => {
      const quary = {};
      const cursor = eventBlogsCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/postblogs", async (req, res) => {
      const query = req.body;
      const blogs = await eventBlogsCollection.insertOne(query);
      res.send(blogs);
    });

    // Get All Recent Event (recentEventsCollection)
    app.get("/recentEvents", async (req, res) => {
      const quary = {};
      const cursor = recentEventsCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get All Upcoming Eventss (upcomingEventsCollection)
    app.get("/upcomingEvents", async (req, res) => {
      const quary = {};
      const cursor = upcomingEventsCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/upcomingEvents", async (req, res) => {
      const quary = req.body;
      const eventPost = await upcomingEventsCollection.insertOne(quary);
      res.send(eventPost);
    });

    // Event Registration (EventRegistrationCollection)
    app.post("/eventRegistration", async (req, res) => {
      const quary = req.body;
      const registration = await EventRegistrationCollection.insertOne(quary);
      res.send(registration);
    });
    app.get("/eventRegistration", async (req, res) => {
      const quary = {};
      const cursor = EventRegistrationCollection.find(quary);
      const reg = await cursor.toArray();
      res.send(reg);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From UIU club and Forum ..!");
});

app.listen(port, () => {
  console.log(`UIU Club Forum listening on port ${port}`);
});
