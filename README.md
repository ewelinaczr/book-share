# BookShare

A fullstack web application for sharing and discovering books. Built with **Next.js** on the frontend and **Node.js + Express** on the backend.
# Backend

 **Node.js + Express** backend designed to power a book exchange platform. It supports user authentication, personal bookshelves, market listings, and private messaging between users. The backend uses **MongoDB via Mongoose** for data persistence and follows a modular, controller-based architecture with clean separation of concerns.
### Authentication

Authentication is handled using **JSON Web Tokens**. Protected routes use a custom middleware that verifies tokens, extracts user identity, and injects it into the request object for downstream access. Both internal - mongo and external - google identifiers are supported.

### Architecture

- **Controllers**: All business logic is encapsulated in controller files. Each controller handles request validation, database interaction, and response formatting.

- **Routes**: Express routers delegate incoming requests to the appropriate controller functions. Middleware is applied per route to enforce authentication and access control.

- **Models & Schemas**: Mongoose models define the structure of documents. Schemas include validation rules to ensure data integrity.

- **Middleware**: Custom middleware handles authentication and request shaping. 

### Real-Time Chat with WebSockets

In addition to RESTful messaging endpoints, this backend supports **real-time private messaging** using **WebSockets** (via socket.io). This enables instant communication between users without needing to poll the server. Messages sent through WebSocket are emitted to the recipient’s room in real time and persisted for history retrieval.

### API Overview

#### User Routes

|Method|Endpoint|Description|
|---|---|---|
|GET|`/users`|Get all users|
|GET|`/users/:id`|Get user by ID|
|PUT|`/users/:id/location`|Update user location|
|PUT|`/users/:id/profile`|Update user profile (name, email, etc.)|
|DELETE|`/users/:id`|Delete user account|
#### Book Routes

|Method|Endpoint|Description|
|---|---|---|
|GET|`/books`|Get all books|
|GET|`/books/:id`|Get book by ID|
|POST|`/books`|Save a new book|
|PUT|`/books/:id`|Update book details|
|DELETE|`/books/:id`|Delete book|
#### Bookshelf Routes

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| GET    | `/bookshelf`         | Get user's bookshelf       |
| POST   | `/bookshelf`         | Add book to bookshelf      |
| PUT    | `/bookshelf/:bookId` | Update book on bookshelf   |
| DELETE | `/bookshelf/:bookId` | Remove book from bookshelf |
#### Market Routes

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/market`                  | Get all market books         |
| POST   | `/market`                  | Add book to market           |
| GET    | `/market/user`             | Get user's market listings   |
| GET    | `/market/borrowed`         | Get books borrowed by user   |
| GET    | `/market/borrowed-from-me` | Get books borrowed from user |
| POST   | `/market/:id/exchange`     | Borrow or exchange a book    |
| PUT    | `/market/:id`              | Update market book listing   |
| DELETE | `/market/:id`              | Remove book from market      |
#### Chat Routes

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| GET    | `/chat/history/:userId` | Get message history with a user |
| GET    | `/chat/partners`        | Get list of chat partners       |
| DELETE | `/chat/history/:userId` | Delete all messages with a user |

# Frontend


# Screenshots




