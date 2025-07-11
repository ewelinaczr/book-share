import express from "express";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

import booksRouter from "./routes/booksRouter";
import usersRouter from "./routes/usersRouter";
import bookshelfRouter from "./routes/bookshelfRouter";
import marketRouter from "./routes/marketRouter";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/bookshelf", bookshelfRouter);
app.use("/api/v1/market", marketRouter);

export default app;
