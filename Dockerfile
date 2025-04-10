# 阶段1: 构建
FROM node:18-alpine AS builder
WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# 复制源代码并构建
COPY src ./src
COPY nest-cli.json .
RUN npm run build

# 阶段2: 运行
FROM node:18-alpine
WORKDIR /app

# 复制构建产物和依赖
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# 安装生产依赖（确保 devDependencies 不被安装）
RUN npm ci --production

# 暴露端口并启动
EXPOSE 3000
CMD ["node", "dist/main.js"]