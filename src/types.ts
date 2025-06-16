export interface Meta {
	totalCount: number;
	page: number;
	count: number;
}

export interface Address {
	roadAddress: string;
	jibunAddress: string;
	englishAddress: string;
	x: string;
	y: string;
	distance: number;
}

export interface GeoResponse {
	status: string;
	meta: Meta
	errorMessage: string;
	addresses: Address[];
}

export interface DirectionResponse {
    code: number;
    message: string;
    currentDateTime: string;
    route: {
        traoptimal: TraoptimalRoute[];
    };
}

export interface TraoptimalRoute {
    summary: {
        start: {
            location: [number, number];
        };
        goal: {
            location: [number, number];
            dir: number;
        };
        distance: number;
        duration: number;
        departureTime: string;
        bbox: [ [number, number], [number, number] ];
        tollFare: number;
        taxiFare: number;
        fuelPrice: number;
    };
    path: [number, number][];
    section: Section[];
    guide: Guide[];
}

export interface Section {
    pointIndex: number;
    pointCount: number;
    distance: number;
    name: string;
    congestion: number;
    speed: number;
}

export interface Guide {
    pointIndex: number;
    type: number;
    instructions: string;
    distance: number;
    duration: number;
}