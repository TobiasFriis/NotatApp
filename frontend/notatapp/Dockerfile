# build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine
# frontend bundle
COPY --from=build /app/dist /usr/share/nginx/html
# nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# runtime env support
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
