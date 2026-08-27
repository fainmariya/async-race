import type { Winner } from '../types/winner';
import { isWinner } from '../utils/type-guards';
import { API_BASE_URL, 
    WINNERS_ENDPOINT,
    HTTP_NOT_FOUND_STATUS } from '../constants';

export async function getWinner(
    id: number,
  ): Promise<Winner | undefined> {
    const response = await fetch(
        `${API_BASE_URL}${WINNERS_ENDPOINT}/${id}`
      )
   
    if (response.status === HTTP_NOT_FOUND_STATUS) {
        return undefined;
      }
      
    if (!response.ok) {
        throw new Error('Failed to get winner.');
      }
    
    const data: unknown = await response.json();
   
    if (!isWinner(data)) {
    throw new TypeError('Invalid winner response')
   }
   
    return data;
  }
export async function createWinner(
    data: Winner,
  ): Promise<Winner> {
    const response = await fetch(`${API_BASE_URL}${WINNERS_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(data),
    });

    if (!response.ok){
      throw new Error('Failed to create winner')
    } 

    const responseData: unknown = await response.json();

    if (!isWinner(responseData)){
        throw new TypeError('Invalid winner response.');
    }
    return responseData;
  }
export async function updateWinner(
    id: number,
    data: Winner,
  ): Promise<Winner> {
    const response = await fetch(`${API_BASE_URL}${WINNERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(data),
    });
    if (!response.ok) {
       throw new Error('Failed to update winner')
      }
      
      const responseData: unknown = await response.json();
      
      if (!isWinner(responseData)) {
        throw new TypeError('Invalid winner response')
      }
      
      return responseData;
  }