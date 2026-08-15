import type { Car } from '../types/car';

export function isCar(value: unknown): value is Car {
  if (
    typeof value === 'object'
    && value !== null
    && 'id' in value
    && 'name' in value
    && 'color' in value){
        return (
            typeof value.id === 'number'
            && typeof value.name === 'string'
            && typeof value.color === 'string'
          );
    } return false;
   }
    
    
export function isCarArray(value: unknown): value is Car[] {
  
    return Array.isArray(value) && value.every(isCar);
  }