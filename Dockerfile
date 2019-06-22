FROM 192.168.31.5:15000/node:10.15.2-alpine as dev

ADD ./server /app
WORKDIR /app
ENTRYPOINT ["node", "server.js", "--port", "9066"]
EXPOSE 9066
