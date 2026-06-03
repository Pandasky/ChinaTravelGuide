#!/bin/bash
# ChinaWise 远程安装脚本
# 执行: curl -fsSL https://pastebin.com/raw/xxxxx | bash

set -e

echo "=========================================="
echo "  ChinaWise 远程部署"
echo "=========================================="

# 创建临时目录
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

echo "[1/5] 下载项目代码..."
# 使用 GitHub 原始文件下载
REPO_URL="https://github.com/Pandasky/ChinaTravelGuide"

# 尝试下载
curl -fsSL "$REPO_URL/archive/refs/heads/main.tar.gz" -o code.tar.gz 2>/dev/null || \
curl -fsSL "$REPO_URL/archive/refs/heads/master.tar.gz" -o code.tar.gz 2>/dev/null || {
    echo "✗ GitHub 下载失败"
    echo "请检查网络连接或手动上传代码"
    exit 1
}

echo "[2/5] 解压代码..."
tar -xzf code.tar.gz
mv ChinaTravelGuide-* chinawise

# 移动到应用目录
echo "[3/5] 安装到 /opt/chinawise..."
mkdir -p /opt/chinawise
cp -r chinawise/* /opt/chinawise/
cd /opt/chinawise

# 创建环境配置
echo "[4/5] 配置环境..."
cat > .env << 'EOF'
DB_USER=chinawise
DB_PASSWORD=Chinawise@2024#Secure
DB_NAME=chinawise
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public
REDIS_URL=redis://redis:6379
JWT_SECRET=ChinaWiseSecureJWTKey2024ForProduction
JWT_EXPIRES_IN=2h
NODE_ENV=production
PORT=3000
API_URL=http://101.132.45.125
WEB_URL=http://101.132.45.125
OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox
ALIBABA_OSS_ACCESS_KEY_ID=
ALIBABA_OSS_ACCESS_KEY_SECRET=
ALIBABA_OSS_BUCKET=chinawise-files
ALIBABA_OSS_REGION=oss-cn-hangzhou
ALIBABA_OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
EOF

# 安装 Docker（如果需要）
echo "[5/5] 检查 Docker..."
if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    curl -fsSL https://get.docker.com | bash
    systemctl start docker
fi

if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 启动服务
echo "=========================================="
echo "  启动服务..."
echo "=========================================="
docker-compose -f docker-compose.prod.yml up -d

echo "✓ 部署完成!"
echo "访问: http://101.132.45.125"

# 清理
rm -rf "$TMP_DIR"
