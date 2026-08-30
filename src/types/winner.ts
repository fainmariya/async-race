export type Winner = {
    id: number;
    wins: number;
    time: number;
  };
export type WinnersPageData = {
    winners: Winner[];
    total: number;
  };
export type WinnerTableItem = {
  id: number;
  name: string;
  color: string;
  wins: number;
  time: number;
  };
export type WinnersTablePageData = {
    items: WinnerTableItem[];
    total: number;
  };