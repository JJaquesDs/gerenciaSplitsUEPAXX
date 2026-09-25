# Correção no Código #

A coluna `Corretiva/Preventiva` foi adicionada nos `TiposEnums` e adicionada no frontend

Como houve alteraçãoo no código Java, você deve alterar o `.jar` da aplicação

rode o comando na raiz do frontend: `/gerenciaSplits`

````bash
mvn clean package
````
Após isso, você alterou o Enum no banco de dados, então deve alterar a "constraint":

- Abra o banco de dados no PostgreSql
- Rode o seguinte comando:

````sql
ALTER TABLE historico_manun
DROP CONSTRAINT historico_manun_tipo_manu_check;

ALTER TABLE historico_manun
ADD CONSTRAINT historico_manun_tipo_manu_check
CHECK (
    tipo_manu IN (
        'INSTALACAO',
        'DESINSTALACAO',
        'CORRETIVA',
        'CORRETIVA_PREVENTIVA',
        'PREVENTIVA',
        'INSTALACAO_PREVENTIVA'
    )
);
````

>[!NOTE]
> Lembre-se de antes desses passos fazer um backup no banco para evitar perca de dados
