import { createCarSvg } from './components/car-svg';
import type { WinnerTableItem } from './types/winner';
import { WINNERS_PAGE_SIZE } from './constants';
import type { SortOrder, WinnersSortField } from './types/app';


const WINNERS_TITLE = 'Winners';
const WINNERS_COUNT_LABEL = 'Winners';
const EMPTY_WINNERS_MESSAGE = 'No winners yet';
const NUMBER_HEADER = '№';
const CAR_HEADER = 'Car';
const NAME_HEADER = 'Name';
const WINS_HEADER = 'Wins';
const BEST_TIME_HEADER = 'Best time';
const ROW_NUMBER_OFFSET = 1;
const SORT_INDICATOR = '↕';
const SORT_ASC_INDICATOR = '↑';
const SORT_DESC_INDICATOR = '↓';


export function createWinnersView(
    items: WinnerTableItem[],
    total: number,
    page: number,
    onPageChange: (page: number) => Promise<void>,
    onSort: (field: WinnersSortField) => Promise<void>,
    sortField: WinnersSortField,
    sortOrder: SortOrder,
  ): HTMLElement {
    const section = document.createElement('section');
    section.classList.add('winners');
  
    const title = document.createElement('h2');
    title.classList.add('winners__title');
    title.textContent = WINNERS_TITLE;
  
    const count = document.createElement('p');
    count.classList.add('winners__count');
    count.textContent = `${WINNERS_COUNT_LABEL}: ${total}`;
  
    const pageElement = document.createElement('p');
    pageElement.classList.add('winners__page');
    pageElement.textContent = `Page: ${page}`;
  
    const info = document.createElement('div');
    info.classList.add('winners__info');
    info.append(count, pageElement);
  
    const table = createWinnersTable(
        items,
        onSort,
        sortField,
        sortOrder,
    );
  
    const pagination = createWinnersPagination(
      page,
      total,
      onPageChange,
    );
  
    section.append(title, info, table, pagination);
  
    if (items.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = EMPTY_WINNERS_MESSAGE;
      section.append(emptyMessage);
    }
  
    return section;
  }
  function createWinnersTableHeader(
    onSort: (field: WinnersSortField) => Promise<void>,
    sortField: WinnersSortField,
    sortOrder: SortOrder,
  ): HTMLTableSectionElement {
    const tableHead = document.createElement('thead');
    const row = document.createElement('tr');
  
    const numberHeader = document.createElement('th');
    numberHeader.textContent = NUMBER_HEADER;
  
    const carHeader = document.createElement('th');
    carHeader.textContent = CAR_HEADER;
  
    const nameHeader = document.createElement('th');
    nameHeader.textContent = NAME_HEADER;
  
    const winsHeader = document.createElement('th');
    winsHeader.classList.add('winners__sortable');
    winsHeader.textContent = `${WINS_HEADER} ${getSortIndicator(
      'wins',
      sortField,
      sortOrder,
    )}`;
  
    const bestTimeHeader = document.createElement('th');
    bestTimeHeader.classList.add('winners__sortable');
    bestTimeHeader.textContent = `${BEST_TIME_HEADER} ${getSortIndicator(
      'time',
      sortField,
      sortOrder,
    )}`;
  
    winsHeader.addEventListener('click', async () => {
      await onSort('wins');
    });
  
    bestTimeHeader.addEventListener('click', async () => {
      await onSort('time');
    });
  
    row.append(
      numberHeader,
      carHeader,
      nameHeader,
      winsHeader,
      bestTimeHeader,
    );
  
    tableHead.append(row);
  
    return tableHead;
  }
function createWinnersTable(
    items: WinnerTableItem[],
    onSort: (field: WinnersSortField) => Promise<void>,
    sortField: WinnersSortField,
    sortOrder: SortOrder,
): HTMLTableElement {
    const table = document.createElement('table');
    table.classList.add('winners__table');
      
    const tableHead = createWinnersTableHeader(
        onSort,
        sortField,
        sortOrder,
      );
    const tableBody = createWinnersTableBody(items);

    table.append(tableHead, tableBody);
      
    return table;
      }
function createWinnerRow(
    item: WinnerTableItem,
    position: number,
      ): HTMLTableRowElement {
        const row = document.createElement('tr');
      
        const positionCell = document.createElement('td');
        positionCell.textContent = String(position);
      
        const carCell = document.createElement('td');
        const carSvg = createCarSvg(item.color);
        carCell.append(carSvg);
      
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
      
        const winsCell = document.createElement('td');
        winsCell.textContent = String(item.wins);
      
        const timeCell = document.createElement('td');
        timeCell.textContent = item.time.toFixed(2);
      
        row.append(
          positionCell,
          carCell,
          nameCell,
          winsCell,
          timeCell,
        );
      
        return row;
      }
function createWinnersTableBody(
    items: WinnerTableItem[],
      ): HTMLTableSectionElement {
        const tableBody = document.createElement('tbody');
      
        for (const [index, item] of items.entries()) {
          const row = createWinnerRow(
            item,
            index + ROW_NUMBER_OFFSET,
          );
      
          tableBody.append(row);
        }
      
        return tableBody;
      }
function createWinnersPagination(
  page: number,
  total: number,
    onPageChange: (page: number) => Promise<void>,
    ): HTMLElement {
    const pagination = document.createElement('div');
    pagination.classList.add('winners__pagination');
      
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Prev';
    previousButton.disabled = page <= 1;
      
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
      
    const totalPages = Math.ceil(total / WINNERS_PAGE_SIZE);
      
    nextButton.disabled = page >= totalPages;
      
    previousButton.addEventListener('click', async () => {
      await onPageChange(page - 1);
    });
      
    nextButton.addEventListener('click', async () => {
      await onPageChange(page + 1);
        });
    previousButton.classList.add('winners__pagination-button');
    nextButton.classList.add('winners__pagination-button');
      
    pagination.append(previousButton, nextButton);
      
    return pagination;
    }
function getSortIndicator(
        field: WinnersSortField,
        sortField: WinnersSortField,
        sortOrder: SortOrder,
      ): string {
        if (field !== sortField) {
          return SORT_INDICATOR;
        }
      
        if (sortOrder === 'asc') {
          return SORT_ASC_INDICATOR;
        }
      
        return SORT_DESC_INDICATOR;
      }