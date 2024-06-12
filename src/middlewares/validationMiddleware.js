import { body } from 'express-validator';
import { artistService } from '../services/artistService.js';

export const validationMiddleware = {
    validateArtistCreation: [
        body('name')
        //body('campo'): Esta função é usada para especificar qual campo de entrada você deseja validar. O argumento passado para body deve ser o nome do campo que será buscado no corpo (body) da requisição HTTP. O express-validator também suporta query(), param(), cookie(), header() para buscar e validar dados de outras partes da requisição.
            .trim()
            //.algo(): Estas são funções de validação ou saneamento que você encadeia após a especificação do campo. Existem muitas funções disponíveis, cada uma projetada para uma forma específica de validação ou modificação dos dados. Exemplos incluem .isEmail(), .isInt(), .trim(), .notEmpty(), e muitas outras.
            .notEmpty().withMessage('O nome do artista é obrigatório')
            .isString().withMessage('O nome do artista deve ser uma string')
            .isLength({ max: 50 }).withMessage('O nome do artista não pode exceder 50 caracteres')
            .custom(async (name, { req }) => {
                const nameExists = await artistService.existenceOfTheSameArtistName(name,req.params.id);
                if (nameExists) {
                    throw new Error('Já existe um artista com esse nome no banco de dados');
                }
                return true;}),

        body('biography')
            .optional()
            .trim()
            .isString().withMessage('A biografia do artista deve ser uma string')
            .isLength({ max: 400 }).withMessage('A biografia não pode exceder 400 caracteres'),

        body('photo_url')
            .optional()
            .trim()
            .isURL().withMessage('A URL da foto deve ser válida')
            .isLength({ max: 400 }).withMessage('A URL da foto não pode exceder 400 caracteres')
            .custom(async (photo_url, { req }) => {
                const urlExists = await artistService.existenceOfTheSamePhotoUrl(photo_url, req.params.id);
                if (urlExists) {
                    throw new Error('A URL da foto já está em uso');
                }
                return true;}),
    ],
}

//Funcionamento Interno
//Especificação do Campo: Quando você chama body('nomeCampo'), você está criando um objeto de validação para esse campo específico. Isso define onde e o que o express-validator deve buscar no objeto de requisição para aplicar as regras de validação subsequentes.
//Validações Encadeadas: As funções de validação são chamadas em cadeia para aplicar várias regras a um campo específico. Cada função retorna um objeto que permite mais funções de validação ou saneamento a serem encadeadas. Isso torna fácil definir múltiplas regras de validação para um único campo.
//Execução e Resposta: Quando uma requisição é recebida, o express-validator processa cada validador na ordem em que foram definidos. Se alguma validação falhar, ela registra o erro. Após todas as validações serem processadas, você pode verificar se houve erros e responder adequadamente.