import type { AppState, View } from './types/app';


export const appState: AppState = {
 currentView: 'garage',
};

export function setCurrentView(view: View): void {
    appState.currentView = view;
}