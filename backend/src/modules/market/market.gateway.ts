import {
    WebSocketGateway, WebSocketServer, SubscribeMessage,
    OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger, Inject, forwardRef } from '@nestjs/common';
import { MarketService } from './market.service';

@WebSocketGateway({
    cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
    namespace: '/market',
    transports: ['websocket', 'polling'],
})
export class MarketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger('MarketGateway');
    private readonly connectedClients = new Map<string, Set<string>>();

    constructor(
        @Inject(forwardRef(() => MarketService))
        private readonly marketService: MarketService
    ) { }

    handleConnection(client: Socket) {
        this.connectedClients.set(client.id, new Set());
        this.logger.log(`Client connected: ${client.id} | Total: ${this.connectedClients.size}`);
    }

    handleDisconnect(client: Socket) {
        this.connectedClients.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('subscribe_ticker')
    handleSubscribeTicker(
        @MessageBody() data: { symbols: string[] },
        @ConnectedSocket() client: Socket,
    ) {
        const clientSubs = this.connectedClients.get(client.id) || new Set();
        for (const symbol of data.symbols) {
            client.join(`ticker:${symbol.toUpperCase()}`);
            clientSubs.add(symbol.toUpperCase());
        }
        this.connectedClients.set(client.id, clientSubs);
        client.emit('subscribed', { symbols: data.symbols, count: clientSubs.size });
    }

    @SubscribeMessage('unsubscribe_ticker')
    handleUnsubscribeTicker(
        @MessageBody() data: { symbols: string[] },
        @ConnectedSocket() client: Socket,
    ) {
        const clientSubs = this.connectedClients.get(client.id) || new Set();
        for (const symbol of data.symbols) {
            client.leave(`ticker:${symbol.toUpperCase()}`);
            clientSubs.delete(symbol.toUpperCase());
        }
    }

    @SubscribeMessage('subscribe_orderbook')
    handleOrderBook(
        @MessageBody() data: { symbol: string; depth?: number },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`orderbook:${data.symbol.toUpperCase()}`);
        client.emit('orderbook_subscribed', { symbol: data.symbol });
    }

    broadcastTicker(symbol: string, data: TickerUpdate) {
        this.server.to(`ticker:${symbol}`).emit('ticker_update', { symbol, ...data, ts: Date.now() });
    }

    broadcastSignal(signal: any) {
        this.server.emit('new_signal', signal);
    }

    broadcastAlert(userId: string, alert: any) {
        this.server.to(`user:${userId}`).emit('alert_triggered', alert);
    }
}

export interface TickerUpdate {
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high24h: number;
    low24h: number;
}
