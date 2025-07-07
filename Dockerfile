FROM node:18-slim

# Install dependencies for Puppeteer/Chrome
RUN apt-get update && \
    apt-get install -y \
        wget \
        ca-certificates \
        fonts-liberation \
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
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxrandr2 \
        xdg-utils \
        chromium \
        --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Create non-root user
RUN groupadd -r zoombot && useradd -r -g zoombot -G audio,video zoombot \
    && mkdir -p /home/zoombot \
    && chown -R zoombot:zoombot /home/zoombot \
    && chown -R zoombot:zoombot /app

USER zoombot

EXPOSE 3000

CMD ["node", "app.js"]