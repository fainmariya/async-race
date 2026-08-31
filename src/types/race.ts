export type RaceCar = {
  id: number;
  name: string;
  carElement: SVGSVGElement;
  finishElement: HTMLElement;
  startButton: HTMLButtonElement;
  stopButton: HTMLButtonElement;
  };
export type RaceResult = {
    id: number;
    name: string;
    time: number;
  };