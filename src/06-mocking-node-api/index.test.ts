import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

describe('doStuffByTimeout', () => {
  let timeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    timeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    timeoutSpy.mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(() => {}, 1000);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 1000);

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('should call callback repeatedly at intervals', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 1000);

    jest.advanceTimersByTime(3000);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockExistsSync = existsSync as jest.Mock;
  const mockReadFile = fs.readFile as jest.Mock;
  const mockJoin = path.join as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with __dirname and pathToFile', async () => {
    mockExistsSync.mockReturnValue(false);

    await readFileAsynchronously('pathToFile');
    expect(mockJoin).toHaveBeenCalledWith(__dirname, 'pathToFile');
  });

  test('should return null if file does not exist', async () => {
    mockExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('pathToFile');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFile.mockResolvedValue(Buffer.from('file content'));

    const result = await readFileAsynchronously('pathToFile');
    expect(result).toBe('file content');
    expect(mockReadFile).toHaveBeenCalled();
  });
});
