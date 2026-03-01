FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . . 

RUN mkdir -p /app/assets/img/services /app/assets/img/shop \
 && chown -R node:node /app/assets

VOLUME ["/app/assets"]

USER node

CMD ["node", "./bin/www"]
