export declare class CreateCurrencyDto {
    code: string;
    name: string;
    symbol?: string;
    country?: string;
    decimals?: number;
    isStrongCurrency: boolean;
    createdBy: number;
    status?: string;
}
