-- CREATE DATABASE bddCalculadora;
USE bddCalculadora;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
create table user_session (
	user_id int not null,
    session_id varchar(60) primary key,
    created_at datetime not null,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

select * from users;
select * from user_session;