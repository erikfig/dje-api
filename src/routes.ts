import { Express, Request, Response } from 'express';
import { authenticateJWT, generateToken } from './middleware/auth';
import publicationsRoutes from './routes/publications';

export const routes = (app: Express) => {
  app.get('/', (_req: Request, res: Response) => {
    res.send('Bem-vindo à API JusCash!');
  });

  app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === 'admin@admin.com' && password === 'password') {
      const token = generateToken({ username });
      res.json({ token });
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  });

  app.use('/publications', authenticateJWT, publicationsRoutes);
};