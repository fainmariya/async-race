import './style.css';
import { createGarageView } from './garage';
import { createCar, getCars, deleteCar, updateCar } from './api/garage';
import type { CreateCarData } from './types/car';
import {  appState, setCurrentView, setSelectedCar, setGaragePage } from './app-state';
import type { Car } from './types/car';
import { GARAGE_PAGE_SIZE, GENERATED_CARS_COUNT } from './constants';
import { getRandomCarData } from './utils/random-car';

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

const pageData = await getCars(appState.garagePage, 
  GARAGE_PAGE_SIZE);

viewContainer.append(createGarageView(
  pageData.cars,
  pageData.total,
  appState.garagePage,
  handleCreateCar,
  handleSelectCar,
  appState.selectedCar,
  handleUpdateCar,
  handleDeleteCar,
  handlePageChange,
  handleGenerateCars,
));

async function handleCreateCar(
  data: CreateCarData,
): Promise<void> {
  await createCar(data);
  const pageData = await getCars(
    appState.garagePage,
    GARAGE_PAGE_SIZE,
  );
  
  const garageView = createGarageView(
    pageData.cars, 
    pageData.total, 
    appState.garagePage,
    handleCreateCar, 
    handleSelectCar, 
    appState.selectedCar, 
    handleUpdateCar, 
    handleDeleteCar,
    handlePageChange,
    handleGenerateCars,
  );
  viewContainer.replaceChildren(garageView);
}
function handleSelectCar(car: Car): void {
  setSelectedCar(car)
}
async function handleUpdateCar(
  id: number,
  data: CreateCarData,
): Promise<void> {
  await updateCar(id, data);
  setSelectedCar(undefined);
  const pageData = await getCars(
    appState.garagePage,
    GARAGE_PAGE_SIZE,
  );
  
  const garageView = createGarageView(
    pageData.cars, 
    pageData.total,
    appState.garagePage,
    handleCreateCar,
    handleSelectCar,
    appState.selectedCar,
    handleUpdateCar,
    handleDeleteCar,
    handlePageChange,
    handleGenerateCars,

  );
  viewContainer.replaceChildren(garageView);
}
async function handleDeleteCar(
  id: number,
): Promise<void> {
  await deleteCar(id);
  
  if (appState.selectedCar !== undefined 
    && appState.selectedCar.id === id) {
      setSelectedCar(undefined);
    }
    let pageData = await getCars(
      appState.garagePage,
      GARAGE_PAGE_SIZE,
    );
    if (pageData.cars.length === 0 &&
      appState.garagePage > 1){
       setGaragePage(appState.garagePage - 1);
       pageData = await getCars(appState.garagePage,
        GARAGE_PAGE_SIZE,
       )
      }
  const garageView = createGarageView(
    
    pageData.cars,
    pageData.total,
    appState.garagePage,
    handleCreateCar,
    handleSelectCar,
    appState.selectedCar,
    handleUpdateCar,
    handleDeleteCar,
    handlePageChange,
    handleGenerateCars,
  );
  viewContainer.replaceChildren(garageView);
}
async function handlePageChange(
  page: number,
): Promise<void> {

  setGaragePage(page);
  const pageData = await getCars(
    appState.garagePage,
    GARAGE_PAGE_SIZE,
  );
  const garageView = createGarageView(
    pageData.cars,
    pageData.total,
    appState.garagePage,
    handleCreateCar,
    handleSelectCar,
    appState.selectedCar,
    handleUpdateCar,
    handleDeleteCar,
    handlePageChange,
    handleGenerateCars,
  );
  viewContainer.replaceChildren(garageView);
}
async function handleGenerateCars(): Promise<void> {
  for (let index = 0; index < GENERATED_CARS_COUNT; index += 1){
    const randomCar  = getRandomCarData();
    await createCar(randomCar);
  }
  const pageData = await getCars(
    appState.garagePage,
    GARAGE_PAGE_SIZE,
  ); 
  const garageView = createGarageView(
    pageData.cars,
    pageData.total,
    appState.garagePage,
    handleCreateCar,
    handleSelectCar,
    appState.selectedCar,
    handleUpdateCar,
    handleDeleteCar,
    handlePageChange,
    handleGenerateCars,
  );
  viewContainer.replaceChildren(garageView);
 
}