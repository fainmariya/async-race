import type { Car } from './car';

export type View = 'garage' | 'winners';

export type AppState = {
    currentView: View;
    selectedCar: Car | undefined;
    garagePage: number;
};

