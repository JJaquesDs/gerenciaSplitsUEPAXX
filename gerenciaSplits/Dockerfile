FROM eclipse-temurin:25

LABEL mainteiner="joaovitor.jaques.7748@gmail.com, vitorianowaczyk@gmail.com"

WORKDIR /app

COPY target/gerenciaSplits-0.0.1-SNAPSHOT.jar /app/gerenciaSplits.jar

ENTRYPOINT ["java", "-jar", "gerenciaSplits.jar"]