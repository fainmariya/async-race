import type { AppState, View } from './types/app';
import type { Car } from './types/car';


export const appState: AppState = {
 currentView: 'garage',
 selectedCar: undefined,
 garagePage: 1,
};

export function setCurrentView(view: View): void {
    appState.currentView = view;
}
export function setSelectedCar(car: Car | undefined): void {
    appState.selectedCar = car;
}
export function setGaragePage(page: number): void {
    appState.garagePage = page;
  }