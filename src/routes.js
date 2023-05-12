const router = require('express').Router()
const UserController = require('./controllers/UserController')
const ProdutoController = require('./controllers/ProdutoController')


// router.get('/', { message: 'Não há nada por aqui forasteiro'})
router.get('/user', UserController.user)
router.post('/login', UserController.login)
router.get('/produtos', ProdutoController.produtos)
// router.post('/convert', UserController.convert)
// router.post('/getEpgList', UserController.getEpgList)
// router.get('/migrar', UserController.migrar)

module.exports = router