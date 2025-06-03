#!/bin/zsh

# docker run -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 -d mysql
docker start 6ac9582c1ffa

docker run -it --rm --name rabbitmq -p 5552:5552 -p 15672:15672 -p 5672:5672 -e RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS='-rabbitmq_stream advertised_host localhost' rabbitmq:4-management
docker exec rabbitmq rabbitmq-plugins enable rabbitmq_stream rabbitmq_stream_management

cd supercode-rust
cargo run --bin supercode-rust &
cd ..

cd supercode-flutter
flutter build web
cd ..

cd supercode-springboot
mvn spring-boot:run &
cd ..

python3 -m http.server -d ./supercode-flutter/web 8000 &