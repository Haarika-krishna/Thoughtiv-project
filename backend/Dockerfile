# 1. Use official Node.js slim image
FROM node:18-slim

# 2. Install dependencies required to run Chromium in headless mode
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Copy package.json and package-lock.json (if present) and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy all project files to the container
COPY . .

# 6. Set Puppeteer to use system-installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 7. Expose the port your server runs on (use 10000 if that's your current port)
EXPOSE 10000

# 8. Start your server
CMD ["node", "server.js"]
