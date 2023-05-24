const router = require('express').Router()
const UserController = require('../controllers/UserController')
const ProdutoController = require('../controllers/ProdutoController')
const MigrationController = require('../controllers/MigrationController')
const ListaController = require('../controllers/ListaController')

//USER
router.get('/user/buscar', UserController.user)

//LOGIN
router.post('/login', UserController.login)

//PRODUTOS
router.get('/produtos/gtin/:codigo', ProdutoController.produtosCOD)
router.get('/produtos/descricao/:descricao', ProdutoController.produtosDS)
router.get('/produtos/todos', ProdutoController.todos)
router.delete('/manage/deletarduplicado', ProdutoController.removerDuplicado)

//LISTA
router.get('/listas/getuserlists/:id', ListaController.getUserLists)
router.post('/listas/criar', ListaController.criaLista)

//MIGRATION
router.post('/manage/migrar', MigrationController.migrar)
router.post('/manage/inserirjson', MigrationController.inserirJson)

module.exports = router