FROM node:10.17.0-alpine

WORKDIR /home/courses24maker_admin

COPY . .

RUN npm install
RUN npm rebuild node-sass --force
RUN yarn global add serve
RUN npm run build

CMD serve -s --listen 3021 dist
