# FROM node:10-alpine AS alpine
# WORKDIR /app
# COPY package*.json .
# RUN npm install 
# COPY . .
# RUN npm run build

# FROM nginx 
# EXPOSE 80
# COPY --from=build /app/build /usr/share/nginx/html
# Stage 1 - the build process
FROM node:10-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm build

# Stage 2 - the production environment
FROM nginx
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]