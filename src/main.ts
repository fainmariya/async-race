import './style.css';
import { createGarageView } from './garage';
import { createCar, getCars, deleteCar, updateCar } from './api/garage';
import type { CreateCarData } from './types/car';
import {  appState, setCurrentView, setSelectedCar } from './app-state';
import type { Car } from './types/car';


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

const listOfCars = await getCars();
viewContainer.append(createGarageView(
  listOfCars,
  handleCreateCar,
  handleSelectCar,
  appState.selectedCar,
  handleUpdateCar,
  handleDeleteCar
));

async function handleCreateCar(
  data: CreateCarData,
): Promise<void> {
  await createCar(data);
  const cars = await getCars();
  const garageView = createGarageView(cars, handleCreateCar, handleSelectCar, appState.selectedCar, handleUpdateCar, handleDeleteCar,);
  viewContainer.replaceChildren(garageView);
}
function handleSelectCar(car: Car): void {
  setSelectedCar(car)
}
async function handleUpdateCar(
  id: number,
  data: CreateCarData,
): Promise<void> {
  const updatedCar = await updateCar(id, data);
  setSelectedCar(updatedCar);
  setSelectedCar(undefined);
  const cars = await getCars();
  const garageView = createGarageView(
    cars,
    handleCreateCar,
    handleSelectCar,
    appState.selectedCar,
    handleUpdateCar,
    handleDeleteCar,

  );
  viewContainer.replaceChildren(garageView);
}
async function handleDeleteCar(
  id: number,
): Promise<void> {
  await deleteCar(id);
  const cars = await getCars();
  if (appState.selectedCar !== undefined 
    && appState.selectedCar.id === id) {
      setSelectedCar(undefined);
    }
  const garageView = createGarageView(
    cars,
    handleCreateCar,
    handleSelectCar,
    appState.selectedCar,
    handleUpdateCar,
    handleDeleteCar
  );
  viewContainer.replaceChildren(garageView);
}