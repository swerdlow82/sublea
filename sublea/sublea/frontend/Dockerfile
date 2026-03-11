# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This will compile your TS/React code into the /app/dist folder
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
# Copy the custom nginx.conf we made earlier
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the compiled files
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]