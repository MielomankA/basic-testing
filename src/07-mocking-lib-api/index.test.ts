import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: (...args: unknown[]) => unknown) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    mockedAxios.create.mockReturnValue({
      get: jest
        .fn()
        .mockResolvedValue({ data: { id: 1, title: 'Test title' } }),
    } as unknown as typeof axios);

    const result = await throttledGetDataFromApi('/posts/1');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(result).toEqual({ id: 1, title: 'Test title' });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: { id: 1 } });
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as typeof axios);
    await throttledGetDataFromApi('/posts/1');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });

    expect(mockGet).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const mockCreate = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { id: 1 } }),
    });
    (axios.create as jest.Mock).mockImplementation(mockCreate);

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual({ id: 1 });
  });
});
