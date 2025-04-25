import { query } from '../db';

export const createInitialTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS publications (
        id SERIAL PRIMARY KEY,
        numero_processo TEXT,
        data_disponibilizacao DATE,
        autores TEXT,
        advogados TEXT,
        valor_principal NUMERIC,
        juros_moratorios NUMERIC,
        honorarios_adv NUMERIC,
        reu TEXT,
        status TEXT,
        conteudo_publicacao TEXT
    );
  `;
  try {
    await query(createTableQuery);
    console.log('Tabela "publications" verificada/criada com sucesso.');
  } catch (error) {
    console.error('Erro ao criar/verificar a tabela "publications":', error);
  }
};
