FROM 172.18.1.1:15000/library/node:12.13.1-slim as dev
ADD ./server /app
WORKDIR /app
ENTRYPOINT ["node", "server.js", "--port", "9066"]
EXPOSE 9066

# 目前只需要dev
