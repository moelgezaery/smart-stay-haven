export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    exchangeRate: number;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface CurrencyCreate {
    code: string;
    name: string;
    symbol: string;
    exchangeRate: number;
    isDefault: boolean;
}

export interface CurrencyUpdate extends Partial<CurrencyCreate> {
    isActive?: boolean;
} 