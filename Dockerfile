FROM node:11.6.0-alpine

expose 8080

COPY . /app
WORKDIR /app

RUN npm install

#prefer to use IAM role for AWS hosted apps
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=

#basic auth is optional
ENV USERNAME=
ENV PASSWORD=

CMD npm start
