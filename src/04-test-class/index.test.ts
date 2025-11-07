import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(5).getBalance()).toBe(5);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(10);
    expect(() => account.withdraw(15)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(10);
    const account2 = getBankAccount(5);

    expect(() => account.transfer(15, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(10);

    expect(() => account.transfer(15, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(10);
    account.deposit(5);
    expect(account.getBalance()).toBe(15);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(10);
    account.withdraw(4);
    expect(account.getBalance()).toBe(6);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(10);
    const account2 = getBankAccount(5);

    account1.transfer(4, account2);

    expect(account1.getBalance()).toBe(6);
    expect(account2.getBalance()).toBe(9);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(10);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(42);

    await expect(account.synchronizeBalance()).resolves.not.toThrow();
    expect(account.getBalance()).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(10);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(42);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(10);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
