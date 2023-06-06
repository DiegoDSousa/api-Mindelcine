DROP DATABASE `mindelocine`;
CREATE DATABASE `mindelocine`;
USE `mindelocine`;

create table listafilmes(
    ID_FILMES int not null primary key auto_increment,
    TITULO varchar(50) not null,
    COVER varchar(50) not null,
    DATA_EXIBICAO varchar(15) not null,
    PRECO varchar(15) not null,
    DISPONIVEIS varchar(45) not null,
    DESCRICAO varchar(100),
    GENERO varchar(10) not null
);

create table usuario(
    ID_USUARIO int not null primary key auto_increment,
    NOME varchar(20) not null unique,
    EMAIL varchar(40) not null unique,
    PASSCODE varchar(100) not null,
    NR_PONTOS int(4),
    INTERESSES varchar(15),
    NR_CONTA varchar(15) unique,
    DATA_VALIDADE_CARTAO varchar(15),
    ADMIN_STATUS boolean
);
create table listabilhetes (
  ID_BILHETE int not null primary key auto_increment,
  CHAVE_CONFIRMACAO varchar(45),
  DESCRICAO varchar(45),
  ID_FILME int not null,
  ID_USUARIO int not null,
  foreign key (ID_FILME) references listafilmes(ID_FILMES),
  foreign key (ID_USUARIO) references usuario(ID_USUARIO)
);


INSERT INTO listafilmes (TITULO,COVER,DATA_EXIBICAO,PRECO,DISPONIVEIS,DESCRICAO,GENERO)
VALUES
  ("Avatar o Caminho da agua","cover.png","15/5/2023","250$00",40,"Filme de fantasia boldado","Fantasia"),
  ("Avatar ","cover1.png","10/5/2023","250$00",40,"Filme de fantasia boldado","Fantasia"),
  ("Riddik","cover.png","15/1/2023","250$00",40,"Filme de fantasia boldado","Acao"),
  ("Moana","cover1.png","15/9/2023","200$00",25,"mar","Animacao"),
  ("Frozen","cover.png","15/5/2023","250$00",40,"lety go lety go","Fantasia");


  

UPDATE usuario
SET ADMIN_STATUS = true
WHERE ID_USUARIO = 1;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Admin12345678';


