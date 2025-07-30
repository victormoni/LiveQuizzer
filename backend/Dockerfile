# === Stage 1: Build com Gradle + JDK 21 ===
FROM gradle:8.5-jdk21 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas o gradle wrapper e arquivos de build para cache
COPY gradlew settings.gradle build.gradle ./
COPY gradle/ gradle/

# Baixa dependências (cache!)
RUN ./gradlew dependencies --no-daemon

# Copia o resto do código e gera o jar
COPY . .
RUN ./gradlew clean bootJar -x test --no-daemon

# === Stage 2: Runtime com JRE 21 slim ===
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copia o jar gerado no stage build
COPY --from=build /app/build/libs/*.jar app.jar

# Expõe a porta que seu Spring Boot escuta (por padrão 8080)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]