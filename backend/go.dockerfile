FROM golang:1.23-alpine

WORKDIR /app

COPY . .

RUN go get -d -v ./...

RUN go build -o WebAppFinance .

EXPOSE 8080

CMD [ "./WebAppFinance" ]