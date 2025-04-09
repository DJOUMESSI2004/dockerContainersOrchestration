FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install && yarn build
EXPOSE 3005
CMD ["yarn", "dev"]
