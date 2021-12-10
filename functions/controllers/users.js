const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
//import firebase admin to send data to its collection
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
//firebase does not have put,post,delete etc.
//we need express for those
const userApp = express();
// use cors to avoid error when making post request
userApp.use(cors({ origin: true }));
// defining routes

//add user
userApp.post("/", async (req, res) => {
  const user = req.body;
  await db.collection("users").add(user);

  res.status(201).send();
});
//get all users
userApp.get("/", async (req, res) => {
  const snapshot = await db.collection("users").get();
  let users = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();
    users.push({ id, ...data });
  });
  res.status(200).send(JSON.stringify(users));
});
//get a user
userApp.get("/:id", async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();

  let userId = snapshot.id;
  let userData = snapshot.data();

  res.status(200).send(JSON.stringify({ id: userId, ...userData }));
});

//update user
userApp.put("/:id", async (req, res) => {
  const body = req.body;

  await db.collection("users").doc(req.params.id).update(body);

  res.status(200).send();
});
//delet user
userApp.delete("/:id", async (req, res) => {
  await db.collection("users").doc(req.params.id).delete();

  res.status(200).send();
});

exports.user = functions.https.onRequest(userApp);
