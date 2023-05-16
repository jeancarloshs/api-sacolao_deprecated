const connection = require("../database/connection")
const { json } = require("body-parser");
const responseModel = {
    success:false,
    data:[],
    error:[]
}
module.exports = {
    async produtos(req, res){
        const response = {...responseModel}
        const codigo = req.param("codigo")
        response.error=[]
        const [, data] = await connection.query(`
            SELECT ds_produto as produto, cd_barras as codigo, ds_categoria as categoria, id_valores as valorMedio, url_imagem as imagem FROM tb_produtos where cd_barras = ${codigo}
        `)
        response.success = data.length > 0
        if(response.success){
            response.data = data
        }
       
        return res.json(response)
    },

}