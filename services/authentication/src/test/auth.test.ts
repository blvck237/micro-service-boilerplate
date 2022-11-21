import { ApolloHandler } from '@loaders/apollo';
import { createInputUser, createUser, defaultPassword } from '@factories/user';
import DataBaseHandler from '@loaders/database';
import { ApolloServer } from 'apollo-server';
import { ErrorCodes } from '@typings/common';
import { UserRole, UserType } from '@typings/user';
import { Collection } from 'mongodb';
import { CollectionsEnum } from '@typings/db';

describe('Authentication', () => {
  let server: ApolloServer;
  let usersCollection: Collection<UserType>;

  beforeAll(async () => {
    await DataBaseHandler.connect(process.env.DB_URL);
    const db = DataBaseHandler.getDb();
    usersCollection = db.collection(CollectionsEnum.USERS);
    const apolloHandler = new ApolloHandler(Number(process.env.PORT));
    await apolloHandler.start(db);
    ({ server } = apolloHandler);
  });

  afterAll(async () => {
    await DataBaseHandler.close();
    server.stop();
  });

  describe('Signup', () => {
    const signUpUser = createInputUser();
    const query = 'mutation($user: UserInput!) { signUp(user: $user) { _id email firstname lastname role token refreshToken } }';

    it('should create a new user', async () => {
      const result = await server.executeOperation({
        query,
        variables: { user: signUpUser },
      });
      expect(result.data.signUp).toBeDefined();
      expect(result.data.signUp._id).toBeDefined();
      expect(result.data.signUp.email).toBe(signUpUser.email);
      expect(result.data.signUp.firstname).toBe(signUpUser.firstname);
      expect(result.data.signUp.lastname).toBe(signUpUser.lastname);
      expect(result.data.signUp.role).toBe(signUpUser.role);
      expect(typeof result.data.signUp.token).toBe('string');
      expect(result.data.signUp.refreshToken).toBeDefined();
    });
    it('should throw an error if invalid password', async () => {
      const result = await server.executeOperation({
        query,
        variables: { user: { ...signUpUser, password: '123' } },
      });
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message).toBe(ErrorCodes.INVALID_PASSWORD);
    });

    it('should throw an error if invalid email', async () => {
      const result = await server.executeOperation({
        query,
        variables: { user: { ...signUpUser, email: 'invalidemail' } },
      });
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message).toBe(ErrorCodes.INVALID_EMAIL);
    });

    it('should not signup a user with an existing email', async () => {
      // insert a user with correct data
      await server.executeOperation({
        query,
        variables: { user: signUpUser },
      });
      // try to insert a user with the same email
      const result = await server.executeOperation({
        query,
        variables: { user: signUpUser },
      });
      expect(result.errors).toBeDefined();
      expect(result.errors[0].message).toBe(ErrorCodes.USER_ALREADY_EXISTS);
    });
  });

  describe('Login', () => {
    const loginUser = createUser(UserRole.USER);
    const query = 'mutation($email: String!, $password: String!) { login(email: $email, password: $password) { _id email firstname lastname role token refreshToken } }';
    beforeAll(async () => {
      // insert a user with correct data
      await usersCollection.insertOne(loginUser);
    });

    it('should login a user and generate an auth and refresh token', async () => {
      const result = await server.executeOperation({
        query,
        variables: { email: loginUser.email, password: defaultPassword },
      });
      expect(result.data.login).toBeDefined();
      expect(result.data.login._id).toBeDefined();
      expect(result.data.login.email).toBe(loginUser.email);
      expect(result.data.login.firstname).toBe(loginUser.firstname);
      expect(result.data.login.lastname).toBe(loginUser.lastname);
      expect(result.data.login.role).toBe(loginUser.role);
      expect(typeof result.data.login.token).toBe('string');
      expect(result.data.login.refreshToken).toBeDefined();
    });

    it('Should throw an error if email is not found', async () => {
      const result = await server.executeOperation({
        query,
        variables: { email: 'random@email.com', password: defaultPassword },
      });
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[0].message).toBe(ErrorCodes.INVALID_CREDENTIALS);
    });

    it('Should throw an error if email exists but password is incorrect', async () => {
      const result = await server.executeOperation({
        query,
        variables: { email: loginUser.email, password: 'randomPassword' },
      });
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[0].message).toBe(ErrorCodes.INVALID_CREDENTIALS);
    });
  });
});
