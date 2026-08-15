import './style.css';
import { setCurrentView } from './app-state';
import { createGarageView } from './garage';

const appElement = document.querySelector<HTMLDivElement>('#app');
if (!appElement) {
  throw new Error('Application root element not found.');
}
const title = document.createElement('h1');
title.textContent = 'ASYNC RACE';
title.className = 'app-title';

appElement.append(title);

const buttonGarage = document.createElement('button');
buttonGarage.className = 'nav-button';
buttonGarage.textContent = 'Garage';

const buttonWinners = document.createElement('button');
buttonWinners.className = 'nav-button';
buttonWinners.textContent = 'Winners';

appElement.append(buttonGarage, buttonWinners);
buttonWinners.addEventListener('click', () => {
  setCurrentView('winners');
});
buttonGarage.addEventListener('click', () => {
  setCurrentView('garage');
});
const viewContainer = document.createElement('main');
viewContainer.className = 'view-container';
appElement.append(viewContainer);
viewContainer.append(createGarageView());