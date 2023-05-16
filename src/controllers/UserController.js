const connection = require("../database/connection")
const md5 = require('md5');
const { json } = require("body-parser");
const responseModel = {
    success:false,
    data:[],
    error:[]
}
module.exports = {
    async user(req, res){
        const response = {...responseModel}
        response.error=[]
        const {user} = req.body
        const [, data] = await connection.query(`
            SELECT id_usuario as id ,ds_usuario as nome,ds_email as email FROM tb_usuario WHERE '${user}' = ds_usuario OR '${user}' = ds_email
        `)
        response.success = data.length > 0
        if(response.success){
            response.data = data
        }else{
            user!==undefined?response.error.push('Nenhum usuário encontrado'):'';
            user===undefined?response.error.push('user: é obrigatório'):'';
        }
       
        return res.json(response)
    },

    async login(req, res){
        const response = {...responseModel}
        response.error=[]
        const {login, password} = req.body
        console.log(req.body)
        const passwordEncrypted = password!==undefined?md5(password):''
        
        const [, data] = await connection.query(`
            SELECT user_id as id, user_email as email, user_nome as nome, user_tipo, user_ativo FROM tbUser WHERE '${login}' = user_email AND '${passwordEncrypted}' = user_senha
        `)
        response.success = data.length > 0
        if(response.success){
                response.data = data
            
        }else{
            login!==undefined && password!==undefined?response.error.push('Login ou senha incorretos'):'';
            login===undefined || password===undefined?response.error.push('login: e password: é obrigatório'):'';
        }
        
        // setTimeout(() => {
            return res.json(response)
        // }, 1000);
       
    },

    // async convert(req, res){
    //     const response = {...responseModel}
    //     response.error=[]
    //     let jsonFile = require('./br.json')
    //     let queries = []
    //     jsonFile = JSON.stringify(jsonFile)
    //     jsonFile = JSON.parse(jsonFile)
    //     jsonFile.channels.forEach(element => {
    //         if(element.lang==='pt'){
    //             response.data.push(element)
    //             queries.push(`INSERT INTO tbEpgCanais (nome, idXml, icone) VALUES ('${element.name}','${element.id}','${element.logo}')`)
    //         }
    //     });

    //     async function inserir(query){
    //         const [, data] = await connection.query(query)
    //     }

    //     queries.forEach(query => {
    //         inserir(query)
    //     });
    // },

    // async getEpgList(req, res){
    //     const response = {...responseModel}
    //     response.error=[]
    //     let jsonFile = require('./br.json')
    //     let queries = []
    //     let channelList =[]
    //     jsonFile = JSON.stringify(jsonFile)
    //     jsonFile = JSON.parse(jsonFile)
    //     jsonFile.channels.forEach(element => {
    //         if(element.lang==='pt'){
    //             channelList.push(element.id)
    //         }
    //     });

    //         channelList.forEach(item => {
    //             jsonFile.programs.forEach(element => {
    //                 if(element.channel===item){
    //                     let desc = element.descriptions[0]?element.descriptions[0].value:''
    //                     desc = desc.replace(',','')
    //                     desc = desc.replace("'",'')
    //                     desc = desc.replace(',','')
    //                     desc = desc.replace("'",'')

    //                     let ttl = element.titles[0]?element.titles[0].value:''
    //                     ttl = ttl.replace(',','')
    //                     ttl = ttl.replace("'",'')
    //                     ttl = ttl.replace(',','')
    //                     ttl = ttl.replace("'",'')

    //                     queries.push(`INSERT INTO tbEpgProgramacao (idXml, titulo, descricao, capa, inicio, fim) VALUES ('${element.channel}','${ttl}','${desc}','${element.icon.src}','${element.start}','${element.stop}')`)
    //                 }
    //             });
                
    //         });

    //         async function inserir(query){
    //             try{
    //             const [, data] = await connection.query(query)
    //             }catch(err){
    //                 console.log(err)
    //             }
    //         }
    
    //         queries.forEach(query => {
    //             inserir(query)
    //         });
            
    //     return res.json(response)
    // },

    async migrar(req, res){
        const response = {...responseModel}
        response.error=[]
        let jsonFile = require('../../../../arquivos/listaProdutos3.json')
        let queries = []
        jsonFile = JSON.stringify(jsonFile)
        jsonFile = JSON.parse(jsonFile)
        jsonFile.forEach(element => {
            let imagem = element.imagem
            let nome = element.nome.replaceAll("'","")
            let gtin = element.gtin
            let categoriaProduto = element.categoriaProduto.replaceAll("'","")
            let marcaProduto = element.marcaDoProduto.replaceAll("'","")
            let valorMedio = element.valorMedio
                queries.push(`INSERT INTO tb_produtos (ds_produto, cd_barras, id_unidade, ds_unidade, ds_categoria, id_valores, url_imagem) VALUES ('${nome}','${gtin}','UN','Unidade','${categoriaProduto}',${valorMedio === null ? null : `'${valorMedio}'`}, '${imagem}')`)
        });

        async function inserir(query){
            try{
                const [, data] = await connection.query(query)
            }catch(err){
                console.log(err)
            }
            
        }

        queries.forEach(query => {
            inserir(query)
        });
    },

}