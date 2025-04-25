export const allowedFields = [
  "numero_processo",
  "data_disponibilizacao",
  "autores",
  "advogados",
  "valor_principal",
  "juros_moratorios",
  "honorarios_adv",
  "reu",
  "status",
  "conteudo_publicacao"
];

export const validateFields = (fields: Record<string, any>) => {
  const errors: string[] = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  Object.entries(fields).forEach(([key, value]) => {
    if (!allowedFields.includes(key)) {
      errors.push(`O campo "${key}" não é permitido.`);
    } else if (key === 'data_disponibilizacao' && value !== null && !dateRegex.test(value)) {
      errors.push(`O campo "${key}" deve estar no formato YYYY-MM-DD.`);
    } else if (key !== 'data_disponibilizacao' && value !== null && typeof value !== 'string') {
      errors.push(`O campo "${key}" deve ser uma string ou null.`);
    }
  });

  return errors;
};
