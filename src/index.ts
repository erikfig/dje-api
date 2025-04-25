import 'dotenv/config';
import express from 'express';
import { routes } from './routes';
import { createInitialTable } from './utils/databaseSetup';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

routes(app);

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await createInitialTable(); // Verifica/cria a tabela ao iniciar o servidor
});
