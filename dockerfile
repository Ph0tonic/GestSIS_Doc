FROM node:24

WORKDIR /app
RUN yarn global add retypeapp

CMD [ "sh" ]
