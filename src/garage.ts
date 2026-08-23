import type { Car, CreateCarData } from './types/car';
import { 
    GARAGE_PAGE_SIZE, 
    GENERATE_CARS_BUTTON_TEXT, 
    SVG_NAMESPACE, 
    CAR_BODY_PATH,
    CAR_REAR_WHEEL_X,
    CAR_WHEEL_Y,
    CAR_WHEEL_RADIUS,
    CAR_FRONT_WHEEL_X,
    START_BUTTON_TEXT,
    STOP_BUTTON_TEXT,
} from './constants';



function createGarageHeader(count: number): HTMLElement {
    const garageHeader = document.createElement('header');
    garageHeader.className = 'garage__header';
    const garageTitle = document.createElement('h2');
    garageTitle.className = 'garage__title';
    garageTitle.textContent = 'GARAGE';
    const garageCount = document.createElement('span');
    garageCount.className = 'garage__count';
    garageCount.textContent = `${count} CARS`;
    garageHeader.append(garageTitle, garageCount);
    
    return garageHeader;
  }
  function createCreatePanel(
    onCreate: (data: CreateCarData) => Promise<void>,
  ): HTMLElement {
    const createPanel = document.createElement('section');
    createPanel.className = 'garage__panel';
    
    const garagePanelTitle = document.createElement('h3');
    garagePanelTitle.className = 'garage__panel-title';
    garagePanelTitle.textContent = 'CREATE CAR';

    const garagePanelInput = document.createElement('input');
    garagePanelInput.className = 'garage__input';
    garagePanelInput.type = 'text';
    garagePanelInput.placeholder = 'Car name';

    const garageColor = document.createElement('input');
    garageColor.className = 'garage__color';
    garageColor.type = 'color';

    const garageActionButton = document.createElement('button');
    garageActionButton.textContent = 'CREATE';
    garageActionButton.className = 'garage__action-button';

    garageActionButton.addEventListener('click', async () => {
      const name = garagePanelInput.value.trim();
      if (name === '') {
        return;
      }
      const color = garageColor.value;
      const carData: CreateCarData = {
        name,
        color,
      }
      garageActionButton.disabled = true;

      try {
        await onCreate(carData);
      } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('Unknown error');
          }
      } finally {
        garageActionButton.disabled = false;
      }
      
    });

    const garageActionRow = document.createElement('div');
    garageActionRow.className = 'garage__action-row';
    garageActionRow.append(garageColor, garageActionButton);

    createPanel.append(garagePanelTitle, garagePanelInput, garageActionRow);
    return createPanel;
  }
