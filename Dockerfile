# check=skip=JSONArgsRecommended

FROM node:24-alpine3.21
ADD . /app
WORKDIR /app
USER node
CMD npm install