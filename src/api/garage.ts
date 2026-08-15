import type { Car, CreateCarData } from '../types/car';
import { API_BASE_URL, GARAGE_ENDPOINT } from '../constants';
import { isCar, isCarArray } from '../utils/type-guards';

export async function getCars(): Promise<Car[]> {
  const response = await fetch(`${API_BASE_URL}${GARAGE_ENDPOINT}`);

  if (!response.ok){
      throw new Error('Failed to fetch cars.');
      }

  const data: unknown = await response.json();

  if (!isCarArray(data)) {
    throw new Error('Invalid cars data.');
  }

  return data
}

export async function createCar(
    data: CreateCarData,
): Promise<Car> {
  const response = await fetch(`${API_BASE_URL}${GARAGE_ENDPOINT}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(data),
});
if (!response.ok) {
    throw new Error('Failed to create car.');
}
const dataFromServer: unknown = await response.json();
if (!isCar(dataFromServer)) {
    throw new Error('Invalid car data.');
  }
  return dataFromServer;
}

export async function updateCar(
    id: number,
    data: CreateCarData,
): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}${GARAGE_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update car.');
    }
    const dataFromServer: unknown = await response.json();
    if (!isCar(dataFromServer)) {
      throw new Error('Invalid car data.');
  }
    return dataFromServer;
}
export async function deleteCar(
    id: number
):Promise<void> {
    const response = await fetch(`${API_BASE_URL}${GARAGE_ENDPOINT}/${id}`,{
        method: 'DELETE', 
})
if (!response.ok) {
    throw new Error('Failed to delete car.')
}
}