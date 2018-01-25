# Construction Forms - Backend

### Robbie Greiner & Nick Teets

## Introduction

 This application builds an entire backend database containing construction project, employee and form data

## Built With

```
* JavaScript
* Node
* Express
* Knex
* PostgreSQL
* HTML
* CSS
* Chai/Mocha
```

### `Resources`

 **NOTES**

- All API requests will be returned JSON format.

#### _HTTP Status Codes_
All responses will be returned with one of the following HTTP status codes:

* `200` `OK` The request was successful
* `400` `Bad Request` There was a problem with the request due to client error
* `401` `Unauthorized` User is unauthenticated and does not have the necessary credentials
* `403` `Forbidden`  The user might not have the necessary permissions for a resource or may need an account of some sort
* `404` `Not found` The resource could not be found
* `405` `Method not allowed` The resource does not support the request method
* `500` `Internal Server Error` Unexpected error was encountered on server side

#### _Endpoints_

### Authentication _for_ `JSON Web Token (JWT)`

- <code>POST</code> /api/v1/auth

Example **request:**
```
{
   "appName": "byob",
   "email": "robbie@turing.io",

}
```

Example **response:**
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IpkXVCJ9.eyJhcHBOYW1lIjoiYnlvYiIsImVtYWlsIjoicm9iYmllQHR1cmluZy5pbyJ9.xhqE8SYBJP7V2zif9UgrIVVuyqyNDiRRsQ8asrt7ODA"
```

### Projects

#### <code>GET</code> /api/v1/projects

Example **request:**
  - No body required/accepted

Example **response:**
```
[
  {
    "id": 65,
    "name": "United Airlines Remodel",
    "location": "Denver",
    "union": true,
    "public": true
  },
  {
    "id": 66,
    "name": "Coors Field West Mezzanine",
    "location": "Denver",
    "union": true,
    "public": true
  },
  {
    "id": 67,
    "name": "Denver Brewing Company Tank 7",
    "location": "Denver",
    "union": false,
    "public": false
  }
]
```
  - This endpoint accepts query parameters
    <code>/api/v1/projects/?name=United Airlines Remodel</code>
    **response:**
    ```
    [
      {
        "id": 65,
        "name": "United Airlines Remodel",
        "location": "Denver",
        "union": true,
        "public": true
      }
    ]
    ```
    Accepted query parameters are <code>name</code> and <code>location</code>

#### <code>GET</code> /api/v1/projects/:projectId/employees
Example **request:**
  - No body required/accepted

Example **response:**
```
[
  {
    "id": 62,
    "name": "Robbie Greiner",
    "position": "Foreman",
    "email": "robbie@gcbuilders.net",
    "phone": "303-123-4567",
    "project_id": 65,
    "employee_id": 62
  },
  {
    "id": 65,
    "name": "Alex Berg",
    "position": "Foreman",
    "email": "alex@gcbuilders.net",
    "phone": "303-123-4570",
    "project_id": 65,
    "employee_id": 65
  },
  {
    "id": 76,
    "name": "Ron Swanson",
    "position": "Carpenter",
    "email": "ron@gcbuilders.net",
    "phone": "303-123-4581",
    "project_id": 65,
    "employee_id": 76
  }
]
```
#### <code>GET</code> /api/v1/projects/:projectId/
Example **request:**
  - No body required/accepted

Example **response:**
```
{
  "id": 76,
  "name": "Turing School",
  "location": "Denver",
  "union": false,
  "public": false
}
```
#### <code>POST</code> /api/v1/projects
Example **request:**
```
{
  "name": "Turing School",
  "location": "Denver",
  "union": false,
  "public": false
}
```

Example **response:**
```
{
  "id": 95
}
```

#### <code>POST</code> /api/v1/projects/:projectId/employees/:employeeId
Example **request:**
  - No request body

Example **response:**
  - No response body. Status code 201

#### <code>DELETE</code> /api/v1/projects/:projectId
Example **request:**
  - No request body

Example **response:**
  - No response body. Status code 204

#### <code>PATCH</code> /api/v1/projects/:projectId
Example **request:**
```
{
  "name": "Turing School",
  "location": "Denver",
  "union": false,
  "public": false
}
```
  - Request body only requires the key value pairs being changed

Example **response:**
  - No response body. Status code 204

### Employees

#### <code>GET</code> /api/v1/employees
Example **request:**
  - No body required/accepted

Example **response:**
```
[
  {
    "id": 62,
    "name": "Robbie Greiner",
    "position": "Foreman",
    "email": "robbie@gcbuilders.net",
    "phone": "303-123-4567"
  },
  {
    "id": 63,
    "name": "Bill Smith",
    "position": "Foreman",
    "email": "bill@gcbuilders.net",
    "phone": "303-123-4568"
  },
  {
    "id": 64,
    "name": "Todd Gak",
    "position": "Foreman",
    "email": "todd@gcbuilders.net",
    "phone": "303-123-4569"
  }
]
```
    - This endpoint accepts query parameters
      <code>/api/v1/projects/?name=Todd Gak</code>
      **response:**
      ```
      {
        "id": 64,
        "name": "Todd Gak",
        "position": "Foreman",
        "email": "todd@gcbuilders.net",
        "phone": "303-123-4569"
      }
      ```
      Accepted query parameters are <code>name</code>, <code>position</code>, <code>email</code>, and  <code>phone</code>

#### <code>GET</code> /api/v1/employees/:employeeId/
Example **request:**
  - No body required/accepted

Example **response:**
```
{
  "id": 64,
  "name": "Todd Gak",
  "position": "Foreman",
  "email": "todd@gcbuilders.net",
  "phone": "303-123-4569"
}
```

#### <code>GET</code> /api/v1/employees/:employeeId/projects
Example **request:**
  - No body required/accepted

Example **response:**
```
[
  {
    "id": 77,
    "name": "CU Denver Student Activities",
    "location": "Denver",
    "union": true,
    "public": true,
    "project_id": 77,
    "employee_id": 75
  },
  {
    "id": 89,
    "name": "State Farm Office",
    "location": "Golden",
    "union": false,
    "public": false,
    "project_id": 89,
    "employee_id": 75
  }
]
```

#### <code>POST</code> /api/v1/employees
Example **request:**
```
{
  "name": "Malcolm Reynolds",
  "position": "Captain",
  "email": "mal@gcbuilders.net",
  "phone": "303-123-4569"
}
```

Example **response:**
```
{
  "id": 77
}
```

#### <code>DELETE</code> /api/v1/employees/:employeeId
Example **request:**
  - No request body

Example **response:**
  - No response body. Status code 204

#### <code>DELETE</code> /api/v1/projects/:projectId/employees/:employeeId
Example **request:**
  - No request body

Example **response:**
  - No response body. Status code 204

#### <code>PATCH</code> /api/v1/employees/:employeeId
Example **request:**
```
{
  "name": "Malcolm Reynolds",
  "position": "Captain",
  "email": "mal@gcbuilders.net",
  "phone": "303-123-4569"
}
```
  - Request body only requires the key value pairs being changed

Example **response:**
  - No response body. Status code 204
