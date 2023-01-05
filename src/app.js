import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let tweets = [];

function checkImage(url) {
  if (url.match(/^http.*\.(jpeg|jpg|gif|png)$/) !== null) {
    return true;
  } else {
    return false;
  }
}

app.post("/sign-up", (req, res) => {
  const user = req.body;
  if (
    Object.keys(user).length !== 2 ||
    !Object.keys(user).includes("username") ||
    !Object.keys(user).includes("avatar")
  ) {
    return res.status(400).send("Bad request, the payload is incorrect!");
  } else if (Object.values(user).includes("")) {
    return res.status(400).send("All fields are mandatory!");
  } else {
    if (!checkImage(user.avatar))
      return res.status(400).send("URL is incorrect! It's not an image.");
  }
  users.push(user);
  res.status(201).send("OK");
  console.log(users);
});

app.get("/tweets", (_, res) => {
  let array = [];
  let stop = 0;
  if (tweets.length > 10) {
    stop = tweets.length - 10;
  }
  for (let i = tweets.length - 1; i >= stop; i--) {
    array.push({
      username: tweets[i].username,
      avatar: users.filter((u) => u.username === tweets[i].username)[0].avatar,
      tweet: tweets[i].tweet,
    });
  }
  res.status(200).send(array);
});

app.get("/tweets/:username", (req, res) => {
  let array = [];
  const username = req.params.username;
  let tweetsUser = tweets.filter((t) => t.username === username);
  const avatar = users.filter((u) => u.username === tweetsUser[0].username)[0]
    .avatar;
  for (let i = tweetsUser.length - 1; i >= 0; i--) {
    array.push({
      username: tweetsUser[i].username,
      avatar: avatar,
      tweet: tweetsUser[i].tweet,
    });
  }
  res.status(200).send(array);
});

// app.post("/tweets", (req, res) => {
//   const tweet = req.body;
//   if (
//     Object.keys(tweet).length !== 2 ||
//     !Object.keys(tweet).includes("username") ||
//     !Object.keys(tweet).includes("tweet")
//   ) {
//     return res.status(400).send("Bad request, the payload is incorrect!");
//   } else if (Object.values(tweet).includes("")) {
//     return res.status(400).send("All fields are mandatory!");
//   }
//   if (users.filter((u) => u.username === req.body.username).length === 0)
//     return res.status(401).send("UNAUTHORIZED");
//   tweets.push(tweet);
//   res.status(201).send("OK");
//   console.log(tweets);
// });

app.post("/tweets", (req, res) => {
  const username = req.header("user");
  const tweet = req.body;
  if (
    Object.keys(tweet).length !== 1 ||
    !Object.keys(tweet).includes("tweet")
  ) {
    return res.status(400).send("Bad request, the payload is incorrect!");
  } else if (Object.values(tweet).includes("") || username === "") {
    return res.status(400).send("All fields are mandatory!");
  }
  if (users.filter((u) => u.username === username).length === 0)
    return res.status(401).send("UNAUTHORIZED");
  tweets.push({ username, tweet: tweet.tweet });
  res.status(201).send("OK");
  console.log(tweets);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
