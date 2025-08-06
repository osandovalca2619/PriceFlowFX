export declare class HealthController {
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        version: string;
        services: {
            database: string;
            websocket: string;
            priceService: string;
        };
    };
    getReady(): {
        status: string;
        timestamp: string;
    };
    getLive(): {
        status: string;
        timestamp: string;
    };
}
