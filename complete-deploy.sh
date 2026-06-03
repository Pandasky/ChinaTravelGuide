#!/bin/bash
# ChinaWise 完整部署脚本
# 在服务器上执行此脚本

set -e

echo "=========================================="
echo "  ChinaWise 部署脚本"
echo "  服务器: 101.132.45.125"
echo "=========================================="

# 检查是否以 root 或 admin 运行
if [ "$EUID" -ne 0 ] && [ "$USER" != "admin" ]; then
    echo "请使用 root 或 admin 用户执行"
    exit 1
fi

# 1. 系统更新
echo ""
echo "[1/10] 更新系统..."
apt-get update -y
apt-get install -y curl wget git vim ufw

# 2. 安装 Docker
echo ""
echo "[2/10] 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | bash
    systemctl start docker
    systemctl enable docker
    echo "✓ Docker 安装完成"
else
    echo "✓ Docker 已存在"
fi
docker --version

# 3. 安装 Docker Compose
echo ""
echo "[3/10] 安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✓ Docker Compose 安装完成"
else
    echo "✓ Docker Compose 已存在"
fi
docker-compose --version

# 4. 创建应用目录
echo ""
echo "[4/10] 创建应用目录..."
APP_DIR="/opt/chinawise"
mkdir -p $APP_DIR
cd $APP_DIR

# 5. 下载代码
echo ""
echo "[5/10] 下载项目代码..."
if [ -d ".git" ]; then
    echo "已有代码，执行更新..."
    git pull origin main || git pull origin master
else
    # 尝试从 GitHub 克隆
    echo "尝试从 GitHub 克隆..."
    if git clone https://github.com/Pandasky/ChinaTravelGuide.git . 2>/dev/null; then
        echo "✓ GitHub 克隆成功"
    else
        echo "✗ GitHub 克隆失败"
        echo "请手动上传代码到 $APP_DIR"
        echo "本地执行: scp -r ChinaTravelGuide/* admin@101.132.45.125:$APP_DIR/"
        exit 1
    fi
fi

# 6. 创建 .env 配置文件
echo ""
echo "[6/10] 创建环境配置文件..."
cat > .env << 'ENVEOF'
# ==========================================
# Database Configuration
# ==========================================
DB_USER=chinawise
DB_PASSWORD=Chinawise@2024#Secure!Pwd
DB_NAME=chinawise
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public

# ==========================================
# Redis Configuration
# ==========================================
REDIS_URL=redis://redis:6379

# ==========================================
# JWT Configuration
# ==========================================
JWT_SECRET=ChinaWiseSecureJWTKey2024ForProductionDeployment
JWT_EXPIRES_IN=2h

# ==========================================
# API Configuration
# ==========================================
NODE_ENV=production
PORT=3000
API_URL=http://101.132.45.125
WEB_URL=http://101.132.45.125

# ==========================================
# OpenRouter AI Configuration
# TODO: 请替换为你的真实 API Key
# ==========================================
OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# ==========================================
# Stripe Payment Configuration
# TODO: 请替换为你的真实密钥
# ==========================================
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# ==========================================
# PayPal Configuration
# TODO: 请替换为你的真实密钥
# ==========================================
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox

# ==========================================
# Alibaba Cloud OSS Configuration
# TODO: 请替换为你的真实密钥
# ==========================================
ALIBABA_OSS_ACCESS_KEY_ID=
ALIBABA_OSS_ACCESS_KEY_SECRET=
ALIBABA_OSS_BUCKET=chinawise-files
ALIBABA_OSS_REGION=oss-cn-hangzhou
ALIBABA_OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com

# ==========================================
# OAuth Configuration
# TODO: 请替换为你的真实密钥
# ==========================================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=

# ==========================================
# Rate Limiting
# ==========================================
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
ENVEOF

echo "✓ .env 文件创建完成"
echo "⚠ 注意: 请编辑 .env 文件填入你的真实 API 密钥"

# 7. 启动服务
echo ""
echo "[7/10] 构建并启动 Docker 服务..."
echo "这可能需要 5-10 分钟，请耐心等待..."

docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 8. 等待服务启动
echo ""
echo "[8/10] 等待服务启动..."
sleep 15

# 9. 运行数据库迁移
echo ""
echo "[9/10] 运行数据库迁移..."
docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy || echo "迁移可能已执行"
docker-compose -f docker-compose.prod.yml exec -T api npx prisma generate || echo "Prisma Client 已生成"

# 10. 配置防火墙
echo ""
echo "[10/10] 配置防火墙..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 3000/tcp comment 'API' 2>/dev/null || true
ufw --force enable

echo "✓ 防火墙配置完成"

# 健康检查
echo ""
echo "=========================================="
echo "  部署完成！正在进行健康检查..."
echo "=========================================="

sleep 5

# 检查 API
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✓ API 服务运行正常"
else
    echo "✗ API 服务可能未启动，请检查日志"
fi

# 检查 Web
if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✓ Web 服务运行正常"
else
    echo "✗ Web 服务可能未启动，请检查日志"
fi

echo ""
echo "=========================================="
echo "  🎉 部署完成!"
echo "=========================================="
echo ""
echo "  访问地址:"
echo "    - 网站: http://101.132.45.125"
echo "    - API:  http://101.132.45.125/api"
echo "    - 健康: http://101.132.45.125/api/health"
echo ""
echo "  常用命令:"
echo "    查看日志:   docker-compose -f docker-compose.prod.yml logs -f"
echo "    查看状态:   docker-compose -f docker-compose.prod.yml ps"
echo "    重启服务:   docker-compose -f docker-compose.prod.yml restart"
echo "    停止服务:   docker-compose -f docker-compose.prod.yml down"
echo ""
echo "  下一步:"
echo "    1. 编辑 .env 文件填入 API 密钥"
echo "       vim /opt/chinawise/.env"
echo ""
echo "    2. 重启服务生效"
echo "       docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "    3. 配置域名和 HTTPS（推荐）"
echo "       参考 DEPLOY.md 文档"
echo ""
echo "=========================================="
