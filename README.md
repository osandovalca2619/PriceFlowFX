# Project Title

This project contains a NestJS application with a PostgreSQL database, providing a CRUD API for managing currencies.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (for running the application locally without Docker)
- [Postman](https://www.postman.com/downloads/) (or any other API client)
- [Git](https://git-scm.com/)

### Project Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Checkout the feature branch:**
   The changes for the currencies API are on the `feature/currencies-crud` branch. To work with these changes, check out the branch:
   ```bash
   git checkout feature/currencies-crud
   ```

## Running the Application

You can run the application using Docker, which is the recommended way, or run it locally.

### Running with Docker (Recommended)

The project includes a `docker-compose.yml` file that sets up the NestJS application and the PostgreSQL database.

1. **Build and start the containers:**
   ```bash
   docker-compose up --build -d
   ```
   This command will build the images and start the containers in detached mode. The NestJS application will be available at `http://localhost:3000`.

2. **View logs:**
   To see the logs from the application or the database, you can use the following commands:
   ```bash
   docker-compose logs -f app
   docker-compose logs -f db
   ```

3. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)

If you prefer to run the application without Docker, follow these steps:

1. **Start a PostgreSQL database.**
   You can use Docker to run a PostgreSQL database:
   ```bash
   docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
   ```
   Make sure the database connection details in your `.env` file match your database configuration.

2. **Install dependencies:**
   ```bash
   cd app
   npm install
   ```

3. **Run the application:**
   ```bash
   npm run start:dev
   ```
   The application will be available at `http://localhost:3000`.

## API Endpoints

The API for managing currencies is available at the `/currencies` endpoint.

### Create a new currency

- **Endpoint:** `POST /currencies`
- **Body:**
  ```json
  {
    "code": "USD",
    "name": "United States Dollar",
    "symbol": "$",
    "country": "United States",
    "decimals": 2,
    "is_strong_currency": true,
    "created_by": 1
  }
  ```
- **Example with `curl`:**
  ```bash
  curl -X POST http://localhost:3000/currencies \
  -H "Content-Type: application/json" \
  -d '{
    "code": "USD",
    "name": "United States Dollar",
    "symbol": "$",
    "country": "United States",
    "decimals": 2,
    "is_strong_currency": true,
    "created_by": 1
  }'
  ```

### Get all currencies

- **Endpoint:** `GET /currencies`
- **Example with `curl`:**
  ```bash
  curl http://localhost:3000/currencies
  ```

### Get a single currency by ID

- **Endpoint:** `GET /currencies/:id`
- **Example with `curl`:**
  ```bash
  curl http://localhost:3000/currencies/1
  ```

### Update a currency

- **Endpoint:** `PATCH /currencies/:id`
- **Body:**
  ```json
  {
    "name": "US Dollar",
    "modified_by": 1
  }
  ```
- **Example with `curl`:**
  ```bash
  curl -X PATCH http://localhost:3000/currencies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "US Dollar",
    "modified_by": 1
  }'
  ```

### Delete a currency

- **Endpoint:** `DELETE /currencies/:id`
- **Example with `curl`:**
  ```bash
  curl -X DELETE http://localhost:3000/currencies/1
  ```
