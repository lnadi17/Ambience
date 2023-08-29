FROM node:latest
WORKDIR /app
RUN apt-get update && apt-get -y install \
  curl \
  libtool \
  build-essential \
  ffmpeg

COPY package*.json dependencyReport.js ./
RUN npm install ci
RUN node dependencyReport.js
COPY . .
RUN npm run build
RUN chown -R node /app
USER node
CMD ["npm", "start"]
