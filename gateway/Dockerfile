FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN yarn

COPY . /usr/src/app
CMD ["yarn", "build"]
