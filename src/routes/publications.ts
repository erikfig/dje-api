import { Router, Request, Response } from 'express';
import { getPaginatedData, getSingleRecord, updateRecord } from '../services/publicationsService';
import { validateFields } from '../validators/publicationsValidator';

const router = Router();

// Endpoint para busca paginada
router.get('/', async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, dateFrom, dateTo } = req.query;

  try {
    const result = await await getPaginatedData(
      Number(page),
      Number(limit),
      search as string,
      dateFrom as string,
      dateTo as string
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).send('Erro ao buscar dados.');
  }
});

// Endpoint para retornar um registro único
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getSingleRecord(id);
    if (result.rows.length === 0) {
      res.status(404).send('Registro não encontrado.');
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar o registro:', error);
    res.status(500).send('Erro ao buscar o registro.');
  }
});

// Endpoint para editar um registro
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;

  // Validação dos campos
  const validationErrors = validateFields(fields);
  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    const result = await updateRecord(id, fields);
    if (result.rows.length === 0) {
      res.status(404).send('Registro não encontrado.');
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar o registro:', error);
    res.status(500).send('Erro ao atualizar o registro.');
  }
});

export default router;
