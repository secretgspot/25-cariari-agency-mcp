# MCP Server for Cariari.Agency

This MCP server provides property listing and management tools for Cariari.Agency, exposing endpoints for property search and detail retrieval.

## Available Tools

### get-properties

Retrieve a list of property listings with optional filters. Returns properties for sale or rent, with details such as location, price, and features.

**Parameters:**

- `property_for` (string, optional): Filter by property type (e.g., Sale, Rent)
- `price_max` (number, optional): Maximum price for sale properties
- `rent_max` (number, optional): Maximum rent for rental properties
- `beds_min` (number, optional): Minimum number of bedrooms
- `baths_min` (number, optional): Minimum number of bathrooms
- `lot_size_min` (number, optional): Minimum lot size in square meters
- `contact_phone` (string, optional): Filter by contact phone (partial match)
- `contact_realtor` (string, optional): Filter by contact realtor (partial match)
- `contact_email` (string, optional): Filter by contact email (partial match)
- `year_built_min` (number, optional): Minimum year built
- `year_built_max` (number, optional): Maximum year built
- `land_use` (string, optional): Filter by land use (partial match)
- `building_size_min` (number, optional): Minimum building size in square meters
- `building_size_max` (number, optional): Maximum building size in square meters
- `msl` (string, optional): Filter by MLS number (partial match)
- `sort` (string, optional): Field to sort the results by (e.g., price, created_at)
- `order` (asc|desc, optional): Sort order (asc or desc), requires sort

### get-property

Retrieve details for a single property by its unique ID.

**Parameters:**

- `id` (string, required): The UUID of the property to retrieve

## Usage

Start the MCP server:

```bash
npx -y tsx main.ts
```

Inspect the MCP server (for development):

```bash
npx -y @modelcontextprotocol/inspector npx -y tsx main.ts
```

Deploy the MCP server to Docker

```bash
docker build -t mcp-cariari-agency .
```

## Notes

- The server fetches data from the Cariari.Agency public API at <https://cariari.agency/api/properties>
- All filters are optional; you can combine them as needed.
- For more details on the Cariari.Agency API, see the main project documentation.
