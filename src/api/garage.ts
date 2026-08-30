import type { Car, CreateCarData, GaragePageData } from '../types/car';
import { API_BASE_URL, GARAGE_ENDPOINT, HTTP_NOT_FOUND_STATUS } from '../constants';
import { isCar, isCarArray } from '../utils/type-guards';

export async function getCars(
    page: number,
    limit: number,
): Promise<GaragePageData> {
  const response = await fetch(`${API_BASE_URL}${GARAGE_ENDPOINT}?_page=${page}&_limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch cars.');
    }

  const data: unknown = await response.json();
  const xTotalCount = response.headers.get('X-Total-Count');
  if (xTotalCount === null) {
    throw new Error('Total cars count is missing.');
  }
  const total = Number(xTotalCount);
  if (Number.isNaN(total)) {
    throw new TypeError('Invalid total cars count.');
  }

  if (!isCarArray(data)) {
    throw new Error('Invalid cars data.');
  }

  return {
    cars: data,
    total,
  };
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
    throw new TypeError('Failed to delete car.')
}
}
export async function getCar(
    id: number,
): Promise<Car | undefined> {
    const response = await fetch(`${API_BASE_URL}${GARAGE_ENDPOINT}/${id}`);
    if (response.status === HTTP_NOT_FOUND_STATUS) {
        return undefined;
    }
    if (response.ok === false) {
      throw new Error('Failed to get car.');
    }
    const data: unknown = await response.json();
    if (!isCar(data)) {
        throw new TypeError('Invalid car data')
    }
    return data;
    }
