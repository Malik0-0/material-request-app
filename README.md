# Material Request App

Fullstack app for managing **material requests** and their **line items** (description, quantity, unit, optional price and notes). Built with **NestJS** (API), **Next.js** (UI), and **PostgreSQL** (data).

---

**Purpose:** A small internal-style tool where someone can file a request for materials: who is asking, on what date, and one or more material lines. Staff can browse requests, open a record, create new requests, adjust header fields or individual lines, and delete a whole request when it is no longer needed.

**Data model (high level):**

- **`requests`**: One row per request: date, requester name, status, timestamps.
- **`material_details`**: Many rows per request: each line has description, quantity, unit, optional price and notes, linked by `request_id`. Deleting a request removes its lines (cascade).

**Typical flow:**

1. User opens the **list** page, optionally filters by name or date range (filtering runs on the server).
2. User **creates** a request with one or more material lines, or opens an existing request to **view** it.
3. To **edit**, the user updates header fields (date, requester) and manages lines: add new lines, edit a line, or remove a line - each line change goes through the API so the database stays consistent.
4. User can **delete** an entire request from the list.

**Stack:** Backend exposes a REST API under `/api`; the frontend is a Next.js app that calls that API (no direct DB access from the browser).

---

## Backend (NestJS)

**Role:** Owns all persistence and business rules. The browser never connects to PostgreSQL; it only talks to this API.

**Structure:**

- **`RequestsModule`**: `RequestsController` + `RequestsService` for the parent `requests` entity: list (with filters), get one, create (request + initial material rows), update header fields, delete request.
- **`MaterialDetailsModule`**: `RequestMaterialDetailsController` + `MaterialDetailsService` for child rows under a given request: add a line, update a line, delete a line.
- **`AppModule`**: Loads config, registers **TypeORM** with PostgreSQL (`autoLoadEntities`, `synchronize: false`; schema is applied via `database/schema.sql`).
- **`main.ts`**: Global prefix **`/api`**, **ValidationPipe** (whitelist + class-transformer) for DTO validation, CORS for the Next.js dev origin.

**Behavior notes:**

- **Create:** `POST /requests` accepts `request_date`, `requester_name`, and a `materials` array; the service saves the request then inserts all material detail rows in one transaction path.
- **Read:** `GET /requests` returns requests with nested `material_details`; optional query params `search` (requester name, case-insensitive), `date_from`, `date_to` (inclusive on `request_date`). `GET /requests/:id` returns one request with lines.
- **Update header:** `PATCH /requests/:id` updates **parent** fields (`request_date`, `requester_name`, `status`). Allowed `status` values: `pending`, `approved`, `rejected`. Material lines are **not** replaced in bulk here.
- **Material lines:** Managed with `POST`, `PUT`, `DELETE` on `/requests/:requestId/details` and `/requests/:requestId/details/:detailId` (see API table below).
- **Delete:** `DELETE /requests/:id` removes the request; PostgreSQL cascade removes related `material_details`.

**Responses:** Success payloads use `{ "message": string, "data": ... }` for consistency with the frontend client.

**Default URL:** [http://localhost:3001](http://localhost:3001). Routes are under the **`/api`** prefix (e.g. `http://localhost:3001/api/requests`).

---

## Frontend (Next.js)

**Role:** Single-page style UX on top of the App Router. All data comes from `fetch` to `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:3001/api`).

**Structure (conceptual):**

- **`app/`**: Routes: home **list** (`/`), **create** (`/requests/new`), **detail** (`/requests/[id]`), **edit** (`/requests/[id]/edit`). Layout and global styles live under `app/` as usual for Next.js.
- **`components/requests/`**: UI split by area: list (filters + table), create form, detail view, edit screens (parent fields + editable material table), plus small shared pieces (e.g. page shell).
- **`hooks/`**: `useEditMaterialRequest` coordinates loading a request, saving header changes, and CRUD on individual material lines; `useRequestById` supports the read-only detail flow.
- **`lib/api.ts`**: Thin wrappers around REST endpoints (list with query string, CRUD on requests, CRUD on details).
- **`lib/`** helpers: e.g. normalizing material lines before submit.
- **Styling:** CSS Modules (`*.module.css`) for layout, tables, and forms; layout is constrained width with basic responsive tweaks (e.g. stacked header on narrow screens).

**User-facing routes:**


| Path                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `/`                  | List with filters; row opens detail; Edit / Delete |
| `/requests/new`      | Create request + initial material lines            |
| `/requests/:id`      | Read-only detail                                   |
| `/requests/:id/edit` | Edit header + add / edit / delete lines            |


