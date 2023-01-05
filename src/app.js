import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Botão Sign");
});

let users = [];

app.post("/sign-up", (req, res) => {
  const user = req.body;
  users.push(user);
  res.send("User is added to the database");
  console.log(users);
});

app.listen(PORT);
