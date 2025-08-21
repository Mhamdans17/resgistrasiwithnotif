# Gunakan Node.js versi LTS
FROM node:18

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file project ke container
COPY . .

# Expose port aplikasi
EXPOSE 3000

CMD ["node", "app.js"]
