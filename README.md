# ChinaWise - 中国智慧旅游指南平台

> 为海外游客提供权威、实时、可离线使用的 PDF 旅游指南和 24/7 AI 旅游咨询服务

## 🌟 项目介绍

ChinaWise 是一个面向海外游客的一站式中国旅行信息服务平台，解决海外游客来中国旅游面临的三大核心痛点：信息碎片化且不准确、语言障碍严重、当地文化习俗不了解。

### 核心功能

- **PDF 旅游指南商城**: 购买和下载专业制作的城市旅游指南
- **AI 旅游咨询**: 24/7 全天候 AI 助手回答旅行问题
- **多语言支持**: 为英语用户提供优质服务 (后续支持多语言)

### 商业模式

- PDF 旅游指南单次付费下载
- AI 旅游咨询订阅制 ($2.99/天, $9.99/周, $19.99/月)

## 🚀 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **UI 组件**: Material-UI v6
- **状态管理**: Redux Toolkit
- **路由**: React Router v7

### 后端
- **框架**: NestJS
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **缓存**: Redis
- **认证**: JWT + Passport

### 第三方服务
- **AI**: OpenRouter API (支持多模型切换)
- **支付**: Stripe + PayPal
- **存储**: 阿里云 OSS

## 📁 项目结构

```
ChinaTravelGuide/
├── apps/
│   ├── web/              # 前端 React + Vite
│   │   ├── src/
│   │   │   ├── components/   # React 组件
│   │   │   ├── pages/        # 页面组件
│   │   │   ├── services/     # API 服务
│   │   │   ├── store/        # Redux Store
│   │   │   └── types/        # TypeScript 类型
│   │   └── package.json
│   └── api/              # 后端 NestJS
│       ├── src/
│       ├── prisma/       # 数据库 Schema
│       └── package.json
├── packages/
│   ├── shared-types/     # 共享类型定义
│   └── ui-components/    # 共享 UI 组件
├── docker-compose.yml    # Docker 开发环境
├── pnpm-workspace.yaml   # pnpm 工作区配置
└── package.json          # 根目录配置
```

## 🛠️ 开发环境搭建

### 前置要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker (可选，用于本地数据库)

### 快速开始

1. **克隆项目**
```bash
git clone <repository-url>
cd ChinaTravelGuide
```

2. **安装依赖**
```bash
pnpm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

4. **启动开发环境 (使用 Docker)**
```bash
# 启动数据库、Redis 和 API
docker-compose up -d

# 前端开发服务器
pnpm dev:web
```

或者 **本地开发**:
```bash
# 需要本地 PostgreSQL 和 Redis
# 1. 启动后端
pnpm dev:api

# 2. 启动前端 (新终端)
pnpm dev:web
```

5. **访问应用**
- 前端: http://localhost:5173
- 后端 API: http://localhost:3000

### 数据库操作

```bash
# 生成 Prisma Client
pnpm db:generate

# 运行数据库迁移
pnpm db:migrate

# 打开 Prisma Studio
pnpm db:studio
```

## 📝 设计规范

### 色彩系统

| 颜色类型 | 色值 | 用途 |
|---------|------|------|
| 主色调 | `#2C3E50` | 标题、导航栏、主要按钮 |
| 强调色 | `#E67E22` | CTA 按钮、链接、强调文字 |
| 背景色 | `#FFFFFF` | 页面背景 |
| 浅背景色 | `#F8F9FA` | 卡片背景、输入框背景 |
| 主要文字 | `#333333` | 正文、标题 |
| 次要文字 | `#6C757D` | 辅助文字、说明文字 |
| 边框色 | `#DEE2E6` | 边框、分割线 |
| 成功色 | `#28A745` | 成功提示 |
| 错误色 | `#DC3545` | 错误提示 |

### 字体系统

- **英文**: Inter
- **中文**: Noto Sans SC

### 响应式断点

- **桌面端**: ≥1200px
- **平板端**: 768px-1199px
- **移动端**: <768px

## 📚 文档

- [API 文档](./docs/api.md)
- [前端组件文档](./docs/components.md)
- [部署指南](./docs/deployment.md)

## 🤝 贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

[MIT](LICENSE)

## 📧 联系我们

- 邮箱: contact@chinawise.travel
- 网站: https://chinawise.travel
