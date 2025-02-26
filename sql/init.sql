CREATE DATABASE bddCalculadora;
USE bddCalculadora;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

create table user_session (
	user_id int,
    session_id int auto_increment primary key,
    created_at datetime,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
