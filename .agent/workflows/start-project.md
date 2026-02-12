---
description: Start Elinity Backend (Docker) and Frontend
---

This workflow starts the backend using Docker Compose and the frontend using Vite.

1. Ensure Docker Desktop is running.
2. Start the backend services in detached mode:
   // turbo
   `docker-compose -f docker-compose.local.yml up -d --build`
3. Navigate to the frontend directory and start the development server:
   // turbo
   `cd Elinity-WebApp-master/Elinity_webapp && npm run dev`
4. Backend will be available at http://localhost:8000
5. Frontend will be available at http://localhost:5173
