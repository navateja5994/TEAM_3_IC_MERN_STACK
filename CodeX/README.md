# Project Documentation: PRATHAP Haute Parfumerie (CodeX)

Welcome to the documentation for the **PRATHAP Haute Parfumerie** (also internally named **CodeX**), a luxury perfume e-commerce web application. The application is built using the **MERN (MongoDB, Express, React, Node.js)** technology stack, powered by **Vite** on the frontend, and connected to a local **MongoDB** database.

---

## 🏛️ Project Architecture

The project consists of two core components running side-by-side:
1. **Frontend Client**: Built with [React 19](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/package.json#L16) and [Vite 8](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/package.json#L29), presenting a responsive, premium user interface with vanilla CSS styling.
2. **Backend Server**: An [Express](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/package.json#L14) application using [Mongoose](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/package.json#L15) schemas to read/write product collections and purchase order logs to MongoDB.

```mermaid
graph TD
    subgraph FE [Frontend Client - React & Vite]
        App["App.jsx (Main Component)"]
        AppStyle["App.css (UI Styles)"]
    end

    subgraph BE [Backend Server - Express & Node.js]
        Server["server.js (API Entry)"]
        DB["db.js (Mongo Connection)"]
        Seed["seed.js (Data Seeder)"]
    end

    subgraph DB_Cluster [Database - MongoDB]
        ProductsCol[("Products Collection")]
        OrdersCol[("Orders Collection")]
    end

    %% Flow lines
    App -->|GET /api/products| Server
    App -->|POST /api/orders| Server
    Server -->|connectDB()| DB
    Server -->|seedDatabase()| Seed
    Seed -->|Insert/Delete| ProductsCol
    DB -->|Read/Write Operations| DB_Cluster
```

---

## 📂 Project File Structure

- **Backend Folder**: [backend](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend)
  - [models/Order.js](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/models/Order.js) - Mongoose Order schema and validation.
  - [models/Product.js](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/models/Product.js) - Mongoose Product schema.
  - [.env](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/.env) - Environment Variables configuration.
  - [db.js](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/db.js) - MongoDB connection utility.
  - [package.json](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/package.json) - Node scripts & dependencies.
  - [seed.js](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/seed.js) - Seeding script with 33 luxury fragrances.
  - [server.js](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/server.js) - Main application entry, config loader, and API routes.
- **Frontend Source Folder**: [src](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/src)
  - [App.css](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/src/App.css) - Main component stylesheet.
  - [App.jsx](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/src/App.jsx) - Main client-side rendering & operational logic.
  - [index.css](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/src/index.css) - Global styling, typography, variables.
  - [main.jsx](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/src/main.jsx) - Entry React mounting file.
- **Workspace Config Files**:
  - [package.json](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/package.json) - Root workspace configuration.
  - [vite.config.js](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/vite.config.js) - Vite compiler options.

---

## 💾 Database Schemas (Mongoose Models)

The backend interacts with MongoDB via two primary models:

### 1. [Product Model](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/models/Product.js)
Stores information about the perfume collection.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Number` | Yes (Unique) | Integer product ID (used on frontend matching). |
| `name` | `String` | Yes | Perfume name (e.g., "AURA NOIR"). |
| `price` | `Number` | Yes | Cost in INR (₹). Must be `>= 0`. |
| `description` | `String` | Yes | Sensory/olfactory summary description. |
| `notes` | `[String]` | Yes (Default `[]`) | Array of ingredients/notes (e.g., `["Vetiver", "Cedarwood"]`). |
| `rating` | `Number` | Yes (Default `5`) | Product rating from `0` to `5`. |
| `reviews` | `Number` | Yes (Default `0`) | Number of user reviews. |
| `concentration` | `String` | Yes | EDP, Extrait de Parfum, etc. |
| `category` | `String` | Yes | Options: `'men'` or `'women'`. |
| `image` | `String` | Yes | Key mapping to local imported asset file. |

### 2. [Order Model](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/models/Order.js)
Logs purchase transactions.

- **Shipping Info** (`shippingInfo`): Nested sub-document including `name`, `email`, `address`, `city`, `state`, `zip`, and `phone`.
- **Items** (`items`): Array of ordered items, each containing `productId`, `name`, `price`, and `quantity` (`>= 1`).
- **Financial Details**: `subtotal`, `shippingFee` (default `15.00`), and `totalAmount`.
- **Payment Details**: `paymentMethod` (enum: `'upi'` or `'cod'`) and `upiId` (required if payment method is `'upi'`).

---

## 🌐 API Endpoints

The API is hosted on port `5000` by default.

### 🔌 Diagnostic Health Check
- **Endpoint**: `GET /`
- **Description**: Returns a verification message indicating that the Express API is live.

### 🛍️ Retrieve Products
- **Endpoint**: `GET /api/products`
- **Description**: Pulls all products stored in the MongoDB `products` collection.
- **Handler File**: [`server.js` (L24-L32)](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/server.js#L24-L32)

### 💳 Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Performs validation on incoming order payloads, registers it in MongoDB, and outputs a customer-facing, formatted receipt ID.
- **Format of Generated Order ID**: `AUR-YYYYMMDD-[4-digit-suffix]` (e.g. `AUR-20260806-XYZW`)
- **Handler File**: [`server.js` (L35-L78)](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/server.js#L35-L78)

---

## 🛠️ Configuration & Setup

### Environment Settings
The backend reads settings from the local dotenv file [backend/.env](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/.env):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codex
```

### Installation
From the project root:
```bash
# Install frontend package dependencies
npm install

# Install backend API dependencies
cd backend
npm install
cd ..
```

---

## 🚀 Running the Application

This project is configured with `concurrently` in the root [package.json](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/package.json#L13) scripts, allowing you to boot both servers in a single terminal.

### Developer Environment Commands

| Target | Command | Location | Description |
| :--- | :--- | :--- | :--- |
| **All Services** | `npm run dev:all` | Root Directory | Runs frontend Vite dev server and backend nodemon concurrently. |
| **Frontend Only** | `npm run dev` | Root Directory | Launches Vite dev server at `http://localhost:5173`. |
| **Backend Only** | `npm run backend:dev` | Root Directory | Launches Express server under Nodemon on port `5000`. |
| **Production Build**| `npm run build` | Root Directory | Compiles production assets into the `/dist` output folder. |

> [!NOTE]
> When the backend starts up, it automatically calls the [seedDatabase](file:///C:/Users/Admin/OneDrive/Desktop/TEAM_3_IC_MERN_STACK/CodeX/backend/seed.js#L407) routine which clears the database and populates it with 33 luxury fragrances. This ensures you always start with valid products in your local environment.

> [!WARNING]
> Please ensure that your local **MongoDB** service is active at `mongodb://127.0.0.1:27017` before launching the backend server, otherwise the database connection script will fail and exit.
