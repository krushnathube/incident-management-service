# Specify a base image
FROM node:16.3.0-alpine AS alpine

WORKDIR /app

# Install dependencies
COPY package*.json .
# Resolve bcrypt installation issue
# RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install 
COPY . .

# build command
RUN npm run build

# db migration
# RUN npm run typeorm migration:run

# Default command
CMD ["npm", "run", "typeorm", "migration:run"]