import type { Car, CreateCarData } from './types/car';
import type { RaceCar, RaceResult } from './types/race';
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
    RACE_BUTTON_TEXT,
    RESET_BUTTON_TEXT,
    SELECTCAR,
    DELETECAR,
    PREVIOUSBUTTON,
    NEXTBUTTON,
    CAR_WINNER,
    BUTTON_CLOSE,

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
    type CarItemElements = {
        element: HTMLElement;
        raceCar: RaceCar;
      };
    type RenderedCars = {
        element: HTMLElement;
        raceCars: RaceCar[];
      };
    type EngineControlElements = {
        element: HTMLElement;
        startButton: HTMLButtonElement;
        stopButton: HTMLButtonElement;
      };
    type CarItemCallbacks = {
        onSelect: (car: Car) => void;
        onDelete: (id: number) => Promise<void>;
        onStart: (
          id: number,
          carElement: SVGSVGElement,
          finishElement: HTMLElement,
        ) => Promise<number | undefined>;
        onStop: (
          id: number,
          carElement: SVGSVGElement,
        ) => Promise<void>;
      };
      type GarageViewCallbacks = {
        onCreate: (data: CreateCarData) => Promise<void>;
        onSelect: (car: Car) => void;
        onUpdate: (
          id: number,
          data: CreateCarData,
        ) => Promise<void>;
        onDelete: (id: number) => Promise<void>;
        onPageChange: (page: number) => Promise<void>;
        onGenerate: () => Promise<void>;
        onStart: (
          id: number,
          carElement: SVGSVGElement,
          finishElement: HTMLElement,
        ) => Promise<number | undefined>;
        onStop: (
          id: number,
          carElement: SVGSVGElement,
        ) => Promise<void>;
        onRace: (raceCars: RaceCar[]) => Promise<RaceResult>;
        onReset: (raceCars: RaceCar[]) => Promise<void>;
      };
      type GarageControlsElements = {
        element: HTMLElement;
        onSelect: (car: Car) => void;
      };
      type WinnerDialogElements = {
        dialog: HTMLDialogElement;
        nameElement: HTMLElement;
        timeElement: HTMLElement;
        buttonClose: HTMLButtonElement;
      };
function createWinnerDialog(): WinnerDialogElements {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal__dialog';
    
    const title = document.createElement('h2');
    title.className = 'modal__title';
    title.textContent = CAR_WINNER;
    
    const nameElement = document.createElement('p');
    nameElement.className = 'modal__name-car';

    const timeElement = document.createElement('p');
    timeElement.className = 'modal__time-car';

    const buttonClose = document.createElement('button');
    buttonClose.className = 'modal__button-close';
    buttonClose.textContent = BUTTON_CLOSE;
    dialog.append(title, nameElement, timeElement, buttonClose);

    buttonClose.addEventListener('click', () => {
        dialog.close();
      });
      return {
        dialog,
        nameElement,
        timeElement,
        buttonClose,
      }
}

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
    callbacks: CarItemCallbacks,
  ): CarItemElements {
    const garageCar = document.createElement('article');
    garageCar.className = 'garage-car';

    const deleteButton = createDeleteButton(car.id, callbacks.onDelete);
    const selectButton = createSelectButton(car, callbacks.onSelect);
    const { track, carSvg, finish } = createCarTrack(car);
    const {
        element: engineControls,
        startButton,
        stopButton,
      } = createEngineControls(
        () => callbacks.onStart(car.id, carSvg, finish),
        () => callbacks.onStop(car.id, carSvg),
      );
    const raceCar = createRaceCar(
        car,
        carSvg,
        finish,
        startButton,
        stopButton,
      );
    const carInfo = createCarInfo(
        car,
        deleteButton,
        selectButton,
        engineControls,
      );
    garageCar.append(
        carInfo,
        track,
    );
    return {
        element: garageCar,
        raceCar,
    }  
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
      ) => Promise<number | undefined>,
    onStop: (
        id: number,
        carElement: SVGSVGElement,
      ) => Promise<void>,
  ): RenderedCars {
    const raceCars: RaceCar[] = [];
    for (const car of cars) {
        const { element, raceCar  } = createCarItem(car, {
            onSelect,
            onDelete,
            onStart,
            onStop,
        });
        container.append(element);
        raceCars.push(raceCar);
    }
    return {
        element: container,
        raceCars,
    };
  };
