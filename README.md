# DeepSeek Clone

一个基于 Next.js 15 构建的高性能 AI 对话应用，复刻了 DeepSeek 的核心体验。本项目展示了如何实现一个具备流式响应、持久化对话历史和安全身份验证的全栈 AI Agent。

## 功能特性

- **AI 对话界面**：使用 Vercel AI SDK 实现实时流式响应（打字机效果）。
- **多模型支持**：支持在 `DeepSeek-V3` 和 `DeepSeek-R1` (深度思考/推理模型) 之间无缝切换。
- **对话历史**：使用 PostgreSQL 持久化存储所有对话记录。
- **侧边栏导航**：自动生成对话标题，方便快速访问历史会话。
- **身份验证**：通过 Clerk 实现安全的用户登录、注册和会话管理。
- **响应式设计**：基于 Tailwind CSS 构建的现代化、整洁的 UI 界面。

## 技术栈

- **框架**：[Next.js 15](https://nextjs.org/) (App Router)
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **AI 集成**：[Vercel AI SDK](https://sdk.vercel.ai/docs) & DeepSeek API
- **数据库**：[PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **ORM**：[Drizzle ORM](https://orm.drizzle.team/)
- **身份验证**：[Clerk](https://clerk.com/)
- **样式**：[Tailwind CSS](https://tailwindcss.com/) & [Material UI Icons](https://mui.com/)
- **状态管理**：[TanStack Query](https://tanstack.com/query/latest)

## 快速开始

按照以下步骤在本地运行项目。

### 前提条件

- 已安装 Node.js 18+。
- 一个 [Supabase](https://supabase.com/) 项目（用于 PostgreSQL 数据库）。
- 一个 [Clerk](https://clerk.com/) 账号（用于身份验证）。
- 一个 [DeepSeek](https://www.deepseek.com/) API Key。

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone ...
   cd deepseek-clone
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **环境配置**
   在项目根目录下创建一个 `.env` 文件，并添加以下变量：

   ```env
   # Clerk Auth (身份验证)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

   # DeepSeek API
   DEEPSEEK_API_KEY=sk-...
   BASE_URL=https://api.deepseek.com/v1

   # Database (建议使用 Supabase Transaction Pooler 以适应 Serverless 环境)
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?sslmode=require
   ```

4. **数据库设置**
   使用 Drizzle Kit 将 Schema 推送到你的数据库：

   ```bash
   npx drizzle-kit push
   ```

5. **运行应用**
   ```bash
   npm run dev
   ```
   在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 项目结构

```
src/
├── app/                 # Next.js App Router 页面 & API 路由
│   ├── api/             # 后端 API 端点 (chat, create-chat, etc.)
│   ├── chat/[chat_id]/  # 单个对话详情页
│   └── page.tsx         # 首页 (新建对话)
├── components/          # 可复用的 UI 组件 (Navibar 等)
├── db/                  # 数据库配置 & Schema 定义 (Drizzle)
├── middleware.ts        # Clerk 身份验证中间件
└── ...
```

## 许可证

本项目开源并遵循 [MIT License](LICENSE) 许可证。
