import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe('Create user', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create user correctly', async () => {
    const user = await createUserUseCase.execute({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user if email already exists', async () => {
    await createUserUseCase.execute({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: 'Dollie Webb',
        email: 'se@deznabepe.ug',
        password: 'unitTest'
      })
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