function createUpdatePanel(
    selectedCar: Car | undefined,
    onUpdate: (
        id: number,
        data: CreateCarData,
    ) => Promise<void>
): HTMLElement {
    const updatePanel = document.createElement('section');
    updatePanel.className = 'garage__panel';

    const updatePanelTitle = document.createElement('h3');
    updatePanelTitle.className = 'garage__panel-title';
    updatePanelTitle.textContent = 'UPDATE CAR';

    const garageUpdateInput = document.createElement('input');
    garageUpdateInput.className = 'garage__input';
    garageUpdateInput.type = 'text';
    garageUpdateInput.placeholder = 'Car name';
    
    const isDisabled = selectedCar === undefined;

    garageUpdateInput.disabled = isDisabled;
    

    const garageUpdateColor = document.createElement('input');
    garageUpdateColor.className = 'garage__color';
    garageUpdateColor.type = 'color';
    garageUpdateColor.disabled = isDisabled;
    

    const garageUpdateActionButton = document.createElement('button');
    garageUpdateActionButton.className = 'garage__action-button';
    garageUpdateActionButton.textContent = 'UPDATE';
    garageUpdateActionButton.type = 'button';
    garageUpdateActionButton.disabled = isDisabled;

    garageUpdateActionButton.addEventListener('click', async () => {
        if (selectedCar === undefined) {
          return;
        }
        const name = garageUpdateInput.value.trim();
        if (name === ''){
            return;
        }
        const color = garageUpdateColor.value;
        const carData: CreateCarData = {
            name,
            color,
          };
        await onUpdate(selectedCar.id, carData);
      });
   

    const garageUpdateActionRow = document.createElement('div');
    garageUpdateActionRow.className = 'garage__action-row';
    garageUpdateActionRow.append(garageUpdateColor, garageUpdateActionButton);
    updatePanel.append(updatePanelTitle, garageUpdateInput, garageUpdateActionRow);
    if (selectedCar) {
        garageUpdateInput.value = selectedCar.name;
        garageUpdateColor.value = selectedCar.color;
      }
    return updatePanel;
}
  function createCarSvg(color: string): SVGSVGElement {
    const elementCar = document.createElementNS(SVG_NAMESPACE, 'svg');
    elementCar.setAttribute('viewBox', '0 0 100 40');
    elementCar.classList.add('garage-car__svg');
    const carBody = document.createElementNS(SVG_NAMESPACE, 'path');
    carBody.setAttribute('d',CAR_BODY_PATH);
    carBody.setAttribute('fill', color);

    const leftWheel = document.createElementNS(SVG_NAMESPACE, 'circle');
    leftWheel.classList.add('garage-car__wheel');
    leftWheel.setAttribute('cx', CAR_REAR_WHEEL_X);
    leftWheel.setAttribute('cy', CAR_WHEEL_Y);
    leftWheel.setAttribute('r', CAR_WHEEL_RADIUS); 
    leftWheel.setAttribute('fill', color);
    
    const rightWheel = document.createElementNS(SVG_NAMESPACE, 'circle');
    rightWheel.classList.add('garage-car__wheel');
    rightWheel.setAttribute('cx', CAR_FRONT_WHEEL_X);
    rightWheel.setAttribute('cy', CAR_WHEEL_Y);
    rightWheel.setAttribute('r', CAR_WHEEL_RADIUS); 
    rightWheel.setAttribute('fill', color);
    
        
    elementCar.append(carBody, leftWheel, rightWheel);
    return elementCar;
    }
    type CarTrackElements = {
        track: HTMLElement;
        carSvg: SVGSVGElement;
        finish: HTMLElement;
      };
    function createCarTrack(car: Car): CarTrackElements {
    const track = document.createElement('div');
    track.className = 'garage-car__track';

    const finish = document.createElement('div');
    finish.className = 'garage-car__finish';
    const carSvg = createCarSvg(car.color);
    track.append(carSvg, finish);
        
    return {
        track,
        carSvg,
        finish
      };
    }
  function createCarItem(
    car: Car,
    onSelect: (car: Car) => void,
    onDelete: (id: number) => Promise<void>,
    onStart: (
        id: number,
        carElement: SVGSVGElement,
        finishElement: HTMLElement,
      ) => Promise<void>,
    onStop: (
        id: number,
        carElement: SVGSVGElement,
      ) => Promise<void>,
  ): HTMLElement {

    const garageCar = document.createElement('article');
    garageCar.className = 'garage-car';
    const garageCarTitle = document.createElement('h3');
    garageCarTitle.className = 'garage-car__name';
    garageCarTitle.textContent = car.name;

    const garageCarDelete = document.createElement('button');
    garageCarDelete.className = 'garage-car__delete';
    garageCarDelete.type = 'button';
    garageCarDelete.textContent = 'DELETE';

    garageCarDelete.addEventListener('click', async () => {
      await onDelete(car.id);
    });

    const buttonSelectCar = document.createElement('button');
    buttonSelectCar.className = 'garage-car__select';
    buttonSelectCar.type = 'button';
    buttonSelectCar.textContent = 'SELECT';
    
    buttonSelectCar.addEventListener('click', () => {
        onSelect(car);
    });
    const { track, carSvg, finish } = createCarTrack(car);
    const carInfo = document.createElement('div');
    carInfo.className = 'garage-car__info';
    const engineControls = createEngineControls(
        () => onStart(car.id, carSvg, finish),
        () => onStop(car.id, carSvg),
      );
    carInfo.append(
        garageCarDelete,
        buttonSelectCar,
        garageCarTitle,
        engineControls
    );
    garageCar.append(
        carInfo,
        track,
    );
    return garageCar;
    
}

function renderCars(
    cars: Car[],
    container: HTMLElement,
    onSelect: (car: Car) => void,
    onDelete: (id: number) => Promise<void>,
    onStart: (
        id: number,
        carElement: SVGSVGElement,
        finishElement: HTMLElement,
      ) => Promise<void>,
    onStop: (
        id: number,
        carElement: SVGSVGElement,
      ) => Promise<void>,
  ): void {
    for (const car of cars) {
        const carElement = createCarItem(car, onSelect, onDelete, onStart, onStop);
        container.append(carElement);
    }
  }
