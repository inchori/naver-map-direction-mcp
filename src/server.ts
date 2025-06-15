import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const NAVER_DIRECTION_BASE = process.env.NAVER_MAP_DIRECTION_API_URL
const NAVER_GEO_BASE = process.env.NAVER_MAP_GEO_API_URL
const NAVER_CLIENT_ID = process.env.NAVER_MAP_CLIENT_ID
const NAVER_CLIENT_SECRET = process.env.NAVER_MAP_CLIENT_SECRET

const server = new McpServer({
	name: 'naver-map-direction',
	version: '1.0.0',
	capabilities: {
		resources: {},
		tools: {
			'get-geo': {},
		},
	},
})

async function makeNaverMapRequest<T>(url: string): Promise<T | null> {
	const headers = {
		'x-ncp-apigw-api-key-id': NAVER_CLIENT_ID ?? '',
		'x-ncp-apigw-api-key': NAVER_CLIENT_SECRET ?? '',
		Accept: 'application/json',
	}

    console.log('[NaverMapRequest] URL:', url)

	try {
		const response = await fetch(url, { headers })
		if (!response.ok) {
            const errText = await response.text()
			console.error('[NaverMapRequest] Error body:', errText)
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return (await response.json()) as T
	} catch (error) {
		console.error('Error making Naver Map request:', error)
		return null
	}
}

interface Meta {
	totalCount: number;
	page: number;
	count: number;
}

interface Address {
	roadAddress: string;
	jibunAddress: string;
	englishAddress: string;
	x: string;
	y: string;
	distance: number;
}

interface GeoResponse {
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

server.tool(
	'get-geo',
	'Get geo data by address',
	{
		address: z.string(),
	},
	async ({ address }) => {
		const geourl = `${NAVER_GEO_BASE}/geocode?query=${address}`
		const geoData = await makeNaverMapRequest<GeoResponse>(geourl)

		if (!geoData) {
			return {
				content: [
					{
						type: 'text',
						text: 'Failed to retrieve geo data',
					},
				],
			}
		}

		return {
			content: [
				{
					type: 'text',
					text: `Latitude: ${geoData.addresses[0].x}, Longitude: ${geoData.addresses[0].y}`,
				},
			],
		}
	},
)

server.tool(
    'get-direction', 
    'Get direction path',
    {
        start: z.string(),
        goal: z.string(),
    },
    async ({ start, goal }) => {
        const directionUrl = `${NAVER_DIRECTION_BASE}/driving?start=${start}&goal=${goal}`
        const directionData = await makeNaverMapRequest<DirectionResponse>(directionUrl)

        if (!directionData) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'Failed to retrieve direction data',
                    },
                ],
            }
        }
        console.log(directionData)

        return {
            content: [
                {
                    type: 'text',
                    text: `Guide of get direction:\n${directionData.route.traoptimal[0].guide.map(g => g.instructions).join('\n')}`,
                },
            ],
        }
    }
)

async function main() {
	const transport = new StdioServerTransport()
	await server.connect(transport)
	console.log('Naver MCP Server running on stdio')
}


main().catch((error) => {
	console.error('Fatal error in main():', error)
	process.exit(1)
})

