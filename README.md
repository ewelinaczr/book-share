# BookShare

A social platform built for people who love books and want to stay inspired, organized, and connected. It brings together everything a modern reader needs. With BookShare, users can create their own virtual bookshelf, keep track of what they’re reading, rate and review books, and explore what others in the community are offering. When they find something they like, they can easily arrange a real‑world exchange, choose a convenient meeting point, and coordinate the details through an integrated chat.

### Architecture Overview

BookShare is built as a **modular fullstack application** with a clear separation between:

- **Backend (Node.js + Express + MongoDB)** — business logic, authentication, data persistence, exchange system, chat.
    
- **Frontend (Next.js)** — interactive UI, SSR pages, maps, charts, onboarding, and user flows.
  
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

The frontend is built with Next.js and focuses on delivering a fast, responsive, and modern user experience. Server‑side rendering is used throughout the application to ensure quick initial load times and always‑fresh data.

BookShare integrates a powerful Google Books search, allowing users to look up titles by name or ISBN, automatically pull in book details, and add them to their shelf with a single click. Interactive maps built with Leaflet and React‑Leaflet help users browse BookShare pickup points and select convenient meeting locations during exchanges.

The real‑time chat interface enables smooth, instant communication between users, with message history stored and accessible at any time. Data visualizations present reading progress, genre distribution, and shelf composition in a clear, engaging way. The interface also supports a full Dark Mode theme, which users can toggle in their settings.

To help new members get started, BookShare includes a guided onboarding flow that walks users through adding their first books, exploring the marketplace, and understanding how exchanges and chat work.

## UI Structure & Navigation

### Dashboard

The dashboard provides a quick overview of the user’s activity. It displays recent notifications, pending exchange requests, new messages, and a snapshot of reading statistics. This page helps users immediately understand what requires their attention.

### My Bookshelf

A personal library where users manage all their books. Books are grouped by reading status (Read, Currently Reading, Want to Read, For Exchange). Users can edit details, rate books, add notes, and add new titles via Google Books search. This section acts as a reading tracker and digital archive.

### Marketplace (Explore)

A community‑driven catalog of books available for exchange. Users can browse listings, filter by genre or keywords, and view book owners. From here, they can send exchange requests that initiate the book‑sharing process.

### Map (Pickup Points)

An interactive map showing all BookShare pickup locations. Users select a meeting point after an exchange is accepted. Markers include details such as café names, libraries, or designated BookShare spots.

### Messages

A real‑time chat interface for coordinating exchanges. Each conversation corresponds to a specific exchange request. Messages update instantly, and the full history is stored for future reference.

### Stats

A visual analytics page showing the user’s reading habits. Charts illustrate reading frequency, genre distribution, and shelf composition. This section helps users reflect on their progress and stay motivated.

### Profile & Settings

The user profile contains account details, preferences, and customization options. Users can update their information, enable Dark Mode, and adjust app settings. This section personalizes the BookShare experience.

# Tech Stack

### Frontend
**Framework:** Next.js  for server‑side rendering, dynamic routing, and a fast, app‑like user experience.\
**Styling:** CSS Modules for scoped, maintainable, and component‑level styling.\
**Authentication:** NextAuth.js  supporting both Google OAuth and traditional credentials.\
**Maps:** Leaflet and React‑Leaflet for interactive pickup‑point visualization.\
**Charts:** Recharts / Chart.js  for clear, engaging reading analytics.\
**Real‑Time Communication:** Socket.io‑client powering the integrated chat system.

### Backend
**Application Logic:** Node.js  + Express structured as a modular REST API.\
**Database:** MongoDB with Mongoose for schema modeling and data persistence.\
**Messaging:** Socket.io  enabling real‑time WebSocket communication between users.\
**External Data:** Google Books API for retrieving book metadata and search results.

