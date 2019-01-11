FROM node:11.6.0-alpine

EXPOSE 8080

RUN apk add python3 curl wget git && pip3 install awscli

COPY package.json /app/package.json
WORKDIR /app

RUN npm install

#prefer to use IAM role for AWS hosted apps
#ENV AWS_ACCESS_KEY_ID=
#ENV AWS_SECRET_ACCESS_KEY=

#basic auth is optional
ENV USERNAME=
ENV PASSWORD=

COPY . /app

CMD npm start
