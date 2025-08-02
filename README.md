# PriceFlowFX API

This is a NestJS application that provides a comprehensive API for managing users, products, categories, transactions, and currencies. It uses TypeORM for data persistence with a PostgreSQL database and JWT for authentication.

## Features

-   **Authentication:** JWT-based authentication with login and profile endpoints.
-   **Users:** CRUD operations for users.
-   **Products:** CRUD operations for products and categories.
-   **Transactions:** Create and retrieve transactions with details.
-   **Currencies:** CRUD operations for currencies.
-   **API Documentation:** API documentation generated with Swagger, available at `/api`.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Docker](https://www.docker.com/get-started)
-   [Node.js](https://nodejs.org/) (for running migrations)
-   [npm](https://www.npmjs.com/)

### Project Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Create a `.env` file:**
    Copy the `.env.example` file to a new file named `.env` and update the environment variables as needed.
    ```bash
    cp .env.example .env
    ```

3.  **Install dependencies:**
    ```bash
    npm install --prefix app
    ```

## Running the Application with Docker

The project includes a `docker-compose.yml` file that sets up the NestJS application, a PostgreSQL database, and a pgAdmin instance.

1.  **Build and start the containers:**
    ```bash
    docker-compose up --build -d
    ```
    -   The NestJS application will be available at `http://localhost:3000`.
    -   The PostgreSQL database will be available at `localhost:5432`.
    -   pgAdmin will be available at `http://localhost:5050`.

2.  **Run migrations:**
    To create the database schema, run the TypeORM migrations:
    ```bash
    npm run typeorm:migration:run --prefix app
    ```
    *Note: You may need to wait a few seconds for the database container to be ready before running the migrations.*

3.  **View logs:**
    To see the logs from the application or the database, you can use the following commands:
    ```bash
    docker-compose logs -f api
    docker-compose logs -f postgres
    ```

4.  **Stop the containers:**
    ```bash
    docker-compose down
    ```

## API Documentation

The API documentation is generated using Swagger and is available at `http://localhost:3000/api` when the application is running.

## Testing

The project includes basic tests for the application controller and service. To run the tests, use the following command:

```bash
npm test --prefix app
```
