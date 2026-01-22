#!/bin/bash

# =================================================================
# ELINITY V3 - FRESH FOLDER DEPLOYMENT (Port 8095)
# =================================================================

# 1. Environment Setup
echo "📝 Setting up environment..."
if [ -f "env.h" ]; then
    cp env.h .env
else
    echo "❌ ERROR: env.h not found!"
    exit 1
fi

# 2. Check for Password Placeholder
if grep -q "\[YOUR-PASSWORD\]" .env; then
    echo "⚠️  PASSWORD REQUIRED!"
    read -sp "Enter Supabase DB Password: " DB_PASS
    echo ""
    sed -i "s/\[YOUR-PASSWORD\]/$DB_PASS/g" .env
fi

# 3. Generate Docker Compose for V3 (Unique Ports/Names)
echo "🔧 Generating V3 Docker Config..."
cat <<EOF > docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    container_name: elinity-v3-redis
    restart: always
    ports:
      - "6395:6379"

  elinity-app:
    build: .
    container_name: elinity-v3-app
    restart: always
    ports:
      - "8095:8081"
    env_file: .env
    environment:
      - REDIS_URL=redis://redis:6379/0
      - REDIS_HOST=redis
    command: uvicorn main:app --host 0.0.0.0 --port 8081
    depends_on:
      - redis
EOF

# 4. Cleanup V3 Containers (Just in case)
echo "🧹 Cleaning up any previous V3 attempts..."
sudo docker stop elinity-v3-app elinity-v3-redis 2>/dev/null
sudo docker rm elinity-v3-app elinity-v3-redis 2>/dev/null

# 5. Build and Launch
echo "🚀 Launching Elinity V3 on Port 8095..."
sudo docker-compose up -d --build

# 6. Database Migration
echo "🔄 Running Supabase Migrations..."
sleep 5
sudo docker exec elinity-v3-app alembic upgrade head

echo "------------------------------------------------"
echo "✅ Elinity V3 is LIVE on Port 8095!"
echo "📡 Connected to Supabase External DB"
echo "📄 Docs: http://YOUR_IP:8095/docs"
echo "------------------------------------------------"
