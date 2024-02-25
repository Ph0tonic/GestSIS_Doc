FROM node:20

WORKDIR /app
RUN yarn global add retypeapp

CMD [ "sh" ]
