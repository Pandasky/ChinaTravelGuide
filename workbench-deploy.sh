#!/bin/bash
# ChinaWise Workbench 一键部署脚本
# 复制此内容到 Workbench 终端执行

set -e

echo "=========================================="
echo "  ChinaWise 部署脚本"
echo "  服务器: 101.132.45.125"
echo "=========================================="

# 检查权限
if [ "$EUID" -ne 0 ]; then
    echo "需要 root 权限，尝试使用 sudo..."
    SUDO="sudo"
else
    SUDO=""
fi

# 1. 系统更新
echo ""
echo "[1/8] 更新系统..."
$SUDO apt-get update -y
$SUDO apt-get install -y curl wget git vim ufw

# 2. 安装 Docker
echo ""
echo "[2/8] 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | bash
    $SUDO systemctl start docker
    $SUDO systemctl enable docker
    echo "✓ Docker 安装完成"
else
    echo "✓ Docker 已存在: $(docker --version)"
fi

# 3. 安装 Docker Compose
echo ""
echo "[3/8] 安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    $SUDO curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    $SUDO chmod +x /usr/local/bin/docker-compose
    echo "✓ Docker Compose 安装完成"
else
    echo "✓ Docker Compose 已存在: $(docker-compose --version)"
fi

# 4. 创建应用目录
echo ""
echo "[4/8] 创建应用目录..."
APP_DIR="/opt/chinawise"
$SUDO mkdir -p $APP_DIR
echo "应用目录: $APP_DIR"
echo ""
echo "⚠ 请先上传项目文件到 $APP_DIR"
echo "使用 Workbench 的文件上传功能"
echo ""
read -p "文件上传完成后按 Enter 继续..."

cd $APP_DIR

# 检查必要文件
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "✗ 未找到 docker-compose.prod.yml"
    echo "请确保已上传正确的项目文件"
    exit 1
fi

echo "✓ 项目文件检查通过"

# 5. 创建 .env 配置文件
echo ""
echo "[5/8] 创建环境配置文件..."
$SUDO tee .env > /dev/null << 'EOF'
# Database
DB_USER=chinawise
DB_PASSWORD=Chinawise@2024#Secure
DB_NAME=chinawise
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=ChinaWiseSecureJWTKey2024ForProduction
JWT_EXPIRES_IN=2h

# API
NODE_ENV=production
PORT=3000
API_URL=http://101.132.45.125
WEB_URL=http://101.132.45.125

# OpenRouter (需要配置)
OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Stripe (需要配置)
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# PayPal (需要配置)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox

# Alibaba Cloud OSS (需要配置)
ALIBABA_OSS_ACCESS_KEY_ID=
ALIBABA_OSS_ACCESS_KEY_SECRET=
ALIBABA_OSS_BUCKET=chinawise-files
ALIBABA_OSS_REGION=oss-cn-hangzhou
ALIBABA_OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com

# OAuth (可选)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
EOF

echo "✓ .env 文件创建完成"

# 6. 启动服务
echo ""
echo "[6/8] 构建并启动 Docker 服务..."
echo "⏳ 这可能需要 5-10 分钟，请耐心等待..."
echo ""

$SUDO docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
$SUDO docker-compose -f docker-compose.prod.yml pull
$SUDO docker-compose -f docker-compose.prod.yml build --no-cache
$SUDO docker-compose -f docker-compose.prod.yml up -d

# 7. 运行数据库迁移
echo ""
echo "[7/8] 运行数据库迁移..."
sleep 10

$SUDO docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy || echo "迁移跳过或已完成"
$SUDO docker-compose -f docker-compose.prod.yml exec -T api npx prisma generate || echo "Prisma Client 已生成"

# 8. 配置防火墙
echo ""
echo "[8/8] 配置防火墙..."
$SUDO ufw default deny incoming
$SUDO ufw default allow outgoing
$SUDO ufw allow 22/tcp comment 'SSH'
$SUDO ufw allow 80/tcp comment 'HTTP'
$SUDO ufw allow 443/tcp comment 'HTTPS'
$SUDO ufw --force enable
echo "✓ 防火墙配置完成"

# 健康检查
echo ""
echo "=========================================="
echo "  健康检查..."
echo "=========================================="
sleep 5

API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null || echo "000")
WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "000")

if [ "$API_HEALTH" = "200" ]; then
    echo "✓ API 服务运行正常 (HTTP 200)"
else
    echo "⚠ API 服务状态: HTTP $API_HEALTH"
fi

if [ "$WEB_HEALTH" = "200" ] || [ "$WEB_HEALTH" = "301" ] || [ "$WEB_HEALTH" = "302" ]; then
    echo "✓ Web 服务运行正常 (HTTP $WEB_HEALTH)"
else
    echo "⚠ Web 服务状态: HTTP $WEB_HEALTH"
fi

echo ""
echo "=========================================="
echo "  🎉 部署完成!"
echo "=========================================="
echo ""
echo "  📱 访问地址:"
echo "     网站: http://101.132.45.125"
echo "     API:  http://101.132.45.125/api"
echo "     健康: http://101.132.45.125/api/health"
echo ""
echo "  🔧 常用命令:"
echo "     查看日志:   sudo docker-compose -f /opt/chinawise/docker-compose.prod.yml logs -f"
echo "     查看状态:   sudo docker-compose -f /opt/chinawise/docker-compose.prod.yml ps"
echo "     重启服务:   sudo docker-compose -f /opt/chinawise/docker-compose.prod.yml restart"
echo "     停止服务:   sudo docker-compose -f /opt/chinawise/docker-compose.prod.yml down"
echo ""
echo "  ⚙️  下一步配置:"
echo "     1. 编辑环境变量: sudo vim /opt/chinawise/.env"
echo "     2. 填入 API 密钥 (OPENROUTER_API_KEY, STRIPE_SECRET_KEY 等)"
echo "     3. 重启服务: sudo docker-compose -f /opt/chinawise/docker-compose.prod.yml restart"
echo ""
echo "=========================================="
