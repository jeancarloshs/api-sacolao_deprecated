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
            SELECT user_id as id ,user_nome as nome,user_email as email FROM tbUser WHERE '${user}' = user_nome OR '${user}' = user_email
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

    // async migrar(req, res){
    //     const response = {...responseModel}
    //     response.error=[]
    //     let jsonFile = require('./clientes.json')
    //     let queries = []
    //     jsonFile = JSON.stringify(jsonFile)
    //     jsonFile = JSON.parse(jsonFile)
    //     jsonFile.forEach(element => {
    //         let cpf = element.documento_1
    //             cpf = cpf.replace('.','')
    //             cpf = cpf.replace('.','')
    //             cpf = cpf.replace('-','')
    //             cpf = cpf.replace('/','')
    //             let senha = cpf.slice(0,5)
    //             const senhaEncriptada = md5(senha)
    //         if(element.e_mail_cadastro!==undefined){
    //             queries.push(`INSERT INTO tbAssinantes (nome, documentacao_cpf, email, password, status, settings_conteudos, app, can_delete) VALUES ('${element.nome_cliente}','${cpf}','${element.e_mail_cadastro}','${senhaEncriptada}','1','{"planos": ["2226"], "password_parental": null, "livemode_copa_nordeste": false, "livemode_copa_nordeste_exportar": false, "livemode_copa_nordeste_exportacao": null}', '4037', '1')`)
    //         }else{
    //             queries.push(`INSERT INTO tbAssinantes (nome, documentacao_cpf, password, status, settings_conteudos, app, can_delete) VALUES ('${element.nome_cliente}','${cpf}','${senhaEncriptada}','1','{"planos": ["2226"], "password_parental": null, "livemode_copa_nordeste": false, "livemode_copa_nordeste_exportar": false, "livemode_copa_nordeste_exportacao": null}', '4037', '1')`)
    //         }
    //     });

    //     async function inserir(query){
    //         try{
    //             const [, data] = await connection.query(query)
    //         }catch(err){
    //             console.log(err)
    //         }
            
    //     }

    //     queries.forEach(query => {
    //         inserir(query)
    //     });
    // },

}