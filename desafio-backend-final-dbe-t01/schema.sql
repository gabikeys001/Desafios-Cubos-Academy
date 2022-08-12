create database pdv;
drop table if exists categorias;

drop table if exists usuarios;
drop table if exists produtos;
drop table if exists clientes;
drop table if exists pedidos;
drop table if exists pedido_produtos;
--CATEGORIAS
create table categorias(id serial primary key,descricao text not null);
insert into categorias(descricao) 
values ('Informática'),('Celulares'),('Beleza e Perfumaria'),
('Mercado'),('Livros e Papelaria'),('Brinquedos'),('Moda'),
('Bebê'),('Games');
--USUARIOS
create table usuarios(id serial primary key,nome text not null,
  email text not null unique,senha text not null);
--PRODUTOS
create table produtos(id serial primary key, descricao text not null, 
quantidade_estoque int not null, valor int not null,categoria_id int not null, 
foreign key(categoria_id) references categorias(id));
--CLIENTES
create table clientes(id serial primary key, nome text not null, 
email text not null unique, cpf text not null unique, cep text,
rua text, numero int, bairro text, cidade text, estado text);
--PEDIDOS
create table pedidos(id serial primary key, cliente_id int not null,
observacao text, valor_total int not null);
--PEDIDO_PRODUTOS
create table pedido_produtos(id serial primary key, pedido_id int not null,
produto_id int not null, quantidade_produto int not null, valor_produto int not null,
foreign key(pedido_id) references pedidos(id),
foreign key(produto_id) references produtos(id));
--inserida coluna produto_imagem
alter table produtos add column produto_imagem text unique;









