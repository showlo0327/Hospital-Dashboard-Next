<div align="center">

# 🏥 Hospital Dashboard

### Modern Hospital Network Operations Platform  
### 现代医院网络运维平台

*A lightweight hospital network asset management and monitoring platform built with Vue 3 + FastAPI.*

**基于 Vue 3 + FastAPI 构建的现代化医院网络资产管理与监控平台。**

<br>

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-State-yellow)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-success)

**Built with Passion for Code & Technology**

</div>

---

# 📖 Introduction | 项目简介

## English

Hospital Dashboard is a modern hospital network operations platform designed specifically for hospital IT departments and on-site network engineers.

Unlike traditional enterprise monitoring platforms, Hospital Dashboard focuses on practical daily operations inside hospitals, providing a clean, lightweight and efficient solution for network asset management and infrastructure monitoring.

The project adopts a modern Apple-inspired user interface together with a modular Vue 3 + FastAPI architecture, making future expansion straightforward while keeping deployment simple.

---

## 中文

Hospital Dashboard 是一套专为**医院信息科**及**驻场网络运维工程师**设计的现代化医院网络运维平台。

项目并非面向通用企业监控，而是围绕医院真实的网络运维场景进行设计，强调：

- 轻量部署
- 清晰界面
- 快速响应
- 易于扩展
- 面向日常巡检

整体采用 Apple 风格设计语言，并基于 Vue 3 + FastAPI 构建现代化前后端架构。

---

# ✨ Features | 功能特性

## Dashboard

- Real-time Device Monitoring
- Device Health Overview
- Apple-inspired Dashboard
- Device Inspector
- Light / Dark Mode
- Global Search

实时设备监控

设备健康状态

Apple 风格 Dashboard

设备详情面板

深色 / 浅色主题

全局搜索

---

## Asset Management

- Device Management
- Add / Edit / Delete
- CSV Import
- Batch Delete
- Building & Floor Management
- Search & Filter

设备管理

新增 / 编辑 / 删除

CSV 批量导入

批量删除

楼栋与楼层管理

搜索与筛选

---

## Monitoring

- Real Ping Engine
- Automatic Polling
- Latency Statistics
- Online / Offline Detection
- Historical Ping Records

真实 Ping 引擎

自动轮询

延迟统计

在线状态检测

Ping 历史记录

---

## Authentication

- Modern Login Page
- Route Guard
- Remember Login
- Theme Synchronization
- Ready for JWT Authentication

现代登录页面

路由守卫

记住登录状态

主题同步

预留 JWT 登录接口

---

# 🏥 Supported Device Types | 支持设备类型

Current supported device categories:

当前支持以下设备类型：

- Desktop PC（台式机）
- Cloud Desktop（云桌面）
- Self-service Kiosk（自助机）
- Printer（打印机）
- Wireless AP（无线 AP）
- PDA
- Medical Device（医用设备）
- Server（服务器）
- Virtualization Platform（虚拟化平台）
- Access Switch（接入交换机）
- Core Switch（核心交换机）
- Firewall（防火墙）

---

# 🏗 Architecture | 系统架构

```
                    Vue 3 + TypeScript
                            │
                      Pinia Store
                            │
                   Service Layer(API)
                            │
                      FastAPI Backend
                            │
               Repository + Ping Engine
                            │
                       assets.json
```

---

# 🛠 Technology Stack | 技术栈

## Frontend

- Vue 3
- TypeScript
- Vite
- Pinia
- Tailwind CSS

## Backend

- FastAPI
- Pydantic
- Ping3

---

# 📂 Project Structure | 项目结构

```
Hospital-Dashboard

├── backend/
│   ├── api/
│   ├── repositories/
│   ├── services/
│   ├── schemas/
│   ├── models/
│   └── data/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── stores/
│   └── styles/
│
└── docs/
```

---

# 🚀 Quick Start | 快速开始

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend：

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend：

```
http://localhost:5173
```

---

# 📸 Screenshots | 项目截图

Coming Soon...

即将更新：

- Login
- Dashboard
- Assets
- Device Inspector

---

# 🗺 Roadmap | 开发路线

## v2.x

- ✅ Dashboard
- ✅ Assets
- ✅ Authentication
- ✅ Ping Engine
- ✅ CSV Import

---

## v3.x

- SNMP Monitoring
- Network Topology
- Alarm Center
- Inspection Module

---

## v4.x

- RBAC
- Multi-user
- High Availability
- Historical Analytics
- Multi-hospital Support

---

# 💡 Design Philosophy | 设计理念

Hospital Dashboard is intentionally **not** another enterprise monitoring platform.

Instead, it focuses on solving practical problems faced by hospital IT engineers every day.

The goal is simple:

> Build a lightweight, reliable and elegant network operations platform for hospitals.

---

Hospital Dashboard 并不追求成为一个庞大的企业级监控系统。

它专注解决医院信息科日常工作中的真实问题。

设计目标只有一句话：

> **打造一款轻量、可靠、优雅的医院网络运维平台。**

---

# 🤝 Contributing | 参与贡献

Issues and Pull Requests are welcome.

欢迎提交 Issue 与 Pull Request，一起完善 Hospital Dashboard。

---

# 📄 License | 开源协议

Released under the MIT License.

基于 MIT License 开源。

---

<div align="center">

### Designed & Developed by 关耳同学zzZ

**Built with Passion for Code & Technology**

</div>
