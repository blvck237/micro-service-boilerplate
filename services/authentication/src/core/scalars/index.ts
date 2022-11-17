import { scalarObjectId, resolverObjectId } from '@core/scalars/ObjectId';

export const scalarTypeDefs = [scalarObjectId];

export const scalarResolvers = {
  ...resolverObjectId,
};
