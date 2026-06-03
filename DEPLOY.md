# ChinaWise 部署指南

## 系统要求

- Docker 24.0+
- Docker Compose 2.20+
- 2GB+ 可用内存
- 10GB+ 可用磁盘空间

## 快速开始

### 1. 环境准备

```bash
# 克隆代码
git clone https://github.com/your-org/chinawise.git
cd chinawise

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写所有必要的配置
nano .env
```

### 2. 启动服务

```bash
# 使用部署脚本
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# 或者使用 docker-compose 直接启动
docker-compose -f docker-compose.prod.yml up -d
```

### 3. 数据库迁移

```bash
# 首次部署需要运行迁移
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# 生成 Prisma Client
docker-compose -f docker-compose.prod.yml exec api npx prisma generate
```

### 4. 验证部署

```bash
# 检查服务状态
docker-compose -f docker-compose.prod.yml ps

# 检查 API 健康状态
curl http://localhost:3000/api/health

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

## 部署命令参考

```bash
# 部署（默认）
./scripts/deploy.sh deploy

# 带备份的部署
BACKUP=true ./scripts/deploy.sh deploy

# 查看状态
./scripts/deploy.sh status

# 查看日志
./scripts/deploy.sh logs

# 重启服务
./scripts/deploy.sh restart

# 停止服务
./scripts/deploy.sh stop

# 创建备份
./scripts/deploy.sh backup

# 清理未使用的 Docker 资源
./scripts/deploy.sh cleanup
```

## SSL/HTTPS 配置

### 使用 Let's Encrypt (推荐)

1. 编辑 `docker-compose.prod.yml`，取消 nginx 和 certbot 服务的注释

2. 创建 nginx 配置目录：
```bash
mkdir -p nginx/ssl
```

3. 创建 `nginx/nginx.conf`：
```nginx
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:80;
    }

    upstream api {
        server api:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        location /api/ {
            proxy_pass http://api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://web;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
        }
    }
}
```

4. 获取初始证书：
```bash
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  --agree-tos --no-eff-email \
  -d yourdomain.com -d www.yourdomain.com
```

5. 启动所有服务：
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 备份与恢复

### 自动备份

添加 cron 任务：
```bash
# 编辑 crontab
crontab -e

# 每天凌晨3点自动备份
0 3 * * * cd /opt/chinawise && ./scripts/deploy.sh backup
```

### 手动备份

```bash
# 创建备份
./scripts/deploy.sh backup

# 备份文件保存在 ./backups/YYYYMMDD_HHMMSS/backup.sql
```

### 数据恢复

```bash
# 停止服务
docker-compose -f docker-compose.prod.yml stop api

# 恢复数据
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER -d $DB_NAME < backups/YYYYMMDD_HHMMSS/backup.sql

# 重启服务
docker-compose -f docker-compose.prod.yml start api
```

## 监控与告警

### 健康检查

- API: `http://yourdomain.com/api/health`
- Web: `http://yourdomain.com/`

### 日志查看

```bash
# 查看所有服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f api

# 查看最近的 100 行日志
docker-compose -f docker-compose.prod.yml logs --tail=100 api
```

### 资源监控

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df
```

## 故障排查

### 服务无法启动

```bash
# 检查日志
docker-compose -f docker-compose.prod.yml logs api

# 检查端口占用
netstat -tlnp | grep 3000
netstat -tlnp | grep 80

# 检查环境变量
docker-compose -f docker-compose.prod.yml config
```

### 数据库连接失败

```bash
# 检查数据库服务状态
docker-compose -f docker-compose.prod.yml ps postgres

# 检查数据库日志
docker-compose -f docker-compose.prod.yml logs postgres

# 测试数据库连接
docker-compose -f docker-compose.prod.yml exec postgres psql -U $DB_USER -d $DB_NAME -c "SELECT 1"
```

### 迁移失败

```bash
# 查看迁移状态
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate status

# 重置数据库（危险操作！会丢失数据）
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate reset --force
```

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 部署（会自动备份）
./scripts/deploy.sh deploy

# 3. 验证
curl http://localhost:3000/api/health
```

## 安全建议

1. **修改默认密码**: 确保修改所有默认密码，包括数据库密码、JWT 密钥
2. **防火墙配置**: 只开放 80 和 443 端口
3. **定期更新**: 定期更新 Docker 镜像和系统补丁
4. **SSL 证书**: 使用 HTTPS，定期更新 SSL 证书
5. **访问控制**: 限制服务器 SSH 访问，使用密钥认证

## 性能优化

### 数据库优化

```bash
# 定期 VACUUM
docker-compose -f docker-compose.prod.yml exec postgres psql -U $DB_USER -d $DB_NAME -c "VACUUM ANALYZE"
```

### Nginx 缓存

在 `nginx.conf` 中添加：
```nginx
# 静态文件缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 联系与支持

如有问题，请通过以下方式联系：
- GitHub Issues: https://github.com/your-org/chinawise/issues
- Email: support@yourdomain.com
