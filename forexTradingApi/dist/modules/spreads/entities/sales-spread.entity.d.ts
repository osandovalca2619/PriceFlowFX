import { Currency } from '../../currencies/entities/currency.entity';
import { QuoteOrigin } from '../../catalogs/entities/quote-origin.entity';
import { Segment } from '../../catalogs/entities/segment.entity';
import { FxProduct } from '../../catalogs/entities/fx-product.entity';
export declare class SalesSpread {
    id: number;
    baseCurrencyId: number;
    quoteCurrencyId: number;
    originId: number;
    segmentId: number;
    fxProductId: number;
    marketHours: boolean;
    spreadBuy: number;
    spreadSell: number;
    createdAt: Date;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    origin: QuoteOrigin;
    segment: Segment;
    fxProduct: FxProduct;
}
