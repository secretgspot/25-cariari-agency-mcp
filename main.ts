import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
	name: "Cariari Agency",
	version: "0.1.0",
	description: "A server for the Cariari Agency property listing and management system"
});

server.tool(
	'get-properties',
	'Retrieve a list of property listings with optional filters. Returns properties for sale or rent, with details such as location, price, and features.',
	{
	property_for: z.string().optional().describe('Filter by property type (e.g., Sale, Rent)'),
	price_max: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Maximum price for sale properties'),
	rent_max: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Maximum rent for rental properties'),
	beds_min: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Minimum number of bedrooms'),
	baths_min: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Minimum number of bathrooms'),
	lot_size_min: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Minimum lot size in square meters'),
	contact_phone: z.string().optional().describe('Filter by contact phone (partial match)'),
	contact_realtor: z.string().optional().describe('Filter by contact realtor (partial match)'),
	contact_email: z.string().optional().describe('Filter by contact email (partial match)'),
	year_built_min: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Minimum year built'),
	year_built_max: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Maximum year built'),
	land_use: z.string().optional().describe('Filter by land use (partial match)'),
	building_size_min: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Minimum building size in square meters'),
	building_size_max: z.preprocess((v) => v === '' || v === undefined || v === null ? undefined : Number(v), z.number().optional()).describe('Maximum building size in square meters'),
	msl: z.string().optional().describe('Filter by MLS number (partial match)'),
	sort: z.string().optional().describe('Field to sort the results by (e.g., price, created_at)'),
	order: z.enum(['asc', 'desc']).optional().describe('Sort order (asc or desc), requires sort'),
	},
	async (params) => {
		// Capitalize property_for and send as array if present
		const queryParams = { ...params };
		let queryParts: string[] = [];
		if (queryParams.property_for) {
			const val = Array.isArray(queryParams.property_for)
				? queryParams.property_for[0]
				: queryParams.property_for;
			const cap = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
			queryParts.push(`property_for=${encodeURIComponent(cap)}`);
			delete queryParams.property_for;
		}
		queryParts = queryParts.concat(
			Object.entries(queryParams)
				.filter(([_, v]) => v !== undefined && v !== null && v !== "")
				.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
		);
		const query = queryParts.join("&");
		const url = `https://cariari.agency/api/properties${query ? `?${query}` : ""}`;
		try {
			const res = await fetch(url);
			if (!res.ok) {
				return {
					content: [{ type: 'text', text: `Error fetching properties: ${res.status} ${res.statusText}` }]
				};
			}
			const data = await res.json();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2)
					}
				]
			};
		} catch (e) {
			return {
				content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }]
			};
		}
	}
);

server.tool(
	'get-property',
	'Retrieve details for a single property by its unique ID or MLS number.',
	{
		id: z.string().describe('The UUID or MSL number (cr-001) of the property to retrieve')
	},
	async (params) => {
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		let url = '';
		if (uuidRegex.test(params.id)) {
			url = `https://cariari.agency/api/properties/${encodeURIComponent(params.id)}`;
		} else {
			url = `https://cariari.agency/api/properties?msl=${encodeURIComponent(params.id)}`;
		}
		try {
			const res = await fetch(url);
			if (!res.ok) {
				return {
					content: [{ type: 'text', text: `Error fetching property: ${res.status} ${res.statusText}` }]
				};
			}
			const data = await res.json();
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(data, null, 2)
					}
				]
			};
		} catch (e) {
			return {
				content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }]
			};
		}
	}
);

const transport = new StdioServerTransport();
server.connect(transport);