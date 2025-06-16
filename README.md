# Naver Map Direction MCP

The Naver Map MCP(Model Context Provider) is a MCP server for get GEO data and direction data from Naver Map.

Running on the stdio MCP server, it will provide the following functionalities:
- `get-geo`: Get GEO data from Naver Map
- `get-direciont`: Get direction data from Naver Map

# Running the Naver Map Direction MCP

### Requirements

- Node.js 18.x or higher

### Installation
```bash
npm run build
```

### MCP Configuration

Create a `mcp.json` file in the root directory of the project with the following content:

```json
{
  "mcpServers": {
    "naver-map-direction-mcp": {
      "command": "node",
      "args": [
        "<project-path>/naver-map-direction-mcp/dist/server.js"
      ],
      "env": {
        "NAVER_MAP_DIRECTION_API_URL": "<NAVER_MAP_DIRECTION_API_URL>",
        "NAVER_MAP_GEO_API_URL": "<NAVER_MAP_GEO_API_URL>",
        "NAVER_MAP_CLIENT_ID": "<NAVER_MAP_CLIENT_ID>",
        "NAVER_MAP_CLIENT_SECRET": "<NAVER_MAP_CLIENT_SECRET>"
      }
    }
  }
}
```

### Running the MCP Server on Localhost
```bash
npm run start
```

Get Geo data from Naver Map MCP:
```json
// Request
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-geo","arguments":{"address":"분당구 불정로 6"}}}
```

```json
// Response
{"result":{"content":[{"type":"text","text":"Latitude: 127.0132509, Longitude: 37.4856729"}]},"jsonrpc":"2.0","id":1}
```

Get Direction data from Naver Map MCP:
```json
// Request: 분당구 불정로 6 to 테헤란 427
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-direction","arguments":{"start":"127.1054328,37.3595963","goal":"127.0536603,37.5063712"}}}
```

```json
{"result":{"content":[{"type":"text","text":"Guide of get direction:\n정자일로1사거리에서 유턴\n'서울, 판교IC' 방면으로 우회전\n'서울, 수서, 성남시청·성남시의회' 방면으로 오른쪽 도로 주행\n'분당수서로' 방면으로 왼쪽 도시고속도로 진입\n벌말지하차도에서 지하차도 진입\n수서지하차도에서 지하차도 진입\n'김포공항, 강일IC, 잠실대교' 방면으로 오른쪽 도시고속도로 출구\n'강일IC, 잠실대교' 방면으로 왼쪽 방향\n봉은교에서 '올림픽대로(김포공항·강일IC), 코엑스·삼성역' 방면으로 우회전\n종합운동장에서 '장지동, 가락시장' 방면으로 우회전\n종합운동장에서 '삼성역' 방면으로 우회전\n'테헤란로69길' 방면으로 우회전\n'삼성로91길' 방면으로 우회전\n목적지"}]},"jsonrpc":"2.0","id":1}
```

### Future features
- Support for public transport directions
- Support for get GEO data by name