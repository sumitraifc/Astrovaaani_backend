# NodePro

NodePro is a small Express API built with MySQL, using a clean module-based architecture.

## Project architecture

### 1. Entry points

- `src/server.js`
  - Loads `src/app.js` and starts the HTTP server.
  - Uses `process.env.PORT` from `.env`.

- `src/app.js`
  - Initializes Express and JSON body parsing.
  - Mounts module routers for users and products.
  - Includes a global error handler.

### 2. Database layer

- `src/config/db.js`
  - Creates a MySQL connection pool with `mysql2/promise`.
  - Reads `DB_HOST`, `DB_USER`, `DB_PASS`, and `DB_NAME` from environment variables.

- `database/migrate.js`
  - Runs migration files from `database/migrations`.
  - Tracks executed migrations in the `migrations` table.

### 3. Module structure

Each feature follows a layered architecture with:

- `routes` — HTTP route definitions
- `controller` — request/response handling
- `service` — business logic
- `repository` — direct database access

#### User module (`src/modules/user`)

- `routes.js`
  - Registers user routes:
    - `POST /api/users/register`
    - `POST /api/users/login`

- `controller.js`
  - Wraps service calls in try/catch blocks and forwards errors.

- `service.js`
  - `register(data)` hashes the password and creates a user.
  - `login(data)` validates credentials and returns a JWT.

- `repository.js`
  - `create(data)` inserts a user into the `users` table.
  - `findByEmail(email)` finds a user by email.

#### Product module (`src/modules/product`)

- `routes.js`
  - Registers product routes:
    - `POST /api/products`
    - `GET /api/products`

- `controller.js`
  - Handles request/response and passes requests to service methods.

- `service.js`
  - `create(data)` forwards product creation.
  - `getAll()` returns all products.

- `repository.js`
  - `create(data)` inserts a product into the `products` table.
  - `getAll()` retrieves product rows.

### 4. Utility helpers

- `src/utils/hash.js`
  - `hash(password)` hashes passwords with `bcrypt`.
  - `compare(password, hash)` compares plaintext and hashed passwords.

- `src/utils/jwt.js`
  - `generate(payload)` creates a JWT signed with `process.env.JWT_SECRET`.

- `src/middlewares/auth.js`
  - Middleware to validate bearer tokens.
  - Not currently mounted in `src/app.js`, but ready for protected routes.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with these values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=your_database
PORT=3000
JWT_SECRET=your_jwt_secret
```

3. Run database migrations:

```bash
npm run migrate
```

4. Start the server:

```bash
npm run dev
```

or for production:

```bash
npm start
```

## Available commands

- `npm install`
  - Install project dependencies.

- `npm run dev`
  - Start the server with `nodemon` for auto-reloading during development.

- `npm start`
  - Start the server with plain Node.js.

- `npm run migrate`
  - Execute pending database migrations.

## API usage

### User endpoints

- Register a new user:

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- Login an existing user:

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response contains a JWT token:

```json
{
  "token": "..."
}
```

### Product endpoints

- Create a product:

```http
POST /api/products
Content-Type: application/json

{
  "name": "Example Product",
  "price": 99.99,
  "stock": 10
}
```

- Get all products:

```http
GET /api/products
```

## Notes

- Environment variables are loaded by `dotenv` in `src/app.js`.
- The architecture is designed for separation of concerns:
  - routes → controllers → services → repositories.
- To protect routes with JWT authentication, mount `src/middlewares/auth.js` in `src/app.js`.
