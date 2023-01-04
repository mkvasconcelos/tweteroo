import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Botão Sign Up");
});

app.post("/sign-up", (req, res) => {
  // console.log(req.body); // the posted data
  res.send(req);
});

// Configura o servidor para rodar na porta 4000
app.listen(4000);
