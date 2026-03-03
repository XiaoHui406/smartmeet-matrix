# FastAPI 后端运行指南

本文档说明如何使用 `uv` 或 `pip` 配置虚拟环境、安装依赖并运行 FastAPI 后端服务。

---

## 📋 前置条件

- Python 3.8+
- 良好的网络环境（用于自动下载 embeddings 模型）

---

## 🐍 方法一：使用 uv（推荐）

### 1. 安装 uv

```bash
pip install uv
```

### 2. 创建并激活虚拟环境

```bash
# 创建虚拟环境
uv venv venv

# Windows 激活
venv\Scripts\activate

# macOS/Linux 激活
source venv/bin/activate
```

### 3. 安装依赖

```bash
uv sync
```

### 4. 启动 Chroma 向量数据库

**⚠️ 重要：在运行 main.py 之前，必须先启动 Chroma 服务**

```bash
# 在虚拟环境中或者.venv\Scripts目录下执行
chroma run --port=8001
```

保持该终端窗口运行，不要关闭。

### 5. 运行 FastAPI 后端

在另一个终端窗口中：

```bash
uv run main.py
# 或者确保虚拟环境已激活时执行
python main.py
```

**注意**：首次运行时会自动下载一个约 80MB 的 embeddings 模型，请确保网络环境良好。

---

## 📦 方法二：使用 pip

### 1. 创建并激活虚拟环境

```bash
# 创建虚拟环境
python -m venv venv

# Windows 激活
venv\Scripts\activate

# macOS/Linux 激活
source venv/bin/activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 启动 Chroma 向量数据库

**⚠️ 重要：在运行 main.py 之前，必须先启动 Chroma 服务**

```bash
# 在虚拟环境中或者.venv\Scripts目录下执行
chroma run --port=8001
```

保持该终端窗口运行，不要关闭。

### 4. 运行 FastAPI 后端

在另一个终端窗口中（确保虚拟环境已激活）：

```bash
python main.py
```

**注意**：首次运行时会自动下载 embeddings 模型，请确保网络环境良好，下载时间取决于模型大小和网络速度。

---

## ⚠️ 常见问题

### 1. Chroma 服务未启动

如果看到连接错误，请确保已执行 `chroma run --port=8001` 并保持运行。

### 2. 模型下载失败

- 检查网络连接
- 如有代理/VPN，可能需要配置
- 首次下载后，后续运行将使用本地缓存

### 3. 端口冲突

如果 8001 端口被占用，可以修改端口：

```bash
chroma run --port=8002
```

同时需要在 chromadb_service.py 的 create 方法中相应修改 Chroma 连接配置。

---
