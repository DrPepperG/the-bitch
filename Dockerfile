FROM node:17-alpine3.13
WORKDIR /bot
COPY package.json /bot
RUN npm install --production

COPY . /bot

CMD ["node", "index.js"]
