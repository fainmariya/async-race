import type { Car } from '../types/car';
import type { EngineResponse, DriveResponse } from '../types/engine';
import type { Winner } from '../types/winner';

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
export function isEngineResponse(
    value: unknown,
  ): value is EngineResponse {
    if (
        typeof value === 'object'
        && value !== null
        && 'velocity' in value
        && 'distance' in value){
            return (
                typeof value.velocity === 'number'
                && typeof value.distance === 'number'
              );
        } return false;
    
  }
  export function isDriveResponse(
    value: unknown,
  ): value is DriveResponse {
    if (
        typeof value === 'object'
        && value !== null
        && 'success' in value) {
            return (
                typeof value.success === 'boolean'
              );
        } return false;
    
  }
  export function isWinner(
    value: unknown,
  ): value is Winner {
   if (typeof value === 'object'
    && value !== null
    && 'id' in value
    && 'wins' in value
    && 'time' in value
) {
    return (
        typeof value.id === 'number'
        && typeof value.wins === 'number'
        && typeof value.time === 'number'
    )
   }
   return false;
  }
