const router = require('express').Router()
const UserController = require('./controllers/UserController')
const ProdutoController = require('./controllers/ProdutoController')
const MigrationController = require('./controllers/MigrationController')


// router.get('/', { message: 'Não há nada por aqui forasteiro'})
router.get('/user/buscar', UserController.user)
router.post('/login', UserController.login)
router.get('/produtos/gtin/:codigo', ProdutoController.produtosCOD)
router.get('/produtos/descricao/:descricao', ProdutoController.produtosDS)
router.get('/produtos/todos', ProdutoController.todos)
// router.post('/convert', UserController.convert)
// router.post('/getEpgList', UserController.getEpgList)
router.post('/manage/migrar', MigrationController.migrar)
router.post('/manage/inserirjson', MigrationController.inserirJson)

module.exports = router