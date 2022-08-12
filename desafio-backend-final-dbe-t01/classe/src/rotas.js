const express = require('express')
const rotas = express()
//categorias 
const listarCategorias = require('./controladores/categorias')
//usuarios
const { cadastrarUsuario, redefinirSenha,
    obterPerfil, atualizarPerfil }
    = require('./controladores/usuarios')
const login = require('./controladores/login')
const verificarLogin = require('./filtros/verificaLogin')
//produtos
const { cadastrarProduto, atualizarProduto,
    listarProdutos, detalharProduto, excluirProduto }
    = require('./controladores/produtos')
//clientes
const { listarClientes, cadastrarCliente, atualizarCliente,
    detalharCliente } = require('./controladores/clientes')
//pedidos
const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos')
//uploadIMG
const { upload } = require('./controladores/uploads')
//                   <<<<<<ROTAS>>>>>>
//          <<<<<<CATEGORIAS/CADASTRO/SENHA>>>>>>
rotas.get('/categoria', listarCategorias)
rotas.post('/usuario', cadastrarUsuario)
rotas.patch('/usuario/redefinir', redefinirSenha)
//                  <<<<<<LOGIN>>>>>>
rotas.post('/login', login)
rotas.use(verificarLogin)
//                  <<<<<<USUARIOS/PERFIL>>>>>>
rotas.get('/usuario', obterPerfil)
rotas.put('/usuario', atualizarPerfil)
//                  <<<<<<PRODUTOS>>>>>>
rotas.post('/produto', cadastrarProduto)
rotas.put('/produto/:id', atualizarProduto)
rotas.get('/produto', listarProdutos)
rotas.get('/produto/:id', detalharProduto)
rotas.delete('/produto/:id', excluirProduto)
//                  <<<<<<CLIENTES>>>>>>
rotas.get("/cliente", listarClientes);
rotas.post("/cliente", cadastrarCliente);
rotas.put("/cliente/:id", atualizarCliente);
rotas.get("/cliente/:id", detalharCliente);
//                  <<<<<<PEDIDOS>>>>>>
rotas.post('/pedido', cadastrarPedido)
rotas.get('/pedido', listarPedidos)
//                  <<<<<<UPLOADS>>>>>>
rotas.post('/upload', upload)

module.exports = rotas