# Build stage for frontend
FROM node:lts as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# Production stage
FROM nginx:stable-alpine as prod-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
ADD ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
