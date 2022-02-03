const express = require("express");
const connect = require("./schemas");
const cors = require("cors");

const authMiddleware = require("./middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

connect();

const UserRouter = require("./routes/users");
const PostRouter = require("./routes/articles");
const CommentRouter = require("./routes/comments");

const requestMiddleware = (req, res, next) => {
    console.log("Request Url :", req.originalUrl, " - ", new Date());
    next();
}
  
app.use("/api", express.urlencoded({ extended:false}),  [UserRouter, PostRouter, CommentRouter, ] );
//app.use("/api", express.urlencoded({ extended:false}),  PostRouter );
app.use(express.static("assets"));
app.use(express.json());
app.use(cors());
app.use(requestMiddleware);

app.get("/", (req, res) => {
    res.send("Hi!")
});

app.listen(port, () => {
    console.log(port, "서버가 준비되었습니다.")
});