#!/bin/bash

# =================================================================
# ELINITY HOSTINGER DEPLOYMENT (Self-Contained DB & Redis)
# =================================================================

echo "📝 Preparing Deployment..."

# 1. Environment Check
if [ ! -f ".env.hostinger" ]; then
    echo "❌ ERROR: .env.hostinger not found! Please create it from the template."
    exit 1
fi

# 2. Stop and Remove old containers
echo "🧹 Cleaning up previous deployment..."
docker-compose -f docker-compose.hostinger.yml down --remove-orphans

# 3. Pull/Build and Launch
echo "🚀 Launching Elinity Stack (Postgres, Redis, Backend, Frontend)..."
docker-compose -f docker-compose.hostinger.yml up -d --build

# 4. Database Migration
echo "🔄 Waiting for Database and Running Migrations..."
sleep 10
docker exec elinity-backend alembic upgrade head

echo "------------------------------------------------"
echo "✅ Elinity is LIVE on Hostinger!"
echo "🏠 Frontend: http://YOUR_VPS_IP"
echo "📡 Backend API: http://YOUR_VPS_IP:8000"
echo "📄 API Docs: http://YOUR_VPS_IP:8000/docs"
echo "------------------------------------------------"
