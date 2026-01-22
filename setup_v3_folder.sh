#!/bin/bash
# Run this on Hostinger to set up the V3 folder

# 1. Create New Folder
mkdir -p /root/elinity-backend-v3
cd /root/elinity-backend-v3

# 2. Clone Repo (Fresh)
echo "📥 Cloning Repository..."
git clone https://github.com/2100080051/elinity-backend-p1.git .

# 3. Run Launch Script
echo "🚀 Starting Deployment..."
bash hostinger_launch.sh
