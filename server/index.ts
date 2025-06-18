import express from "express";
const app = express();

import booksRouter from "./routes/booksRouter";
import usersRouter from "./routes/usersRouter";
import bookshelfRouter from "./routes/bookshelfRouter";
import marketRouter from "./routes/marketRouter";

app.use(express.json());

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/bookshelf", bookshelfRouter);
app.use("/api/v1/market", marketRouter);

export default app;
