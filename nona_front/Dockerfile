FROM node:16-alpine 

WORKDIR /app

COPY . .

ENV NODE_ENV development

RUN npm ci

RUN npm run build

# WORKDIR /app/src



# RUN yarn test --coverage --watchAll=false

# RUN npm test -- --coverage --watchAll=false --bail=false
EXPOSE 3000

CMD [ "npm", "start" ]
