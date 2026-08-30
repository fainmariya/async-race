import type { Car } from './car';
import type { CreateCarData } from './car';

export type View = 'garage' | 'winners';

export type AppState = {
    currentView: View;
    selectedCar: Car | undefined;
    garagePage: number;
    winnersPage: number;
    winnersSortField: WinnersSortField;
    winnersSortOrder: SortOrder;
    createCarDraft: CreateCarData;
    updateCarDraft: CreateCarData | undefined;
};
export type WinnersSortField = 'wins' | 'time';

export type SortOrder = 'asc' | 'desc';

