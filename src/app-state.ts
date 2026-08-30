import type { AppState, View } from './types/app';
import type { Car, CreateCarData } from './types/car';
import type { WinnersSortField, SortOrder } from './types/app';
import { DEFAULT_CAR_COLOR } from './constants';


export const appState: AppState = {
 currentView: 'garage',
 selectedCar: undefined,
 garagePage: 1,
 winnersPage: 1,
 winnersSortField: 'wins',
 winnersSortOrder: 'desc',
 createCarDraft: {
    name: '',
    color: DEFAULT_CAR_COLOR,
  },
  updateCarDraft: undefined,
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
export function setWinnersPage(page: number): void {
    appState.winnersPage = page;
  }
  export function setWinnersSortField(
    field: WinnersSortField,
  ): void {
    appState.winnersSortField = field;
  }
  export function setWinnersSortOrder(
    order: SortOrder,
  ): void {
    appState.winnersSortOrder = order;
  }
  export function setCreateCarDraft(
    draft: CreateCarData,
  ): void {
    appState.createCarDraft = draft;
  }
  
  export function setUpdateCarDraft(
    draft: CreateCarData | undefined,
  ): void {
    appState.updateCarDraft = draft;
  }