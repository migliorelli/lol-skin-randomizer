FROM node:23-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:23-alpine AS production

WORKDIR /app

RUN yarn global add serve

COPY --from=build /app/dist ./

EXPOSE 80

CMD ["serve", "-s", ".", "-l", "80"]
