import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe('Get Statement Operation', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  })

  it('should be able to Get Statement Operation correctly', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'czPerTOXuQ'
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    })

    expect(statementOperation.amount).toBe(100);
    expect(statementOperation.description).toBe('czPerTOXuQ');
  });

  it("Should not be able to Get Statement Operation if user is non-existent", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'czPerTOXuQ'
    })
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user_id",
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to Get Statement Operation if Statement is non-existent", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'statement_id'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
