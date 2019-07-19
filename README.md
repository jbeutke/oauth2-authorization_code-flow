# oauth2-authorization_code-flow
OAuth 2.0  Authorization Code Flow - Lab



1. Clonar este repositorio:
```
git clone https://github.com/jbeutke/oauth2-authorization_code-flow.git
```

2. Abrir archivo ./server.js.
   > En la seccion debajo de la linea '//Set 1: Ask the authorization code' modificar las constantes con los siguientes valores:
   ```
    const Authorization_Endpoint = `http://localhost:8080/web/authorize`;
    const Response_Type = 'code';
    const Client_Id = 'test_client_1';
    const Redirect_Uri = 'http://localhost:8000/give/me/the/code';
    const Scope = 'read';
    const State = 'ThisIsMyStateValue';
    
    Estos son los parametros que requiere el Authorization Server para entregar un codigo de autorizacion. En base a estos parametros se armara un request para solicitarlo.

   ```
   
   > En la seccion debajo de la linea '//Step 3: Exchange the code for a token' modificar las constantes con los siguientes valores:
   ```
    const Token_Endpoint = `http://localhost:8080/v1/oauth/tokens`;
    const Grant_Type = 'authorization_code';
    const Code = req.body.code;
    const Redirect_Uri = 'http://localhost:8000/give/me/the/code';
    const Scope = 'read';
    const CLIENT_ID = 'test_client_1';
    const CLIENT_SECRET = 'test_secret';
    
    Estos son los parametros que requiere el Authorization Server para cambiar el codigo de autorizacion por un  access_token. En base a estos parametros se armara un request para solicitarlo.

   ```


2. Desde la terminal, ingresar a la carpeta 'oauth2-authorization_code-flow' y ejecutar 'npm install'.

3. Ejecutar 'npm start'

4. Ingresar a http://localhost:8000 desde el navegador.

5. Seguir las instrucciones.
