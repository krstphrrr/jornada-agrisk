
FROM node:20-alpine3.17 AS build

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./

RUN npm ci

COPY --chown=node:node ./src .

ENV NODE_ENV production

RUN npm ci --cache /tmp/empty-cache  --omit=dev

USER node

### build prod
FROM node:20-alpine3.17 As production
RUN apk add --update php php-mysqli apache2 openrc
# RUN cat <<EOF >/etc/apk/repositories http://dl-cdn.alpinelinux.org/alpine/v$(cat /etc/alpine-release | cut -d'.' -f1,2)/main http://dl-cdn.alpinelinux.org/alpine/v$(cat /etc/alpine-release | cut -d'.' -f1,2)/community EOF
# RUN apk update 
# RUN apk openrc
# RUN export phpverx=$(alpinever=$(cat /etc/alpine-release|cut -d '.' -f1);[ $alpinever -ge 9 ] && echo  7.4.33)
# RUN apk add apache2 php$phpverx-apache2
# RUN rc-service apache2 start


COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/ ./dist
EXPOSE 3000
CMD [ "node", "./dist/index.js" ]
# CMD ["tail", "-f", "/dev/null"]