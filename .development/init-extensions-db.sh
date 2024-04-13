#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = "$POSTGRES_DB") THEN
        CREATE DATABASE "$POSTGRES_DB";
    END IF;
END
\$\$;
\c "$POSTGRES_DB"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
EOSQL
