# ForumAPI

[![CI](https://github.com/adikelvianto/ForumAPI/actions/workflows/ci.yml/badge.svg)](https://github.com/adikelvianto/ForumAPI/actions/workflows/ci.yml)
[![CD](https://github.com/adikelvianto/ForumAPI/actions/workflows/cd.yml/badge.svg)](https://github.com/adikelvianto/ForumAPI/actions/workflows/cd.yml)

## Overview

This project is a submission for the "Menjadi Back-End Developer Expert" course on the Dicoding platform.

The API was created using **Test Driven Development (TDD)** methods, incorporating Unit Tests, Integration Tests, and Functional Tests to ensure robust functionality. The architecture adheres to a **clean architecture pattern** and is primarily built using **node.js**, the **Hapi** plugin, and a **PostgreSQL** database. Deployment is achieved through an **EC2** instance and **RDS**.


ForumAPI underwent a **CI/CD** process using **GitHub Actions**. Additionally, it enforces **access limits using nginx** for DDoS attack protection.  Moreover, **HTTPS protocol is used** to enhance security.

## Project Highlights

- **Thread Data Management:**
    - Create: 
        - Add a new thread to the database.
        - Add a new comment inside a thread.
    - Retrieve: Get detail of thread based on its ID.
    - Delete: Remove comment from a thread. 

- **Clean Architecture Implementation:**
    <br>The Forum API project follows the Clean Architecture pattern, structured into 4 layers:
    - Entities
        - Storage for main business entities.
        - Created when managing complex data structures is required.

    - Use Case
        - Defines the flow and business logic.

    - Interface Adapter (Repository and Handler)
        - Acts as a mediator connecting the framework layer with the use case layer.

    - Frameworks (Database and HTTP Server)
        - The outermost layer, encompassing database and HTTP server functionality.

- **CI/CD Implementation:**
    - Run automatic testing processes, covering Unit Tests, Integration Tests, and Functional Tests.
    - Implements automatic deployment to an EC2 server.
    - Utilizes GitHub Actions for the CI/CD workflow, enabling seamless integration and automation.

- **Access Limit Implementation:**
    - Limiting incoming requests for the '/threads' resource and its subpaths to 90 requests per minute using nginx.

# Getting Started with Forum API

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) - Runtime environment for JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - Database server.
- [Git](https://git-scm.com/) - Version control system.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/adikelvianto/ForumAPI.git
   cd ForumAPI
2. Create .env file consisting this template:
    ```env
    HOST=localhost
    PORT=5000

    # PostgreSQL Database
    PGUSER=your_postgres_user
    PGHOST=localhost
    PGPASSWORD=your_postgres_password
    PGDATABASE=your_postgres_database
    PGPORT=your_postgres_port

    # JWT Token
    ACCESS_TOKEN_KEY=2862379d4164bf0d9f5e48d47c0f68dff921e3d24baf2847ebace82e26264e2307c1676fb7b17ecdb925285783fe7a4a5e58acbfe12691029cae1e8cae37d2c2
    REFRESH_TOKEN_KEY=92c03f52876f7fdd298d564510ebc9a43d5f5f6abee41c984e2ccd6dc8bd7f6172cccb3711d3ff252b02e009844be73a6be9f3a887d6f0e891be0436d34697c7
    ACCESS_TOKEN_AGE=3000

3. Execute databse creation:
    ```bash
    npm run migrate up
4. Run the application:
    ```bash
    npm run start:dev
    ```