const router = require('express').Router()
const UserController = require('../controllers/UserController')
const ProdutoController = require('../controllers/ProdutoController')
const MigrationController = require('../controllers/MigrationController')
const ListaController = require('../controllers/ListaController')
const verifyJWT = require('../middleware/jwt')

// router.use(verifyJWT)

//USER
router.get('/user/buscar', verifyJWT, UserController.user)
router.post('/user/createuser', verifyJWT, UserController.createUser)

//LOGIN
router.post('/login', UserController.login)

//PRODUTOS
router.get('/produtos/gtin/:codigo', verifyJWT, ProdutoController.produtosCOD)
router.get('/produtos/descricao/:descricao', verifyJWT, ProdutoController.produtosDS)
router.get('/produtos/todos', verifyJWT, ProdutoController.todos);
router.delete('/manage/deletarduplicado', verifyJWT, ProdutoController.removerDuplicado)

//LISTA
router.get('/listas/getuserlists/:id', verifyJWT, ListaController.getUserLists)
router.get('/listas/getlistproducts/:id', verifyJWT, ListaController.getListProducts)
router.post('/listas/criar', verifyJWT, ListaController.criaLista)
// router.post('/listas/addproducttolist', verifyJWT, ListaController.addProducts)

//MIGRATION
router.post('/manage/migrar', verifyJWT, MigrationController.migrar)
router.post('/manage/inserirjson', verifyJWT, MigrationController.inserirJson)

module.exports = router