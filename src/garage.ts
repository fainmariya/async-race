function createGarageHeader(): HTMLElement {
    const garageHeader = document.createElement('header');
    garageHeader.className = 'garage__header';
    const garageTitle = document.createElement('h2');
    garageTitle.className = 'garage__title';
    garageTitle.textContent = 'GARAGE';
    const garageCount = document.createElement('span');
    garageCount.className = 'garage__count';
    garageCount.textContent = '0 CARS';
    garageHeader.append(garageTitle, garageCount);
    
    return garageHeader;
  }
  function createCreatePanel(): HTMLElement {
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

    const garageActionRow = document.createElement('div');
    garageActionRow.className = 'garage__action-row';
    garageActionRow.append(garageColor, garageActionButton);

    createPanel.append(garagePanelTitle, garagePanelInput, garageActionRow);
    return createPanel;
  }
function createUpdatePanel(): HTMLElement {
    const updatePanel = document.createElement('section');
    updatePanel.className = 'garage__panel';

    const updatePanelTitle = document.createElement('h3');
    updatePanelTitle.className = 'garage__panel-title';
    updatePanelTitle.textContent = 'UPDATE CAR';

    const garageUpdateInput = document.createElement('input');
    garageUpdateInput.className = 'garage__input';
    garageUpdateInput.type = 'text';
    garageUpdateInput.placeholder = 'Car name';
    garageUpdateInput.disabled = true;

    const garageUpdateColor = document.createElement('input');
    garageUpdateColor.className = 'garage__color';
    garageUpdateColor.type = 'color';
    garageUpdateColor.disabled = true;

    const garageUpdateActionButton = document.createElement('button');
    garageUpdateActionButton.className = 'garage__action-button';
    garageUpdateActionButton.textContent = 'UPDATE';
    garageUpdateActionButton.disabled = true;

    const garageUpdateActionRow = document.createElement('div');
    garageUpdateActionRow.className = 'garage__action-row';
    garageUpdateActionRow.append(garageUpdateColor, garageUpdateActionButton);
    updatePanel.append(updatePanelTitle, garageUpdateInput, garageUpdateActionRow);
    return updatePanel;
}

export function createGarageView(): HTMLElement {
    const element = document.createElement('section');
    element.className = 'garage';
    const garageControls = document.createElement('div');
    garageControls.className = 'garage__controls';
    
    const garageHeader = createGarageHeader();
    const createPanel = createCreatePanel();
    const updatePanel = createUpdatePanel();
    garageControls.append(createPanel, updatePanel);
    
    element.append(garageHeader, garageControls);
    return element;
}

