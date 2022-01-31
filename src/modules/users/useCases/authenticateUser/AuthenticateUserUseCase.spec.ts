import { hash } from "bcryptjs"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

describe('Authenticate User', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let authenticateUserUseCase: AuthenticateUserUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate user correctly', async () => {
    const password = await hash('unitTests', 8);

    await inMemoryUsersRepository.create({
      name: 'Ollie Dennis',
      email: 'hobahu@zuswizsup.as',
      password
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: 'hobahu@zuswizsup.as',
      password: 'unitTests'
    });

    expect(authenticatedUser).toHaveProperty('user');
    expect(authenticatedUser).toHaveProperty('token');
  })

  it('should not be able to authenticate user if email not matched', async () => {
    const password = await hash('unitTests', 8);

    await inMemoryUsersRepository.create({
      name: 'Ollie Dennis',
      email: 'hobahu@zuswizsup.as',
      password
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'hobahu@zuswizs.as',
        password: 'unitTests'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it('should not be able to authenticate user if password not matched', async () => {
    const password = await hash('unitTests', 8);

    await inMemoryUsersRepository.create({
      name: 'Ollie Dennis',
      email: 'hobahu@zuswizsup.as',
      password
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'hobahu@zuswizsup.as',
        password: 'unitTes'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})
