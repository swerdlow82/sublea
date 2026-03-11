# Stage 1: Build
FROM node:18-alpine AS build

ARG _VITE_API_URL
ARG _VITE_GOOGLE_MAPS_API_KEY

# Assign them to the ENV variables Vite expects
ENV VITE_API_URL=$_VITE_API_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$_VITE_GOOGLE_MAPS_API_KEY


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