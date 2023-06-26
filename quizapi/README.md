You will need to create ssl files in the ssl folder in the quizapi folder:
- openssl genrsa -out privatekey.pem 2048
- openssl req -new -key privatekey.pem -out csr.pem
- openssl x509 -req -days 365 -in csr.pem -signkey privatekey.pem -out certificate.pem

You will also need a .env file in this quizapp directory:
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

Have provided the create and insert scripts for the database.

To run: node api.js in main directory