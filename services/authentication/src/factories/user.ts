import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';
import { UserRole, UserType } from '@typings/user';
import { UserInput } from '@generated';
import { passwordRegex } from '@utils/password';

export const defaultPassword = 'Hello@MS.Test=123';
const defaultHash = '$2a$10$BrOTF4125ymHlkFwr/MY3eHdokJlHKtNtvpfibpa1XR85s4rsY29O';
/**
 * creates users ready to be inserted directly into the database
 */
const generateDBUser = (count: number, role?: UserType['role']) => {
  const users: UserType[] = [];
  for (let i = 0; i < count; i++) {
    const _id = new ObjectId();
    const createdAt = Date.now();
    users.push({
      _id,
      email: faker.internet.email().toLocaleLowerCase(),
      password: defaultHash,
      createdAt,
      updatedAt: createdAt,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: role ?? faker.helpers.arrayElement([UserRole.ADMIN, UserRole.USER]),
      tokens: [],
      refreshToken: '',
    });
  }
  return users;
};

/**
 * Creates users ready to be used for signup
 */
const generateUserInput = (count: number, role?: UserInput['role']) => {
  const users: UserInput[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      email: faker.internet.email(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: faker.helpers.arrayElement([UserRole.ADMIN, UserRole.USER]),
      password: defaultPassword,
    });
  }
  return users;
};

export const createRandomUsers = (count: number): UserType[] => {
  return generateDBUser(count);
};

export const createRoleUsers = (count: number, role: UserType['role']): UserType[] => {
  return generateDBUser(count, role);
};

export const createUser = (role: UserType['role']): UserType => {
  return generateDBUser(1, role)[0];
};

export const createRandomUser = (): UserType => {
  return generateDBUser(1)[0];
};

export const createInputUsers = (count: number): UserInput[] => {
  return generateUserInput(count);
};

export const createInputUser = (): UserInput => {
  return generateUserInput(1)[0];
};
