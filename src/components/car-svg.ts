import { 
    SVG_NAMESPACE, 
    CAR_BODY_PATH,
    CAR_REAR_WHEEL_X,
    CAR_WHEEL_Y,
    CAR_WHEEL_RADIUS,
    CAR_FRONT_WHEEL_X,

} from '../constants';

export function createCarSvg(color: string): SVGSVGElement {
    const elementCar = document.createElementNS(SVG_NAMESPACE, 'svg');
    elementCar.setAttribute('viewBox', '0 0 100 40');
    elementCar.classList.add('car-svg');
    const carBody = document.createElementNS(SVG_NAMESPACE, 'path');
    carBody.setAttribute('d',CAR_BODY_PATH);
    carBody.setAttribute('fill', color);
  
    const leftWheel = document.createElementNS(SVG_NAMESPACE, 'circle');
    leftWheel.classList.add('garage-car__wheel');
    leftWheel.setAttribute('cx', CAR_REAR_WHEEL_X);
    leftWheel.setAttribute('cy', CAR_WHEEL_Y);
    leftWheel.setAttribute('r', CAR_WHEEL_RADIUS); 
    leftWheel.setAttribute('fill', color);
      
    const rightWheel = document.createElementNS(SVG_NAMESPACE, 'circle');
    rightWheel.classList.add('garage-car__wheel');
    rightWheel.setAttribute('cx', CAR_FRONT_WHEEL_X);
    rightWheel.setAttribute('cy', CAR_WHEEL_Y);
    rightWheel.setAttribute('r', CAR_WHEEL_RADIUS); 
    rightWheel.setAttribute('fill', color);
      
    elementCar.append(carBody, leftWheel, rightWheel);
      return elementCar;
      }
      