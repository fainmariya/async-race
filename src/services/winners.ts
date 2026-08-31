import type { Winner, WinnerTableItem, WinnersTablePageData } from "../types/winner";
import { getCar } from "../api/garage";
import { getWinners } from "../api/winners";
import type { 
  SortOrder,
  WinnersSortField,
} from '../types/app'


export async function createWinnerTableItem(
    winner: Winner,
  ): Promise<WinnerTableItem | undefined> {

    const car = await getCar(winner.id);

    if (car === undefined) {
        return undefined;
    }
    return {
      id: car.id,
      name: car.name,
      color: car.color,
      wins: winner.wins,
      time: winner.time,
    };
  }
export async function createWinnerTableItems(
    winners: Winner[],
  ): Promise<WinnerTableItem[]> {
    const promises = winners.map((winner)=>createWinnerTableItem(winner));

    const items = await Promise.all(promises);
    const filterResult = items.filter((item) => item !== undefined);
    return filterResult;
  }
export async function getWinnersTablePage(
    page: number,
    limit: number,
    sortField: WinnersSortField,
    sortOrder: SortOrder,
  ): Promise<WinnersTablePageData> {
    const pageData = await getWinners(
      page,
      limit,
      sortField,
      sortOrder,
  );
    const items = await createWinnerTableItems(pageData.winners);
    return {
      items,
      total: pageData.total,
  };
}
