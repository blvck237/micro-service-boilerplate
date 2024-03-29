import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: `http://localhost:${process.env.PORT}`,
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers', 'typescript-mongodb', 'typescript-document-nodes'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
  // convert enums to union types
  config: {
    enumsAsTypes: true,
  },
};

export default config;
