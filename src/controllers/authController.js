import { authService } from "../services/authService.js";

export const authController = {
    login: async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
        }
  
        try {
            const loginResult = await authService.login(username, password);

            if(loginResult) {
                const { id, token } = loginResult;
                res.cookie('token', token, { 
                    httpOnly: true, 
                    //secure: true,
                    //sameSite: 'strict',
                    //Só reativar as opções acima em contexto de produção.
                    maxAge: 3 * 3600000
                }); 
                res.status(200).json({ id, token });
            } else {
                res.status(401).json({ error: 'Erro ao enviar token' });
            }
        } catch (err) {
            console.error(`Erro no login: ${err.message}`);
            res.status(401).json({ error: 'Nome de usuário ou senha inválidos' });
        }
    },
    //curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
    //-H "Content-Type: application/json" \
    //-d '{
    //"username": "anitakawasaki",
    //"password": "asenhasemhash"
    //}'

    logout: (req, res) => {
        if (req.cookies.token) {
            res.clearCookie('token', {
                httpOnly: true 
                //secure: true, 
                //sameSite: 'strict'
                //Só reativar as opções acima em contexto de produção.
            });
            res.status(200).json({ message: 'Logout bem-sucedido' });
        } else {
            res.status(200).json({ message: 'Nenhum token foi encontrado, portanto a sessão já foi encerrada com sucesso' });
        }
    }
    //curl -b cookies.txt -X DELETE http://localhost:3000/api/auth/logout
    //o seguinte comando para limpar cookies.txt manualmente (e simular o logout no navegador): > cookies.txt
  };