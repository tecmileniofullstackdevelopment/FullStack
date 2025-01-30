create database CALCULADORA;
USE CALCULADORA;

CREATE TABLE User (
		ID_user int auto_increment not null,
        username varchar (100) not null,
        password varchar (100) not null,
        PRIMARY KEY (ID_user)
);

create table user_session(
	session_id varchar (100) not null,
	ID_user int not null,
    CONSTRAINT fk_id_user FOREIGN KEY (ID_user) REFERENCES User(ID_user)
);