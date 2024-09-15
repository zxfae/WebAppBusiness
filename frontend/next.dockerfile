FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install


COPY . .

# buld app
RUN npm run build

EXPOSE 3000

# run app
CMD ["npm", "dev"]
