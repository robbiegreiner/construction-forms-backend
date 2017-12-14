# Build Your Own Backend

### Robbie Greiner & Alex Banister

## Introduction

 This application builds an entire backend database containing construction project and employee data

## Built With

```
* JavaScript
* Node
* Express
* Knex
* PostgreSQL
* JWT Tokens
* HTML
* CSS
* Chai/Mocha
```


## API Documentation

### `Authentication`

 This API requires a JSON Web Token (JWT) in order to modify any of the data in the database. Request a token through the following endpoint:

`/api/v1/auth`

 The request body for the token must must include the properties **appName** and **email**

 This token must be included when making requests with the following methods:
```
    POST
    DELETE
    PUT
    PATCH
```
 The token can be included in any of the following locations:

- **Request Body:** Add a key value pair for token in the body.

- **Authorization Header:** Add an Authorization key with a token for the value.

- **Query Parameter:** Use '?token=' as a query parameter to the request path with the token as value.

### `Authorization`

 Users will be granted access to modify data if they have an email address that ends with '@turing.io'

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
#### <code>GET</code> /api/v1/employees/:employeeId/
#### <code>GET</code> /api/v1/employees/:employeeId/projects
#### <code>POST</code> /api/v1/employees
#### <code>DELETE</code> /api/v1/employees/:employeeId
#### <code>DELETE</code> /api/v1/projects/:projectId/employees/:employeeId
#### <code>PATCH</code> /api/v1/employees/:employeeId
