import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let tweets = [];
const errorMessage = "Bad request, the payload is incorrect!";

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
    typeof req.body.username !== "string" ||
    typeof req.body.avatar !== "string"
  )
    return res.status(400).send(errorMessage);
  if (
    Object.keys(user).length !== 2 ||
    !Object.keys(user).includes("username") ||
    !Object.keys(user).includes("avatar")
  ) {
    return res.status(400).send(errorMessage);
  } else if (Object.values(user).includes("")) {
    return res.status(400).send("All fields are mandatory!");
  } else {
    if (!checkImage(user.avatar))
      return res.status(400).send("URL is incorrect! It's not an image.");
  }
  user.id = users.length + 1;
  users.push(user);
  res.status(201).send("OK");
  console.log(users);
});

app.get("/tweets/:USERNAME?", (req, res) => {
  // I could create a varibale to get the size of the page instead of set to 10
  const username = req.params.USERNAME;
  let page = Number(req.query.page);
  let array = [];
  if (username) {
    let tweetsUser = tweets.filter((t) => t.username === username);
    const avatar = users.find(
      (u) => u.username === tweetsUser[0].username
    ).avatar;
    for (let i = tweetsUser.length - 1; i >= 0; i--) {
      array.push({
        username: tweetsUser[i].username,
        avatar: avatar,
        tweet: tweetsUser[i].tweet,
      });
    }
    return res.status(200).send(array);
  }
  if (!req.query.page) {
    page = 1;
  } else if (Number.isNaN(page) || !Number.isInteger(page) || page < 1) {
    return res.status(400).send("Please enter a valid page!");
  }
  let max = tweets.length - (page - 1) * 10;
  let min = tweets.length - page * 10 >= 0 ? tweets.length - page * 10 : 0;
  const tweetsSlice = tweets.slice(min, max);
  for (let i = tweetsSlice.length - 1; i >= 0; i--) {
    array.push({
      username: tweetsSlice[i].username,
      avatar: users.find((u) => u.username === tweetsSlice[i].username).avatar,
      tweet: tweetsSlice[i].tweet,
    });
  }
  return res.status(200).send(array);
});

app.post("/tweets", (req, res) => {
  const username = req.header("user");
  const tweet = req.body;
  if (typeof tweet.tweet !== "string")
    return res.status(400).send(errorMessage);
  if (
    Object.keys(tweet).length !== 1 ||
    !Object.keys(tweet).includes("tweet")
  ) {
    return res.status(400).send(errorMessage);
  } else if (Object.values(tweet).includes("") || username === "") {
    return res.status(400).send("All fields are mandatory!");
  }
  if (!users.find((u) => u.username === username))
    return res.status(401).send("UNAUTHORIZED");
  tweets.push({ username, tweet: tweet.tweet, id: tweets.length + 1 });
  res.status(201).send("OK");
  console.log(tweets);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
