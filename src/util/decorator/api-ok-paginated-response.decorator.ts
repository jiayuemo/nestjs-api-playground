import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../dto';

/**
 * Custom Swagger Decorator on top of ApiOkResponse
 * @param {TModel} model - specific resource-response DTO, nongeneric
 * @returns
 */
export const ApiOkPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Retrieves a list of resources',
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
