# ContactShip Test Service

Backend service built with NestJS and TypeScript to manage leads,
process asynchronous jobs, and generate AI-powered summaries.

This project was developed from a technical challenge and reflects my
approach to structuring scalable and maintainable backend services.

------------------------------------------------------------------------

## 🚀 Tech Stack

-   NestJS
-   TypeScript
-   Redis
-   BullMQ
-   Google Gemini API
-   Docker (for local Redis setup)

------------------------------------------------------------------------

## 🏗 Architecture Overview

The application follows a modular architecture using NestJS best
practices:

-   Clear separation of concerns (controllers, services, modules)
-   Asynchronous job processing using BullMQ
-   Redis used for queue management and caching
-   External AI integration encapsulated behind a service layer

The goal was to keep the codebase structured, readable, and easily
extensible.

------------------------------------------------------------------------

## 🔄 Asynchronous Processing

One of the core aspects of this project is the use of queues:

-   Lead processing tasks are pushed into a Redis-backed queue
-   BullMQ handles job execution
-   AI summary generation runs asynchronously

This approach: - Improves response time - Decouples heavy processing
from request lifecycle - Makes the system easier to scale horizontally

------------------------------------------------------------------------

## 📦 Installation

### 1️⃣ Clone the repository

git clone https://github.com/oriel-r/contactship-test-service.git\
cd contactship-test-service

### 2️⃣ Install dependencies

npm install

### 3️⃣ Configure environment variables

Create a `.env` file:

PORT=3000\
REDIS_HOST=localhost\
REDIS_PORT=6379\
GEMINI_API_KEY=your_api_key

### 4️⃣ Run Redis (Docker example)

docker run -d -p 6379:6379 redis

### 5️⃣ Start the server

npm run start:dev

------------------------------------------------------------------------

## 📌 API Endpoints (High-Level)

-   Create Lead
-   Get Leads
-   Trigger AI Summary generation

(See controllers for detailed route definitions.)

------------------------------------------------------------------------

## 🧠 Design Decisions

-   Used queues to prevent blocking operations.
-   Encapsulated AI integration to allow future provider replacement.
-   Focused on modularity to simplify future feature additions.
-   Designed with scalability in mind rather than quick scripting.

------------------------------------------------------------------------

## 🔍 What I Would Improve

If this were production-ready, I would add:

-   Integration and e2e tests
-   Structured logging (Winston / Pino)
-   Observability (metrics + tracing)
-   Centralized error handling improvements
-   CI/CD pipeline configuration

------------------------------------------------------------------------

## 📬 Feedback

Feedback is welcome.\
I'm always open to discussing architecture decisions and backend design
patterns.