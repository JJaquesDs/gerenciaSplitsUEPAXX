FROM node:23.8.0

LABEL mainteiner="joaovitor.jaques.7748@gmail.com, vitorianowaczyk@gmail.com"

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
