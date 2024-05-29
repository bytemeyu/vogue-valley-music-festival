import { usersService } from "../services/usersService.js";

export const usersController = {
    getAllUsers: async(req, res) => {
        try {
            const allUsers = await usersService.getAllUsers();

            if(allUsers.length === 0) {
                res.status(200).json(
                    {
                        'success': true,
                        'data': 'Não há nenhum usuário no banco de dados'
                    }
                );
            } else {
                res.status(200).json(
                    {
                        'success': true, 	
                        'data': allUsers,
                    }
                );
            }
        } catch(err) {
            console.error(`Erro ao recuperar todos os usuários: ${err.message}`);
            res.status(500).json(
                {
                    'success': false, 	
                    'error': 'Erro ao recuperar todos os usuários',
                }
            );
        }
    },
    //curl -X GET http://localhost:3000/api/users

    getUserById: async(req, res) => {
        const { id } = req.params;

        try {
            const userById = await usersService.getUserById(id);
            if(userById.length === 0){
                res.status(200).json(
                    {
                        'sucess': true,
                        'data': 'Não há nenhum usuário com o id especificado no banco de dados'
                    }
                );
            } else {
                res.status(200).json(
                    {
                        'success': true,
                        'data': userById,
                    }
                );
            }
        } catch(err) {
            console.error(`Erro ao recuperar usuário com id ${id}: ${err.message}`);
            res.status(500).json(
                {
                    'success': false,
                    'error': 'Erro ao recuperar usuário a partir de id',
                }
            );
        }
    },
    //curl -X GET http://localhost:3000/api/users/1

    createUser: async(req, res) => {
        const { email, username, password_hash, role } = req.body;

        try {
            const createdUser = await usersService.createUser(email, username, password_hash, role);
            res.status(200).json(
                {
                    'sucess': true,
                    'data': createdUser,
                }
            );
        } catch(err) {
            console.error(`Erro ao criar novo usuário no banco de dados: ${err.message}`);
            res.status(500).json(
                {
                    'success': false,
                    'error': 'Erro ao criar novo usuário no banco de dados',
                }
            );
        }
    },
    //curl -X POST http://localhost:3000/api/users \
    //-H "Content-Type: application/json" \
    //-d '{
    //"email": "anita@mail.com",
    //"username": "anitakawasaki",
    //"password_hash": "asenhasemhash",
    //"role": "webadmin"
    //}'

    updateUser: async(req, res) => {
        const { id } = req.params;

        try {
            const outdatedUser = await usersService.getUserById(id);
            const { email } = req.body;
            const emailToUse = email || outdatedUser[0].email;
            const { username } = req.body;
            const usernameToUse = username || outdatedUser[0].username;
            const { password_hash } = req.body;
            const password_hashToUse = password_hash || outdatedUser[0].password_hash;
            const { role } = req.body;
            const roleToUse = role || outdatedUser[0].role;

            const updatedUser = await usersService.updateUser(id, emailToUse, usernameToUse, password_hashToUse, roleToUse);
            res.status(200).json(
                {
                    'success': true,
                    'data': updatedUser,
                }
            );
        } catch(err) {
            console.error(`Erro ao atualizar usuário com id ${id} no banco de dados: ${err.message}`);
            res.status(500).json(
                {
                    'success': false,
                    'error': 'Erro ao atualizar usuário no banco de dados',
                }
            );
        }
    },
    //curl -X PUT http://localhost:3000/api/users/1 \
    //-H "Content-Type: application/json" \
    //-d '{
    //"email": "anita@mail.com.br"
    //}'

    deleteUser: async(req, res) => {
        const { id } = req.params;

        try {
            const deletedUser = await usersService.deleteUser(id);
            res.status(200).json(
                {
                    'success': true,
                    'data': deletedUser,
                }
            );
        } catch {
            console.error(`Erro ao deletar usuário com id ${id} no banco de dados: ${err.message}`);
            res.status(500).json(
                {
                    'success': false,
                    'error': 'Erro ao deletar usuário do banco de dados',
                }
            );
        }
    }
    //curl -X DELETE http://localhost:3000/api/users/1
};



//FALTA: fazer o if else, no updateUser e deleteUser, caso o usuário não exista!