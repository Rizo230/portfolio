FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o portfolio-api .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/portfolio-api .

EXPOSE 8090

CMD ["./portfolio-api"]