export function createGarageView(
    cars: Car[], 
    total: number,
    page: number,
    onCreate: (data: CreateCarData) => Promise<void>,
    onSelect: (car: Car) => void,
    selectedCar: Car | undefined,
    onUpdate: (
        id: number,
        data: CreateCarData,
    ) => Promise<void>,
    onDelete: (id: number) => Promise<void>,
    onPageChange: (page: number) => Promise<void>,
    onGenerate: () => Promise<void>,
    onStart: (
        id: number,
        carElement: SVGSVGElement,
        finishElement: HTMLElement,
      ) => Promise<void>,
    onStop: (
        id: number,
        carElement: SVGSVGElement,
      ) => Promise<void>,
): HTMLElement {
    const element = document.createElement('section');
    element.className = 'garage';
    const garageControls = document.createElement('div');
    garageControls.className = 'garage__controls';

    const garageHeader = createGarageHeader(total);
    
    const createPanel = createCreatePanel(onCreate);
    let updatePanel = createUpdatePanel(selectedCar, onUpdate);
    const handleSelectInView = (car: Car): void => {
        onSelect(car);
      
        const newUpdatePanel = createUpdatePanel(car, onUpdate);
        updatePanel.replaceWith(newUpdatePanel);
        updatePanel = newUpdatePanel;
      };
    garageControls.append(createPanel, updatePanel);
    const totalPages = Math.ceil(total / GARAGE_PAGE_SIZE);
    const garagePagination = createGaragePagination(page, totalPages, onPageChange);
    
    const garageList = document.createElement('section');
    garageList.className = 'garage__list';
    
    
    renderCars(cars, garageList, handleSelectInView, onDelete, onStart, onStop);
    const generateButton = createGenerateButton(onGenerate);
    element.append(garageHeader, garageControls, generateButton, garageList, garagePagination);
    return element;
}
function createGaragePagination(
    page: number,
    totalPages: number,
    onPageChange: (page: number) => Promise<void>,
): HTMLElement {

    const garagePagination = document.createElement('div');
    garagePagination.className = 'garage__pagination';
    const garagePage = document.createElement('span');
    garagePage.className = 'garage__page';
    garagePage.textContent = `PAGE${page}`;
    garagePagination.append(garagePage);
    
    const garagePreviousButton = document.createElement('button');
    garagePreviousButton.className = 'garage__pagination-button';
    garagePreviousButton.type = 'button';
    garagePreviousButton.textContent = 'PREV';
    garagePreviousButton.addEventListener('click', async () => {
      await onPageChange(page - 1)
    })

    const garageNextButton = document.createElement('button');
    garageNextButton.className = 'garage__pagination-button';
    garageNextButton.type = 'button';
    garageNextButton.textContent = 'NEXT';
    garageNextButton.addEventListener('click', async () => {
      await onPageChange(page + 1)
    })
    garagePreviousButton.disabled = page <= 1;
    garageNextButton.disabled = page >= totalPages;

    garagePagination.append(garagePreviousButton, garagePage, garageNextButton);
    

    return garagePagination;
}
function createGenerateButton(
    onGenerate: () => Promise<void>
): HTMLButtonElement {
    const generateButton = document.createElement('button');
    generateButton.className = 'garage__generate-button';
    generateButton.type = 'button';
    generateButton.textContent = GENERATE_CARS_BUTTON_TEXT;
    
    generateButton.addEventListener('click', async () => {
        await onGenerate()
      });
    return generateButton;
  }
  function createEngineControls(
    onStart: () => Promise<void>,
    onStop: () => Promise<void>,
  ): HTMLElement {
    const controls = document.createElement('div');
    controls.className = 'garage-car__engine-controls';
    
    const startButton = document.createElement('button');
    startButton.className = 'garage-car__start';
    startButton.type = 'button';

    const stopButton = document.createElement('button');
    stopButton.className = 'garage-car__stop';
    stopButton.type = 'button';
    stopButton.disabled = true;
   
    startButton.textContent = START_BUTTON_TEXT;
    stopButton.textContent = STOP_BUTTON_TEXT; 
    startButton.addEventListener('click', async () => {
        
        startButton.disabled = true;
        stopButton.disabled = false;

        await onStart();
      });   
    stopButton.addEventListener('click', async () => {
        await onStop();

        startButton.disabled = false;
        stopButton.disabled = true;
    })
    controls.append(startButton, stopButton);
  
    return controls;
  }