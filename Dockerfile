FROM mysql:8.0.41-debian

COPY calculatorDB.sql /docker-entrypoint-initdb.d

CMD ["mysqld"]

# docker build -t iluminaties .
# docker run --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 33060:3306 -d iluminaties
