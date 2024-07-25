# 베이스 이미지로 Node.js를 사용하여 프론트엔드 빌드
FROM node:14 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# 베이스 이미지로 JDK를 사용하여 백엔드 빌드
FROM openjdk:17-jdk-slim AS backend-build
WORKDIR /app
COPY backend/gradlew .
COPY backend/gradle gradle
COPY backend/build.gradle build.gradle
COPY backend/settings.gradle settings.gradle
COPY backend/src src
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

# 최종 실행 이미지
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
COPY --from=frontend-build /app/build /app/public
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
