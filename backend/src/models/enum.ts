export enum StatusCode {

    // Success (2xx):
    OK = 200,
    Created = 201,
    NoContent = 204,

    // Redirection (3xx):
    NotModified = 304,

    // Client errors (4xx):
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    Conflict = 409,
    UnprocessableEntity = 422,
    TooManyRequests = 429,

    // Server errors (5xx):
    InternalServerError = 500,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
}

export enum Role {
    Admin = 1,
    User = 2
}