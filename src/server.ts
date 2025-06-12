import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/http.js";
import { z } from "zod"

const NAVER_DIRECTION_BASE = process.env.NAVER_MAP_DIRECTION_API_URL
const NAVER_GEO_BASE = process.env.NAVER_MAP_GEO_API_URL
const NAVER_CLIENT_ID = process.env.NAVER_MAP_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_MAP_CLIENT_SECRET;

const server = new McpServer({
    name: "naver-map-direction",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {}
    }
})

async function makeNaverMapRequest<T>(url: string): Promise<T | null> {
    const headers = {
        "x-ncp-apigw-api-key-id": NAVER_CLIENT_ID ?? "",
        "x-ncp-apigw-api-key": NAVER_CLIENT_SECRET ?? "",
        Accept: "application/json"
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        console.error("Error making Naver Map request:", error);
        return null;
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
    address: Address[];
}

server.tool(
    "get-geo",
    "Get optimized path",
    {
        address: z.string(),
    },
    async ({ address }) => {
        const geourl = `${NAVER_GEO_BASE}/geoCode?query=${address}`;
        console.log(geourl);
        const geoData = await makeNaverMapRequest<GeoResponse>(geourl);

        if (!geoData) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to retrieve geo data",
                    },
                ],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(geoData),
                },
            ],
        };
    },
);

// async function main() {
//     const transport = new StdioServerTransport();
//     await server.connect(transport);
//     console.error("Naver MCP Server running on stdio");
// }

async function main() {
    const transport = new HttpServerTransport({ port: 3000 });
    new StdioServerTransport
    await server.connect(transport);
    console.error("Naver MCP Server running on http://localhost:3000");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

