export function animateCar(
    carElement: SVGSVGElement,
    distance: number,
    duration: number,
  ): () => void {
    let startTime: number | undefined;
    let animationFrameId: number | undefined;
    function step(currentTime: number): void {
        if (startTime === undefined ){
          startTime = currentTime;
        }
       const elapsedTime = currentTime - startTime;
       if (elapsedTime >= duration) {
        carElement.style.transform = `translateX(${distance}px)`;
        return;
      }
    const progress = elapsedTime / duration;
    const position = distance * progress;
    carElement.style.transform = `translateX(${position}px)`;   
    animationFrameId = requestAnimationFrame(step); 
    }
    function cancelAnimation(): void {
        if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId);
          }
        }
    animationFrameId = requestAnimationFrame(step);
    return cancelAnimation;
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