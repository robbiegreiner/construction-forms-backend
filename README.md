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

 Example body for Token **request:**
```
{
    "appName": "byob",
    "email": "robbie@turing.io",

}
```

 Example body for Token **response:**
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiYnlvYiIsImVtYWlsIjoicm9iYmllQHR1cmluZy5pbyJ9.xhqE8SYBJP7V2zif9UgrIVVuyqyNDiRRsQ8qurt7ODA"
}
```

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

- **<code>POST</code> /api/v1/auth

### Projects

- **<code>GET</code> /api/v1/projects
- **<code>GET</code> /api/v1/projects/:projectId/employees
- **<code>POST</code> /api/v1/projects
- **<code>POST</code> /api/v1/projects/:projectId/employees/:employeeId
- **<code>DELETE</code> /api/v1/projects/:projectId
- **<code>PATCH</code> /api/v1/projects/:projectId


### Employees

- **<code>GET</code> /api/v1/employees
- **<code>GET</code> /api/v1/employees/:employeeId/projects
- **<code>POST</code> /api/v1/employees
- **<code>DELETE</code> /api/v1/employees/:employeeId
- **<code>DELETE</code> /api/v1/projects/:projectId/employees/:employeeId
- **<code>PATCH</code> /api/v1/employees/:employeeId
