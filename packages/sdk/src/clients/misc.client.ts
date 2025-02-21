import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LookupData } from '../types/misc.type';

export class MiscClient {
  private _client: AxiosInstance;
  private _prefix = 'misc';

  constructor(apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async getLookupData(config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/lookup`, config);
    return formatResponse<LookupData>(response);
  }
}
