## Fix: Definindo o endereço **0.0.0.0** e a porta **8080**

-------------------------------------------------------------------------------------------------------------------------------

Definindo o endereço **0.0.0.0** para fazer a aplicação aceitar conexões em todas as interfaces de rede disponíveis no computador.

Expondo a porta **8080** do servidor por boa prática

Para atualizar com a correção, vá ao arquivo `application.properties` definido através de [example-application.properties](../gerenciaSplits/src/main/resources/example-application.properties) localizado em [resources](../gerenciaSplits/src/main/resources)
e adicione a seguinte linha:

>[!NOTE]
> voce pode copiar e colar de [example-application.properties](../gerenciaSplits/src/main/resources/example-application.properties)

````text

# ===============================
# = EXPONDO CONEXÃO COM O SERVIDOR
# ===============================
server.address=0.0.0.0
server.port=8080

````

Depois dessa correção, apague os conteiners e faça a build novamente