export class CreatePositionDto {
    symbol_id: string;
    side: 'long' | 'short';
    quantity: number;
    price: number;
    stop_loss?: number;
    take_profit?: number;
}
