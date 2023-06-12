import Joi from 'joi';
import { TPaginationQuery } from '../types/common/pagination-query.type';

export const PaginationQuerySchemaDefinition = () => ({
  limit: Joi.number().min(1).default(10),
  page: Joi.number().min(1).default(1),
});

export const PaginationQuerySchema = Joi.object<TPaginationQuery>(
  PaginationQuerySchemaDefinition()
);
