FROM node:20-alpine

WORKDIR /app

# 1. Copy package files
COPY package.json package-lock.json* ./

# 2. Copy prisma schema BEFORE install
COPY prisma ./prisma

# 3. Install deps (postinstall can now find schema)
RUN npm ci

# 4. Copy rest of the app
COPY . .

# 5. Build Next.js
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
