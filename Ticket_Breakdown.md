# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket #1 - DB Migration

- Estimate: 1

We need to update the schema of the `Agent` table to add a `external_id` column. Because we want to be flexible with the types and formats of external ids that we support, the data tye for this column will be `text`.

The query to accomplish this will be straightforward:

```sql
ALTER TABLE AGENT ADD COLUMN external_id text
```

Since we anticipate users querying by this `external_id`, we will also want to add an index for `external_id`.

We also need to make sure we implement the "down" migration or rollback for these DDL changes. In other words, we will need code that both drops the external_id column as well as the index.

  

#### Acceptance Criteria:

1. The `Agent` table has an `external_id` column of type `text` (assuming the DB is Postgres).
1. There is an index created on `external_id`  
   

### Ticket #2 - External Id Upload (API endpoint)

Estimate:3

We need to create a new endpoint `agents` which accepts `POST` request.
It also needs to be able parse `multipart/form-data` in order to process the csv file that will come along with the requests. We will then parse the csv file into a js object. We will implement validation logic to ensure the csv is formatted properly. In turn, this js object will be form the DML update query which adds the new external agent ids to the matching internal ids

Acceptance Criteria:
- POST /agents with a csv file successfully stores external id's in the Agent table
- POST /agents with a malfromed csv file returns a 400

**This ticket is blocked by `Ticket #1`**

### Ticket #3 -- External Id Upload (UI)

- Estimate: 3

 We are going to expose a simple web form which allows customers to upload a mapping of their external Agent Id's to our Internal Agent Id's.  

 Here is the design of the form:

 ```
 Upload your Agent Id Mapping:

Please provide a .csv document in the following format:
`internal_id, external_id`. Do not include column headers.
 -------
| Upload |   {{file_name_preview.csv}}
 -------
 -------
| Submit |
 -------
```

The above upload button will be a native html input element of `type="file"`.  When the user clicks `Submit`, we will send a POST request to `https://fooapi.com/agents`

Acceptance Criteria:

The user can upload a csv of id mappings and sees a success error message.
The user sees an error message if the csv is malformattted.


### Ticket #4 Update `getShiftsByFacility`

Estimate: 1

The `getShiftsByFacility` function now needs to return the Agent's external Id in addition to the external Id. We need to update the part of query that joins to the `Agent` table for Agent metadata and select `external_id`

We also need to make sure this update to the query does not introduce any regressions. Our existing test suite must still pass, and we must also add a new unit test to ensure `getShiftsByFacility` includes `external_id` in the Agent metadata.

Acceptance Criteria:
`external_id` is present in the Agent metadata returned by the `getShiftsByFacility` function.

### Ticket #5 Update `generateReport`

- Estimate: 1

We need to update the `generateReport` function so that the pdfs now display external id's instead of internal agent id's.

Acceptance Critera:

Pdf's will display external agent id's if they are available. Otherwise, the pdf reports will fallback to internal id's
