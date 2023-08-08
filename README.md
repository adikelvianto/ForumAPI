# ForumAPI

[![CI](https://github.com/adikelvianto/ForumAPI/actions/workflows/ci.yml/badge.svg)](https://github.com/adikelvianto/ForumAPI/actions/ci.yml)
[![CD](https://github.com/adikelvianto/ForumAPI/actions/workflows/cd.yml/badge.svg)](https://github.com/adikelvianto/ForumAPI/actions/cd.yml)

ForumAPI is a project developed to fulfill the requirements of the "Menjadi Back-End Developer Expert" course. 
<br><br>
This API was created using **Test Driven Development** methods, which include Unit Tests, Integration Tests, and Functional Tests. 
It follows a **clean architecture pattern*** and was dominantly built using **node.js**, **Hapi** plugin, and **PostgreSQL** database. For deployment, an **EC2** instance and **RDS** were utilized.
<br><br>
ForumAPI has gone through a **CI/CD** process with **GitHub Actions** and also applies **access limits using nginx** for better security. Moreover, **HTTPS protocol is used** to enhance security.

Features embedded in ForumAPI include:
- User Registration and Authentication
- Thread Creation
- Post Comment on a Thread
- Comment Deletion
- Displaying Detail Thread
