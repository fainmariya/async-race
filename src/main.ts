import './style.css';
import { createGarageView } from './garage';
import { createCar, getCars, deleteCar, updateCar } from './api/garage';
import type { CreateCarData } from './types/car';
import {  appState, setCurrentView, setSelectedCar, setGaragePage } from './app-state';
import type { Car } from './types/car';
import { GARAGE_PAGE_SIZE, GENERATED_CARS_COUNT, MILLISECONDS_PER_SECOND, INITIAL_WIN_COUNT, WIN_INCREMENT } from './constants';
import { getRandomCarData } from './utils/random-car';
import { startEngine, driveEngine, stopEngine } from './api/engine';
import { animateCar, getAnimationDuration, getDistanceToFinish } from './utils/animation';
import type { RaceCar, RaceResult } from './types/race';
import type { Winner} from './types/winner';
import { getWinner, updateWinner } from './api/winners';
import { createWinner } from './api/winners';


const cancelAnimations = new Map<number, () => void>();
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
  appState.selectedCar,
  {
    onCreate:handleCreateCar,
    onSelect:handleSelectCar,
    onUpdate: handleUpdateCar,
    onDelete: handleDeleteCar,
    onPageChange: handlePageChange,
    onGenerate: handleGenerateCars,
    onStart: handleStartCar,
    onStop: handleStopCar,
    onRace: handleRace,
    onReset: handleReset,
  }
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
    appState.selectedCar, 
    {
      onCreate:handleCreateCar,
      onSelect:handleSelectCar,
      onUpdate: handleUpdateCar,
      onDelete: handleDeleteCar,
      onPageChange: handlePageChange,
      onGenerate: handleGenerateCars,
      onStart: handleStartCar,
      onStop: handleStopCar,
      onRace: handleRace,
      onReset: handleReset,
    }
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
    appState.selectedCar,
    {
      onCreate:handleCreateCar,
      onSelect:handleSelectCar,
      onUpdate: handleUpdateCar,
      onDelete: handleDeleteCar,
      onPageChange: handlePageChange,
      onGenerate: handleGenerateCars,
      onStart: handleStartCar,
      onStop: handleStopCar,
      onRace: handleRace,
      onReset: handleReset,
    }
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
    appState.selectedCar,
    {
      onCreate:handleCreateCar,
      onSelect:handleSelectCar,
      onUpdate: handleUpdateCar,
      onDelete: handleDeleteCar,
      onPageChange: handlePageChange,
      onGenerate: handleGenerateCars,
      onStart: handleStartCar,
      onStop: handleStopCar,
      onRace: handleRace,
      onReset: handleReset,
    }
  );
  viewContainer.replaceChildren(garageView);
}
async function handleStartCar(
  id: number,
  carElement: SVGSVGElement,
  finishElement: HTMLElement,
): Promise<number | undefined> { 
  
  const engineData = await startEngine(id);
  const duration = getAnimationDuration(
    engineData.distance,
    engineData.velocity,
  );

  const distanceToFinish = getDistanceToFinish(
    carElement,
    finishElement,
  );

  const {cancel, finished} = animateCar(
    carElement,
    distanceToFinish,
    duration,
  );
  cancelAnimations.set(id, cancel);
  const driveResult = await driveEngine(id);
  if(driveResult.success === false) {
    cancel();
    const isFinished = await finished;

    if (!isFinished) {
      return undefined;
}
    cancelAnimations.delete(id)
    return undefined
  }

  return duration / MILLISECONDS_PER_SECOND
  
}
async function handleStopCar(
  id: number,
  carElement: SVGSVGElement,
): Promise<void> {
  await stopEngine(id);
  const cancelAnimation = cancelAnimations.get(id);

if (cancelAnimation !== undefined) {
  cancelAnimation();
  cancelAnimations.delete(id);
}

carElement.style.transform = 'translateX(0px)';
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
    appState.selectedCar,
    {
      onCreate:handleCreateCar,
      onSelect:handleSelectCar,
      onUpdate: handleUpdateCar,
      onDelete: handleDeleteCar,
      onPageChange: handlePageChange,
      onGenerate: handleGenerateCars,
      onStart: handleStartCar,
      onStop: handleStopCar,
      onRace: handleRace,
      onReset: handleReset,
    }
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
    appState.selectedCar,
    {
      onCreate:handleCreateCar,
      onSelect:handleSelectCar,
      onUpdate: handleUpdateCar,
      onDelete: handleDeleteCar,
      onPageChange: handlePageChange,
      onGenerate: handleGenerateCars,
      onStart: handleStartCar,
      onStop: handleStopCar,
      onRace: handleRace,
      onReset: handleReset,
    }
  );
  viewContainer.replaceChildren(garageView);
}
async function handleRace(
  raceCars: RaceCar[],
): Promise<RaceResult> {
    const racePromises = raceCars.map((raceCar) => {
    raceCar.startButton.disabled = true;
    raceCar.stopButton.disabled = false;

    return runRaceCar(raceCar);
});
    const winner = await Promise.any(racePromises);
    await saveRaceWinner(winner);
    return winner;
}

async function handleReset(
  raceCars: RaceCar[],
): Promise<void> {
    const resetPromises = raceCars.map((raceCar) => 
    handleStopCar(
      raceCar.id,
      raceCar.carElement,
    ),
);
  await Promise.all(resetPromises);

  for (const raceCar of raceCars) {
    raceCar.startButton.disabled = false;
    raceCar.stopButton.disabled = true;
  }
}
async function runRaceCar(
  raceCar: RaceCar,
): Promise<RaceResult> {
  const time = await handleStartCar(
    raceCar.id,
    raceCar.carElement,
    raceCar.finishElement,
  );
  if (time === undefined) {
    throw new Error('Time undefined');
  }

  return { 
    id: raceCar.id,
    name: raceCar.name,
    time,
  };
}
async function saveRaceWinner(
  raceResult: RaceResult,
): Promise<Winner> {
 
  const result = await getWinner(raceResult.id);
 
  if (result === undefined) {
     
      const newWinner: Winner = {
        id: raceResult.id,
        wins: INITIAL_WIN_COUNT,
        time: raceResult.time,
        
      };
    
      return createWinner(newWinner);
  }
    
  const updatedWinner: Winner = {
    id: result.id,
    wins: result.wins + WIN_INCREMENT,
    time: Math.min(
      result.time,
      raceResult.time,
    )
  };
  return updateWinner(
      updatedWinner.id,
      updatedWinner,
  );
    
}