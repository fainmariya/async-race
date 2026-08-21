import type { EngineResponse, DriveResponse } from '../types/engine';
import { API_BASE_URL, ENGINE_ENDPOINT ,ENGINE_BREAKDOWN_STATUS } from '../constants';
import { isEngineResponse, isDriveResponse } from '../utils/type-guards';

export async function startEngine(
  id: number,
  ): Promise<EngineResponse> {
    const response = await fetch(
      `${API_BASE_URL}${ENGINE_ENDPOINT}?id=${id}&status=started`,
      {
        method: 'PATCH',
      },
      );
    if (!response.ok) {
      throw new Error('Failed to start engine.');
    }
    const data: unknown = await response.json();
    if (!isEngineResponse(data)) {
      throw new TypeError('Invalid engine response.');
      }
     
      return data;
  }
  export async function stopEngine(
    id: number,
  ): Promise<EngineResponse> {
    const response = await fetch(
        `${API_BASE_URL}${ENGINE_ENDPOINT}?id=${id}&status=stopped`,
        {
          method: 'PATCH',
        },
        );
    if (!response.ok) {
      throw new Error('Failed to stop engine.');
}
    const data: unknown = await response.json();
    if (!isEngineResponse(data)) {
      throw new TypeError('Invalid engine response.');
      }
     
      return data;
  }
  export async function driveEngine(
    id: number,
  ): Promise<DriveResponse> {
    const response = await fetch(
        `${API_BASE_URL}${ENGINE_ENDPOINT}?id=${id}&status=drive`,
        {
          method: 'PATCH',
        },
        );
    if (response.status === ENGINE_BREAKDOWN_STATUS) {
      return {
        success: false,
      };
        }
    if (!response.ok) {
      throw new Error('Failed to drive.');
        }
    const data: unknown = await response.json();
    if (!isDriveResponse(data)){
        throw new TypeError('Invalid engine response.');
        }
       
        return data;
  }