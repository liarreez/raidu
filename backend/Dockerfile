# Backend build
FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle build.gradle
COPY settings.gradle settings.gradle
COPY src src
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

# Final stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# MySQL 클라이언트 설치
# RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# 백엔드 빌드 결과물 복사
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
