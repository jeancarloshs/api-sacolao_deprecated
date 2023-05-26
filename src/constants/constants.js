module.exports = {
  200: {
    userError: "Usuário não pode ser criado",
    deletedDuplicates: "Duplicados foram deletados!",
  },
  201: {
    status: 201,
    userSuccess: "Usuário foi criado com sucesso",
  },
  401: {
    status: 401,
    tokenItsNotValid: "Token inválido",
    userLoginError: "Login ou senha incorretos",
  },
  403: {
    status: 403,
    tokenNotFound: "Token de autenticação não fornecido.",
  },
  404: {
    status: 404,
    userNotFound: "Usuário não encontrado",
    noProductsFound: "Nenhum produto encontrado!",
    noListsFound: "Nenhuma lista foi encontrada",
  },
  409: {
    status: 409,
    userAlreadyExist: "Usuário já existe na nossa base de dados",
  },
  422: {
    status: 422,
    requiredfields: "Preencha todos os campos",
    userNotDefined: "user: É obrigatório"
  },
};
