const router = require('express').Router()
const UserController = require('../controllers/UserController')
const ProdutoController = require('../controllers/ProdutoController')
const MigrationController = require('../controllers/MigrationController')
const ListaController = require('../controllers/ListaController')
const verifyJWT = require('../middleware/jwt')

// router.use(verifyJWT)

router.get('/', (req, res) => {
    res.send('server iniciado')
})

//USER
router.get('/user', verifyJWT, UserController.user)
router.post('/user/createuser', UserController.createUser)

//LOGIN
router.post('/login', UserController.login)

//PRODUTOS
router.get('/products/gtin/:code', verifyJWT, ProdutoController.productsCOD)
router.get('/products/description/:description', verifyJWT, ProdutoController.productsDS)
router.get('/products/all', verifyJWT, ProdutoController.allProducts);

//LISTA
router.get('/lists/getuserlists', verifyJWT, ListaController.getUserLists)
router.get('/lists/getlistproducts/:id', verifyJWT, ListaController.getListProducts)
router.post('/lists/create', verifyJWT, ListaController.createList)
router.delete('/lists/delete/:idList', verifyJWT, ListaController.deleteList)
router.post('/lists/addproducttolist/', verifyJWT, ListaController.addProducts)

//MIGRATION
router.post('/manage/migrate', verifyJWT, MigrationController.migrar)
router.post('/manage/insertjson', verifyJWT, MigrationController.inserirJson)
router.delete('/manage/deleteduplicate', verifyJWT, ProdutoController.deleteDuplicate)
router.get('/manage/user/find', verifyJWT, UserController.userFind)

module.exports = router