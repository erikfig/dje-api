import { query } from '../db';
import { validateFields, allowedFields } from '../validators/publicationsValidator';

const filterAllowedFields = (fields: Record<string, any>) => {
  return Object.keys(fields)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = fields[key];
      return obj;
    }, {} as Record<string, any>);
};

export const getPaginatedData = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return query('SELECT * FROM publications LIMIT $1 OFFSET $2', [limit, offset]);
};

export const getSingleRecord = async (id: string) => {
  return query('SELECT * FROM publications WHERE id = $1', [id]);
};

export const updateRecord = async (id: string, fields: Record<string, any>) => {
  const filteredFields = filterAllowedFields(fields);

  // Validação dos campos
  const validationErrors = validateFields(filteredFields);
  if (validationErrors.length > 0) {
    throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
  }

  const setClause = Object.keys(filteredFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const values = Object.values(filteredFields);

  return query(
    `UPDATE publications SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
};

export const insertRecord = async (fields: Record<string, any>) => {
  const filteredFields = filterAllowedFields(fields);

  const columns = Object.keys(filteredFields).join(', ');
  const placeholders = Object.keys(filteredFields).map((_, index) => `$${index + 1}`).join(', ');
  const values = Object.values(filteredFields);

  console.log('------------------------------------');

  console.log('Insert values:', values);
  console.log('Insert columns:', columns);

  return query(
    `INSERT INTO publications (${columns}) VALUES (${placeholders})
     ON CONFLICT DO NOTHING`,
    values
  );
};
