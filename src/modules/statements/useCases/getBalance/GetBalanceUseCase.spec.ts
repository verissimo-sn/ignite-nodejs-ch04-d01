import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe('Get balance', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  })

  it('should be able to get balance correctly', async () => {

    const user = await inMemoryUsersRepository.create({
      name: 'Ralph Thompson',
      email: 'se@deznabepe.ug',
      password: 'unitTest'
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'czPerTOXuQ'
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance.balance).toEqual(100);
  });

  it("Should not be able to get balance if user is non-existent", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "user_id" })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
