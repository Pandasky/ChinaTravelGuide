#!/bin/bash
# ChinaWise 服务器部署脚本
# 在服务器上执行此脚本

set -e

echo "=========================================="
echo "ChinaWise 部署脚本"
echo "=========================================="

# 更新系统
echo "[1/8] 更新系统..."
apt update && apt upgrade -y

# 安装 Docker
echo "[2/8] 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker root
fi

# 安装 Docker Compose
echo "[3/8] 安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 创建应用目录
echo "[4/8] 创建应用目录..."
mkdir -p /opt/chinawise
cd /opt/chinawise

# 等待代码上传
echo "[5/8] 等待代码上传..."
echo "请使用 SCP 上传代码到 /opt/chinawise/"
echo "命令: scp -r chinawise-deploy/* root@101.132.45.125:/opt/chinawise/"

# 配置 .env 文件
echo "[6/8] 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "请编辑 .env 文件，配置必要的环境变量"
    echo "必须配置: DB_PASSWORD, JWT_SECRET, OPENROUTER_API_KEY, STRIPE_SECRET_KEY"
fi

# 部署
echo "[7/8] 开始部署..."
chmod +x scripts/deploy.sh
./scripts/deploy.sh deploy

# 配置防火墙
echo "[8/8] 配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "=========================================="
echo "部署完成!"
echo "访问: http://101.132.45.125"
echo "API: http://101.132.45.125/api"
echo "=========================================="
