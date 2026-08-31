import { CAR_BRANDS, CAR_MODELS, HEX_CHARACTERS, HEX_COLOR_LENGTH } from '../constants';
import type { CreateCarData } from '../types/car';

export function getRandomCarName(): string {
  const randomIndex = Math.floor(Math.random() * CAR_BRANDS.length);
  const randomBrand = CAR_BRANDS[randomIndex];
  
  const randomModelIndex = Math.floor(Math.random() * CAR_MODELS.length);
  const randomModel = CAR_MODELS[randomModelIndex];
 
  return `${randomBrand} ${randomModel}`;
  } 
function getRandomHexCharacter(): string {
  const indexHex = Math.floor(Math.random() * HEX_CHARACTERS.length);
  const randomCharacter = HEX_CHARACTERS[indexHex];
  return randomCharacter;
}

export function getRandomColor(): string {
  let color = '#';
  
  for (let index = 0;  index < HEX_COLOR_LENGTH; index += 1){
    color += getRandomHexCharacter();
    }
return color;
  }
export function getRandomCarData(): CreateCarData {
  return {
    name: getRandomCarName(),
    color: getRandomColor(),
  };
}