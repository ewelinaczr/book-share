const express = require("express");
const app = express();

const booksRouter = require("./routes/booksRouter");
const usersRouter = require("./routes/usersRouter");
const bookshelfRouter = require("./routes/bookshelfRouter");
const marketRouter = require("./routes/marketRouter");

app.use(express.json());

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/bookshelf", bookshelfRouter);
app.use("/api/v1/market", marketRouter);

module.exports = app;
