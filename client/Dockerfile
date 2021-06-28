FROM node:10-alpine as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM nginx
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]