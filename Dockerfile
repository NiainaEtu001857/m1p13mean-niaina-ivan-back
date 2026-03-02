FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . . 

RUN mkdir -p /data/img/services /data/img/shop \
 && chown -R node:node /data

VOLUME ["/data"]

USER node

CMD ["node", "./bin/www"]
