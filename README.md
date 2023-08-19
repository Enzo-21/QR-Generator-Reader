# QR-Generator-Reader

### Important!
Browsers need to be served over https in order to access the device camera. To allow QR scanning in dev mode you'll need to run the react app with https. In order to achieve this you'll need to generate the SSL certificates with the following command: 

`openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout localhost.key -out localhost.crt`

Make sure you are at the project folder. This command will create two files localhost.key and localhost.crt.

The .env file contains the following code that allows the app to run with https:

    ```
    HTTPS=true
    SSL_CRT_FILE=localhost.crt
    SSL_KEY_FILE=localhost.key
    ```
