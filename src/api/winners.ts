import type { Winner, WinnersPageData } from '../types/winner';
import { isWinner, isWinnerArray } from '../utils/type-guards';
import { API_BASE_URL, 
    WINNERS_ENDPOINT,
    HTTP_NOT_FOUND_STATUS,
    TOTAL_COUNT_HEADER,
    MISSING_TOTAL_COUNT_ERROR,
    INVALID_TOTAL_COUNT_ERROR } from '../constants';
import type { WinnersSortField, SortOrder } from '../types/app';

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
  export async function getWinners(
    page: number,
    limit: number,
    sortField: WinnersSortField,
    sortOrder: SortOrder,
  ): Promise<WinnersPageData> {
    const response = await fetch(`${API_BASE_URL}${WINNERS_ENDPOINT}?_page=${page}&_limit=${limit}&_sort=${sortField}&_order=${sortOrder}`)
 
    if (!response.ok) {
      throw new Error('Failed to get winner.');
    }
 
    const data: unknown = await response.json();

    if (!isWinnerArray(data)) {
      throw new Error('Invalid winner response');
    }
    const totalHeader = response.headers.get(TOTAL_COUNT_HEADER);
    
    if (totalHeader === null) {
      throw new Error(MISSING_TOTAL_COUNT_ERROR);
    }
    const total = Number(totalHeader);
   
    if (!Number.isFinite(total)) {
      throw new TypeError(INVALID_TOTAL_COUNT_ERROR);
    }
    return {
        winners: data,
        total: total,
      }
  }
  export async function deleteWinner(
    id: number,
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}${WINNERS_ENDPOINT}/${id}`,
      {
        method: 'DELETE',
      },
    );
  
    if (response.status === HTTP_NOT_FOUND_STATUS) {
      return;
    }
  
    if (!response.ok) {
      throw new Error('Failed to delete winner.');
    }
  }