FROM maven:3.9-amazoncorretto-17-alpine AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN sed -i 's/localhost/192.168.10.250/' /app/src/main/resources/application.yaml && \
    sed -i 's/maxim23/postgres/' /app/src/main/resources/application.yaml && \
    sed -i 's/sklad/scalepilot/' /app/src/main/resources/application.yaml && \
    mvn clean package -DskipTests

RUN rm -rf /root/.m2/repository

FROM eclipse-temurin:17-jre-noble AS prod

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.config.location=classpath:/application.yaml,classpath:/secrets.yaml"]