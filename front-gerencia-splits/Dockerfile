FROM node:23.8.0

LABEL mainteiner="joaovitor.jaques.7748@gmail.com, vitorianowaczyk@gmail.com"

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
