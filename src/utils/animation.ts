
import type { AnimationController } from '../types/animation';

export function animateCar(
    carElement: SVGSVGElement,
    distance: number,
    duration: number,
  ): AnimationController {
    let startTime: number | undefined;
    let animationFrameId: number | undefined;
    let cancelAnimation: (() => void) | undefined;
  
    const finished = new Promise<boolean>((resolve) => {
      function step(currentTime: number): void {
        if (startTime === undefined) {
          startTime = currentTime;
        }
  
        const elapsedTime = currentTime - startTime;
  
        if (elapsedTime >= duration) {
          carElement.style.transform = `translateX(${distance}px)`;
          resolve(true);
          return;
        }
  
        const progress = elapsedTime / duration;
        const position = distance * progress;
  
        carElement.style.transform = `translateX(${position}px)`;
        animationFrameId = requestAnimationFrame(step);
      }
  
      cancelAnimation = (): void => {
        if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId);
        }
  
        resolve(false);
      };
  
      animationFrameId = requestAnimationFrame(step);
    });
  
    return {
      cancel: () => {
        if (cancelAnimation !== undefined) {
          cancelAnimation();
        }
      },
      finished,
    };
  }
export function getDistanceToFinish(
  carElement: SVGSVGElement,
  finishElement: HTMLElement,
    ): number {
      const carRect = carElement.getBoundingClientRect();
      const finishRect = finishElement.getBoundingClientRect();
      return finishRect.left - carRect.right;
      }
export function getAnimationDuration(
  distance: number,
  velocity: number,
): number {
  if (velocity <= 0){
    throw new RangeError('Velocity must be greater than zero.') 
  }
    return distance / velocity;
}