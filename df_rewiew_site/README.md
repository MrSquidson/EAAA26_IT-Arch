## setup
1.  Run `npm install`
2.  Insert own `.env` file
    Must include neondb config; 
    - PG_HOST
    - PG_PORT
    - PG_DATABASE
    - PG_USER
    - PG_PASSWORD
3.  Run `npm run create-db`
    This will DROP previous databases. As defined in the tables list in `./db/createdb.js`. Please note that the application doesnt use DROP ALL TABLES (That's a very scary command!)
    Create's tables that this database needs.