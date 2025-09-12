export interface BalanceTransaction {
  id: number;
  transactionType: TransactionType;
  amount: number;
  clientId: number;
  employeeId?: number | null;
  date: string;
}

export enum TransactionType {
    INGRESO = 'INGRESO',
    EGRESO = 'EGRESO',
}