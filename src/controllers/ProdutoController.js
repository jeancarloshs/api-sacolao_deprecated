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
        response.error=[]
        const [, data] = await connection.query(`
            SELECT * FROM tbProdutos
        `)
        response.success = data.length > 0
        if(response.success){
            response.data = data
        }
       
        return res.json(response)
    },

}