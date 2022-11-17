import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';
import { BadRequestException } from '@core/error/exceptions';

const scalarObjectId = 'scalar ObjectId';
const MONGODB_OBJECTID_REGEX = /^[A-Fa-f0-9]{24}$/; // https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId

const validateObjectId = (value: string) => {
  if (!MONGODB_OBJECTID_REGEX.test(value)) {
    throw new BadRequestException('INVALID_OBJECT_ID', { fields: { value } });
  }
  return value;
};

const validateString = (ast) => {
  if (ast.kind !== Kind.STRING) {
    throw new BadRequestException('INVALID_OBJECT_ID', { fields: { value: ast.value } });
  }
};

const resolverObjectId = {
  ObjectId: new GraphQLScalarType({
    name: 'ObjectId',
    description:
      'A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c. Automatically converts from string to ObjectId for all mutations.',
    serialize: validateObjectId,
    parseValue(value: string) {
      // Convert to objectID
      return new ObjectId(validateObjectId(value));
    },
    parseLiteral(ast) {
      validateString(ast);
      // Convert to objectID
      return new ObjectId(validateObjectId(ast.value));
    },
  }),
};

export { resolverObjectId, scalarObjectId };
