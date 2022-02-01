import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

describe('Create statement', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  })

  it('should be able to create statement correctly', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });


    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'czPerTOXuQ'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create statement if user is non-existent', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'user_id',
        type: OperationType.DEPOSIT,
        amount: 10,
        description: 'czPerTOXuQ'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create statement if withdraw greater than the balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    const user_id = user.id as string

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'czPerTOXuQ'
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id,
        type: OperationType.WITHDRAW,
        amount: 150,
        description: 'czPerTOXuQ'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
