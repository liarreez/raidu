# Frontend build
FROM node:14 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Backend build
FROM openjdk:17-jdk-slim AS backend-build
WORKDIR /app
COPY backend/gradlew .
COPY backend/gradle gradle
COPY backend/build.gradle build.gradle
COPY backend/settings.gradle settings.gradle
COPY backend/src src
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

# Final stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# MySQL 클라이언트 설치
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# 백엔드와 프론트엔드 빌드 결과물 복사
COPY --from=backend-build /app/build/libs/*.jar app.jar
COPY --from=frontend-build /app/build /app/src/main/resources/static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
