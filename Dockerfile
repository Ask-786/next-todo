FROM node:22-alpine

WORKDIR /src/app

COPY . .

RUN npm install -g pnpm && pnpm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
