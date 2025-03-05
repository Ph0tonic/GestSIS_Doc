FROM node:23

WORKDIR /app
RUN yarn global add retypeapp

CMD [ "sh" ]
