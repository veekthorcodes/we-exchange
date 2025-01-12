FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN uname -m && node -v

COPY . .

EXPOSE 5050

CMD ["npm", "run", "start:dev"]
