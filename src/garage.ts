import type { Car, CreateCarData } from './types/car';

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
  function createCarItem(
    car: Car,
    onSelect: (car: Car) => void,
    onDelete: (id: number) => Promise<void>,
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
      await onDelete(car.id)
    })

    const buttonSelectCar = document.createElement('button');
    buttonSelectCar.className = 'garage-car__select';
    buttonSelectCar.type = 'button';
    buttonSelectCar.textContent = 'SELECT';
    
    buttonSelectCar.addEventListener('click', () => {
        onSelect(car);
    });
    garageCar.append(garageCarDelete, buttonSelectCar, garageCarTitle);
    return garageCar;
}

function renderCars(
    cars: Car[],
    container: HTMLElement,
    onSelect: (car: Car) => void,
    onDelete: (id: number) => Promise<void>,
  ): void {
    for (const car of cars) {
        const carElement = createCarItem(car, onSelect, onDelete);
        container.append(carElement);
    }
  }
export function createGarageView(
    cars: Car[], 
    onCreate: (data: CreateCarData) => Promise<void>,
    onSelect: (car: Car) => void,
    selectedCar: Car | undefined,
    onUpdate: (
        id: number,
        data: CreateCarData,
    ) => Promise<void>,
    onDelete: (id: number) => Promise<void>,
): HTMLElement {
    const element = document.createElement('section');
    element.className = 'garage';
    const garageControls = document.createElement('div');
    garageControls.className = 'garage__controls';
    const count = cars.length;
    const garageHeader = createGarageHeader(count);
    const createPanel = createCreatePanel(onCreate);
    let updatePanel = createUpdatePanel(selectedCar, onUpdate);
    const handleSelectInView = (car: Car): void => {
        onSelect(car);
      
        const newUpdatePanel = createUpdatePanel(car, onUpdate);
        updatePanel.replaceWith(newUpdatePanel);
        updatePanel = newUpdatePanel;
      };
    garageControls.append(createPanel, updatePanel);
    
    const garageList = document.createElement('section');
    garageList.className = 'garage__list';
    
    renderCars(cars, garageList, handleSelectInView, onDelete);

    element.append(garageHeader, garageControls, garageList);
    return element;
}