export function createGarageView(
    cars: Car[], 
    total: number,
    page: number,
    selectedCar: Car | undefined,
    callbacks: GarageViewCallbacks,
): HTMLElement {
    const element = document.createElement('section');
    element.className = 'garage';

    const garageHeader = createGarageHeader(total);
    
    const totalPages = Math.ceil(total / GARAGE_PAGE_SIZE);

    const garagePagination = createGaragePagination(
        page,
        totalPages,
        callbacks.onPageChange,
    );
    const {
        element: garageControls,
        onSelect: handleSelectInView,
      } = createGarageControls(selectedCar, callbacks);
    const { 
        element: garageList, 
        raceCars,
     } = createGarageList(cars, handleSelectInView, callbacks,);
    
    const raceControls = createRaceControls(
        () => callbacks.onRace(raceCars),
        () => callbacks.onReset(raceCars),
      );
    const generateButton = createGenerateButton(callbacks.onGenerate);
    element.append(
        garageHeader,
        garageControls,
        generateButton,
        raceControls,
        garageList,
        garagePagination,
    );
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
    garagePreviousButton.textContent = PREVIOUSBUTTON;
    garagePreviousButton.addEventListener('click', async () => {
      await onPageChange(page - 1)
    })

    const garageNextButton = document.createElement('button');
    garageNextButton.className = 'garage__pagination-button';
    garageNextButton.type = 'button';
    garageNextButton.textContent = NEXTBUTTON;
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
    onStart: () => Promise<number | undefined>,
    onStop: () => Promise<void>,
  ): EngineControlElements {
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
  
    return {
      element: controls,
      startButton,
      stopButton,
    };
  }
  function createRaceControls(
    onRace: () => Promise<RaceResult>,
    onReset: () => Promise<void>,
  ): HTMLElement{
    const controls = document.createElement('div');
    controls.className = 'garage-car__race-reset';

    const winnerMessage = document.createElement('p');
    winnerMessage.className = 'garage__winner-message';    

    const {
        dialog,
        nameElement,
        timeElement,
      } = createWinnerDialog();
    
    const raceButton = document.createElement('button');
    raceButton.className = 'garage__race';
    raceButton.type = 'button';
    raceButton.textContent = RACE_BUTTON_TEXT;
    raceButton.addEventListener('click', async () => {
       raceButton.disabled = true;
       
       const winner = await onRace();

       resetButton.disabled = false;
       nameElement.textContent = winner.name;
       timeElement.textContent = `${winner.time.toFixed(2)}s`;

       dialog.showModal();
       
    });
    
    const resetButton = document.createElement('button');
    resetButton.className = 'garage__reset';
    resetButton.type = 'button';
    resetButton.textContent = RESET_BUTTON_TEXT;
    
    resetButton.addEventListener('click', async () => {
       raceButton.disabled = false;
       resetButton.disabled = true;
       await onReset();
    });
    controls.append(raceButton, resetButton, dialog);
    return controls;
  }
  function createDeleteButton(
    carId: number,
    onDelete: (id: number) => Promise<void>,
  ): HTMLButtonElement {
    const garageCarDelete = document.createElement('button');
    garageCarDelete.className = 'garage-car__delete';
    garageCarDelete.type = 'button';
    garageCarDelete.textContent = DELETECAR;

    garageCarDelete.addEventListener('click', async () => {
      await onDelete(carId);
    });
    return garageCarDelete;
  }
  function createSelectButton(
    car: Car,
    onSelect: (car: Car) => void,
  ): HTMLButtonElement {
    const buttonSelectCar = document.createElement('button');
    buttonSelectCar.className = 'garage-car__select';
    buttonSelectCar.type = 'button';
    buttonSelectCar.textContent = SELECTCAR;
    
    buttonSelectCar.addEventListener('click', () => {
        onSelect(car);
    });
    return buttonSelectCar;
  }
function createRaceCar(
    car: Car,
    carElement: SVGSVGElement,
    finishElement: HTMLElement,
    startButton: HTMLButtonElement,
    stopButton: HTMLButtonElement,
  ): RaceCar {
    return {
        id: car.id,
        name: car.name,
        carElement,
        finishElement,
        startButton,
        stopButton,
    }
  }
  function createCarInfo(
    car: Car,
    deleteButton: HTMLButtonElement,
    selectButton: HTMLButtonElement,
    engineControls: HTMLElement,
  ): HTMLElement {
    const garageCarTitle = document.createElement('h3');
    garageCarTitle.className = 'garage-car__name';
    garageCarTitle.textContent = car.name;

    const carInfo = document.createElement('div');
    carInfo.className = 'garage-car__info';

    carInfo.append(
      deleteButton,
      selectButton,
      garageCarTitle,
      engineControls,
 );

  return carInfo;
  }
  function createGarageList(
    cars: Car[],
    onSelect: (car: Car) => void,
    callbacks: CarItemCallbacks,
  ): RenderedCars {
    const garageList = document.createElement('section');
    garageList.className = 'garage__list';
  
    return renderCars(
      cars,
      garageList,
      onSelect,
      callbacks.onDelete,
      callbacks.onStart,
      callbacks.onStop,
    );
  }
  function createGarageControls(
    selectedCar: Car | undefined,
    callbacks: GarageViewCallbacks,
  ): GarageControlsElements {
    const garageControls = document.createElement('div');
    garageControls.className = 'garage__controls';

    const createPanel = createCreatePanel(callbacks.onCreate);
    let updatePanel = createUpdatePanel(selectedCar, callbacks.onUpdate);

    const handleSelectInView = (car: Car): void => {
        callbacks.onSelect(car);
        const newUpdatePanel = createUpdatePanel(car, callbacks.onUpdate);
        updatePanel.replaceWith(newUpdatePanel);
        updatePanel = newUpdatePanel;
      };

    garageControls.append(
        createPanel,
        updatePanel
    );
    return {
      element: garageControls,
      onSelect: handleSelectInView,
    }
  }