**Default URL:** [http://localhost:3000](http://localhost:3000). Ensure CORS in `backend/src/main.ts` matches this origin if you change host or port.

---

## Validation

Validation is applied in **two places**: the UI blocks obvious mistakes before `fetch`, and the API enforces rules on every request so clients cannot skip checks.

### Backend

- **`ValidationPipe`** is registered globally in `backend/src/main.ts` with `whitelist` (strips unknown properties) and `transform` (runs **class-transformer** so nested bodies and string-to-number fields map correctly).
- Bodies are described by **DTO classes** under `backend/src/requests/dto/` and `backend/src/material-details/dto/`, using **class-validator** decorators.
- **Create request (`POST /requests`):** `CreateRequestDto` requires `request_date` as a date string (`@IsDateString()`), non-empty `requester_name`, and a `materials` array. Each item follows `CreateMaterialDetailDto`: non-empty `material_description` and `unit`, `quantity` as an integer ≥ 1 (`@Min(1)`), optional `price` (number) and `notes` (string).
- **Update request (`PATCH /requests/:id`):** `UpdateRequestDto` treats all fields as optional; when present, `request_date` must be a date string, `requester_name` a string, and `status` must be one of `pending`, `approved`, `rejected` (`@IsIn(...)`).
- **Material line create/update (`POST` / `PUT` ...`/details`):** same shape as `CreateMaterialDetailDto`.
- If validation fails, Nest responds with **400 Bad Request** and a JSON error payload (standard `class-validator` output).

### Frontend

- **Create** (`components/requests/create/request-form.tsx`): before submit, the form checks that request date and requester name are non-empty and that every material line has description, unit, and an integer quantity greater than zero. A single message is shown when something is missing; the API is not called until these pass.
- **Edit** (`hooks/use-edit-material-request.ts`): saving the header requires date and requester; saving or adding a line requires description, unit, and quantity ≥ 1 (aligned with the DTOs). Errors are shown next to the relevant actions.
- The frontend does not duplicate every server rule in full (for example, ISO date format is primarily enforced on the server), but **required fields** from the test brief are covered on both sides so users get fast feedback and the database always goes through the same API checks.

---

## Project layout

```
Material-Request-App/
├── backend/          # NestJS API
├── frontend/         # Next.js app
└── database/         # SQL schema (PostgreSQL)
```

---

## Prerequisites

- Node.js 20+
- PostgreSQL (local or reachable instance)

---

## 1. Database setup

1. Create a database (example name: `material_request_db`).
2. Run the schema script:

```bash
psql -U postgres -d material_request_db -f database/schema.sql
```

Or open `database/schema.sql` in your SQL client and execute it against your database.

**Tables:** `requests` (parent), `material_details` (child, FK to `requests.id`, `ON DELETE CASCADE`).

---

## 2. Backend (run)

1. Copy environment file and edit credentials:

```bash
cd backend
copy .env.example .env
```

Set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` to match your PostgreSQL.

1. Install and run:

```bash
npm install
npm run start:dev
```

API listens on **port 3001** with global prefix **`/api`**.

---

## 3. Frontend (run)

1. Copy environment file:

```bash
cd frontend
copy .env.local.example .env.local
```

Default API URL is `http://localhost:3001/api`. Set `NEXT_PUBLIC_API_BASE_URL` if your API runs elsewhere.

1. Install and run:

```bash
npm install
npm run dev
```

App runs at **[http://localhost:3000](http://localhost:3000)**.

---

## API endpoints

Base URL: `http://localhost:3001/api`

These routes are implemented by **`RequestsModule`** (`RequestsController`) for request CRUD and filtered listing, and **`MaterialDetailsModule`** (`RequestMaterialDetailsController`) for material lines under a request.

### Requests


| Method | Path            | Handler    | Description                                                                    |
| ------ | --------------- | ---------- | ------------------------------------------------------------------------------ |
| GET    | `/requests`     | `findAll`  | List requests with `material_details`. Query: `search`, `date_from`, `date_to` |
| GET    | `/requests/:id` | `findOne`  | One request with material details                                              |
| POST   | `/requests`     | `create`   | Create request + materials (see body below)                                    |
| PATCH  | `/requests/:id` | `update`   | Update **header** (`request_date`, `requester_name`, `status`)                 |
| DELETE | `/requests/:id` | `remove`   | Delete request (details removed via FK cascade)                                |


### Material details (per request)


| Method | Path                                     | Handler    | Description         |
| ------ | ---------------------------------------- | ---------- | ------------------- |
| POST   | `/requests/:requestId/details`           | `create`   | Add a material line |
| PUT    | `/requests/:requestId/details/:detailId` | `update`   | Update a line       |
| DELETE | `/requests/:requestId/details/:detailId` | `remove`   | Delete a line       |


Success responses share the same wrapper shape: `{ "message": string, "data": ... }`. Below, each endpoint shows query/path usage, body (if any), and a typical JSON response.

### `GET /requests`

**Query (all optional):** `search` (requester name, partial match), `date_from`, `date_to` (inclusive, `YYYY-MM-DD` on `request_date`).

Example: `/requests?search=doe&date_from=2026-01-01&date_to=2026-12-31`

**Response:**

```json
{
  "message": "Material requests fetched successfully",
  "data": [
    {
      "id": 1,
      "request_date": "2026-03-27",
      "requester_name": "John Doe",
      "status": "pending",
      "created_at": "2026-03-27T10:00:00.000Z",
      "updated_at": null,
      "material_details": [
        {
          "id": 1,
          "request_id": 1,
          "material_description": "Steel",
          "quantity": 10,
          "unit": "kg",
          "price": "100",
          "notes": null,
          "created_at": "2026-03-27T10:00:00.000Z"
        }
      ]
    }
  ]
}
```

### `GET /requests/:id`

**Path:** `id` is the request primary key.

**Response:**

```json
{
  "message": "Material request fetched successfully",
  "data": {
    "id": 1,
    "request_date": "2026-03-27",
    "requester_name": "John Doe",
    "status": "pending",
    "created_at": "2026-03-27T10:00:00.000Z",
    "updated_at": null,
    "material_details": [
      {
        "id": 1,
        "request_id": 1,
        "material_description": "Steel",
        "quantity": 10,
        "unit": "kg",
        "price": "100",
        "notes": null,
        "created_at": "2026-03-27T10:00:00.000Z"
      }
    ]
  }
}
```

### `POST /requests`

**Body:**

```json
{
  "request_date": "2026-03-27",
  "requester_name": "John Doe",
  "materials": [
    {
      "material_description": "Steel",
      "quantity": 10,
      "unit": "kg",
      "price": 100,
      "notes": "optional"
    }
  ]
}
```

`price` and `notes` may be omitted on each line (`price` defaults to null server-side).

**Response:**

```json
{
  "message": "Material request created successfully",
  "data": {
    "id": 1,
    "request_date": "2026-03-27",
    "requester_name": "John Doe",
    "status": "pending",
    "created_at": "2026-03-27T10:00:00.000Z",
    "updated_at": null,
    "material_details": [
      {
        "id": 1,
        "request_id": 1,
        "material_description": "Steel",
        "quantity": 10,
        "unit": "kg",
        "price": "100",
        "notes": null,
        "created_at": "2026-03-27T10:00:00.000Z"
      }
    ]
  }
}
```

### `PATCH /requests/:id`

Updates **header fields only** (not material lines). Send any subset of `request_date`, `requester_name`, and `status`. For `status`, use one of: `pending`, `approved`, `rejected`.

**Body:**

```json
{
  "request_date": "2026-03-28",
  "requester_name": "Jane Doe",
  "status": "approved"
}
```

**Response:**

```json
{
  "message": "Material request updated successfully",
  "data": {
    "id": 1,
    "request_date": "2026-03-28",
    "requester_name": "Jane Doe",
    "status": "approved",
    "created_at": "2026-03-27T10:00:00.000Z",
    "updated_at": "2026-03-28T12:00:00.000Z",
    "material_details": [
      {
        "id": 1,
        "request_id": 1,
        "material_description": "Steel",
        "quantity": 10,
        "unit": "kg",
        "price": "100",
        "notes": null,
        "created_at": "2026-03-27T10:00:00.000Z"
      }
    ]
  }
}
```

### `DELETE /requests/:id`

Deletes the request

**Body:** none.

**Response:**

```json
{
  "message": "Material request deleted successfully",
  "data": null
}
```

### `POST /requests/:requestId/details`

Adds one material line to an existing request.

**Body:**

```json
{
  "material_description": "Aluminum sheet",
  "quantity": 5,
  "unit": "pcs",
  "price": 50,
  "notes": null
}
```

**Response:**

```json
{
  "message": "Material detail created successfully",
  "data": {
    "id": 2,
    "request_id": 1,
    "material_description": "Aluminum sheet",
    "quantity": 5,
    "unit": "pcs",
    "price": "50",
    "notes": null,
    "created_at": "2026-03-27T11:00:00.000Z"
  }
}
```

### `PUT /requests/:requestId/details/:detailId`

Replaces the fields of one line (same body shape as `POST .../details`).

**Body:**

```json
{
  "material_description": "Steel",
  "quantity": 12,
  "unit": "kg",
  "price": 120,
  "notes": "urgent"
}
```

**Response:**

```json
{
  "message": "Material detail updated successfully",
  "data": {
    "id": 1,
    "request_id": 1,
    "material_description": "Steel",
    "quantity": 12,
    "unit": "kg",
    "price": "120",
    "notes": "urgent",
    "created_at": "2026-03-27T10:00:00.000Z"
  }
}
```

### `DELETE /requests/:requestId/details/:detailId`

Deletes the fields of one material line

**Body:** none.

**Response:**

```json
{
  "message": "Material detail deleted successfully",
  "data": null
}
```

---

## Database schema (summary)

- **requests:** `id`, `request_date`, `requester_name`, `status` (default `pending`), `created_at`, `updated_at`
- **material_details:** `id`, `request_id` → `requests.id`, `material_description`, `quantity`, `unit`, `price`, `notes`, `created_at`

One request has many material detail rows.

---

## Scripts (quick reference)


| Location    | Command             | Purpose          |
| ----------- | ------------------- | ---------------- |
| `backend/`  | `npm run start:dev` | API dev server   |
| `backend/`  | `npm run build`     | Production build |
| `frontend/` | `npm run dev`       | Next.js dev      |
| `frontend/` | `npm run build`     | Production build |


