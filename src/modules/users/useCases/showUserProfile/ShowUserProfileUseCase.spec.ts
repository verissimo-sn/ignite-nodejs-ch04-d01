import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe('show user profile', () => {

  let showUserProfileUseCase: ShowUserProfileUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to find user by id', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      name: 'Dylan Underwood',
      email: 'jog@kom.ye',
      password: 'test'
    })

    const user_id = createdUser.id as string

    const user = await showUserProfileUseCase.execute(user_id);

    expect(user.id).toEqual(user_id);
  })

  it('should not be able to find user if id isn\'t exists', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('aksjfaj-129812398');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
