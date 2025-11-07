import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: (...args: unknown[]) => unknown) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const baseURL = 'https://jsonplaceholder.typicode.com';
const mockData = { id: 1, title: 'Test title' };
const mockUrl = '/posts/1';

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    } as unknown as typeof axios);

    const result = await throttledGetDataFromApi(mockUrl);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL,
    });
    expect(result).toEqual(mockData);
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: { id: 1 } });
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as typeof axios);
    await throttledGetDataFromApi(mockUrl);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL,
    });

    expect(mockGet).toHaveBeenCalledWith(mockUrl);
  });

  test('should return response data', async () => {
    const mockCreate = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });
    (axios.create as jest.Mock).mockImplementation(mockCreate);

    const result = await throttledGetDataFromApi(mockUrl);

    expect(result).toEqual(mockData);
  });
});
