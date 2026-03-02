# 智会矩阵 SmartMeet Matrix

> AI+会议助手智能体应用 | AI-Powered Conference Assistant Agent Application

智会矩阵（SmartMeet Matrix）是一款基于AI大模型技术的智能会议助手应用，旨在解决传统会议场景中的信息管理低效、互动不足及个性化服务缺失等问题。构建智能化会议管理生态系统，为参会者提供精准导航、高效资料检索、多语言交互及个性化推荐服务，同时为会议主办方提供全流程数据驱动的管理工具，推动会议管理向数字化、自动化和高互动性方向演进。

## ✨ 功能特性

### 主办方 (PC端)
- **会议创建与管理**：支持时间、地点、议题的全流程配置
- **数据大屏**：实时监控参会率、热点议题及会议动态
- **资料库管理**：构建一体化资料库，支持一键式批量下载与智能检索
- **多语言支持**：自动翻译会议资料与实时字幕

### 参会者 (移动端)
- **智能导航**：连接百度地图api，提供智能路径规划
- **AI助手**：支持语音交互、多语言翻译及智能问答
- **个性推荐**：基于混合推荐算法，动态适配用户需求
- **社交互动**：会议社区平台，激活线上线下融合的社交场景
- **安全防护**：基于用户行为画像的安全监测与提醒

## 🛠️ 技术栈

### 前端
- **PC端 (Web)**: Vue 3 + Element Plus + Vite + Pinia + ECharts
- **移动端 (App)**: UniApp + uView UI + Vue 3 + Pinia
- **AI能力**: 科大讯飞API (实时ASR)
- **会议能力**: zego sdk (实时音视频)

### 后端
- **框架**: Spring Boot 3 + Mybatis Plus
- **数据库**: MySQL 8.0+
- **缓存**: Redis
- **文件存储**: 阿里云 OSS
- **AI能力**: 百度AI SDK (OCR), Kimi API (大模型)

### 开发工具
- **前端构建**: Vite (Web), HBuilderX (App)
- **后端构建**: Maven
- **接口文档**: OpenAPI + Swagger
- **版本控制**: Git

## 📁 项目结构

```
smartmeet-matrix/
├── backend-springboot/         # Spring Boot 后端服务
│   ├── src/                    # 源代码
│   ├── pom.xml                 # Maven 依赖配置
│   └── target/                 # 编译输出
├── frontend-web/               # PC端 Vue3 项目
│   ├── src/                    # 前端源代码
│   ├── public/                 # 静态资源
│   ├── package.json            # 依赖配置
│   └── vite.config.js          # Vite 配置
├── frontend-app/               # 移动端 UniApp 项目
│   ├── pages/                  # 页面组件
│   ├── components/             # 公共组件
│   ├── static/                 # 静态资源
│   ├── package.json            # 依赖配置
│   └── manifest.json           # App 配置
└── LICENSE                     # MIT 许可证
```

## 🚀 快速开始

### 环境要求
- JDK 17+ (后端)
- Node.js 18+ (前端)
- MySQL 8.0+ (数据库)
- Redis 7.0+ (缓存)
- Maven 3.6+ (后端构建)

### 1. 后端服务启动

```bash
cd backend-springboot

# 配置数据库 (修改 application.yml 中的数据库连接信息)
# 创建数据库 meeting_db

# 编译并运行
mvn clean install
mvn spring-boot:run
```

后端服务默认运行在 `http://localhost:8080`

### 2. PC端 Web 项目启动

```bash
cd frontend-web

# 安装依赖
npm install

# 开发模式运行
npm run dev
```

Web 服务默认运行在 `http://localhost:5173`

### 3. 移动端 App 项目启动

```bash
cd frontend-app

# 安装依赖
npm install

# 使用 HBuilderX 打开项目并运行到模拟器或真机
# 或使用命令行 (需安装 @dcloudio/uni-cli)
# npm run dev:mp-weixin  # 微信小程序
# npm run build:app      # 打包 App
```

> 注意：移动端项目需要 HBuilderX 或 UniApp CLI 进行编译和运行

### 4. 初始化数据库

1. 创建数据库 `meeting_db`
2. 执行 SQL 脚本 (位于 `backend-springboot/src/main/resources/schema.sql`，如有)
3. 配置数据源信息在 `application.yml`

## 🔧 配置说明

### 后端配置 (`backend-springboot/src/main/resources/application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/yourdatabase
    username: root
    password: yourpassword
  redis:
    host: localhost
    port: 6379
    password: 
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# 阿里云 OSS 配置
请前往AliOssUtil.java进行配置

# 百度 AI 配置
请前往FileContentController.java进行配置
```

### 前端 API 配置
- PC端: 修改 `frontend-web/src/config/api.js` 中的 `baseURL`
- 移动端: 修改 `frontend-app/config/api.js` 中的 `baseURL`

## 📈 开发计划

### 已完成
- [x] 项目架构设计与技术选型
- [x] 后端基础框架搭建 (Spring Boot + MyBatis Plus)
- [x] PC端基础框架搭建 (Vue3 + Element Plus)
- [x] 移动端基础框架搭建 (UniApp + uView UI)
- [x] 数据库设计与基础表结构
- [x] 后端接口文档 (openapi + swagger生成)

### 计划中
- [ ] 重构个性化推荐 (使用文本相似度计算)

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**智会矩阵** - 让会议更智能，让连接更紧密！