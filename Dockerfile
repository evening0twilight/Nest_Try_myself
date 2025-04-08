# 使用官方 Node 镜像
FROM node:20

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# 安装依赖（使用 frozen lockfile 保证一致性）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建 Nest 应用（如果需构建）
# RUN pnpm build

# 绑定应用到 3000 端口
EXPOSE 3000

# 开发模式启动（带热更新）
CMD ["pnpm", "dev"]