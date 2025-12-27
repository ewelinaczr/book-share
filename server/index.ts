import express from "express";
import cors from "cors";
import requestLogger from "./middleware/requestLogger";
import errorHandler from "./middleware/errorHandler";

const app = express();

// Compact request logging middleware (method, url, responseTime)
app.use(requestLogger);

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

import booksRouter from "./routes/booksRouter";
import usersRouter from "./routes/usersRouter";
import bookshelfRouter from "./routes/bookshelfRouter";
import marketRouter from "./routes/marketRouter";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chatRouter";

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/bookshelf", bookshelfRouter);
app.use("/api/v1/market", marketRouter);
app.use("/api/v1/chat", chatRouter);

// Centralized error handler (after all routes)
app.use(errorHandler);

export default app;
