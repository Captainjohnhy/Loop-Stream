FROM node:20-slim
RUN apt-get update && apt-get install -y ffmpeg wget && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
EXPOSE 10000
CMD ["node", "server.js"]
