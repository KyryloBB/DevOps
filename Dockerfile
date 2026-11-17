FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5200

CMD ["sh", "-c", "npm run migrate && npm start"]