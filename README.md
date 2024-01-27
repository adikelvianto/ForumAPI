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