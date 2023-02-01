FROM node:18

WORKDIR /app
RUN yarn global add retypeapp

CMD [ "sh" ]
