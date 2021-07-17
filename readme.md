1. run
 
        npm i

2. in root create a ".env" file that contains:

        PORT - port on the server 
        DB_URL - connect to mongodb
        SALT - for hash password
        JWT_SECRET_ACCESS - string for hashing access-jwt
        JWT_ACCESS_TOKEN_LIVE - time live access-jwt 
        JWT_SECRET_REFRESH - string for hashing refresh-jwt 
        JWT_REFRESH_TOKEN_LIVE - time live refresh-jwt
        JWT_REFRESH_COOKIE_LIVE - time live cookie 
