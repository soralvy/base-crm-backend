# Development Setup Guide

## Quick Start

Navigate to the development directory and start the services:

```bash
cd .development
docker-compose up
```

## Troubleshooting

If the services don't start as expected, follow these steps to diagnose and resolve the issue:

### 1. Check Running Processes

Ensure no conflicting services are running on required ports:

```bash
# List running processes that might use the same ports for PostgreSQL
sudo lsof -i :5432
or
netstat -an | grep 5432
```

### 2. Stop Conflicting Services

If conflicts are found, particularly with PostgreSQL using the same port, you may need to stop the local PostgreSQL service if it's running:

```bash
# Stop the local PostgreSQL service if it's managed by Homebrew
brew services stop postgresql
# Alternatively, you can stop it via the system's service manager, for example:
sudo systemctl stop postgresql
```

If the process does not respond or if it restarts automatically (due to system configuration), you may need to manually kill the process:

```bash
# Find the process ID (PID) and kill it
sudo kill -9 $(sudo lsof -t -i:5432)
```

### 3. Restart Services

After resolving any port conflicts, restart your Docker services to ensure clean initialization:

```bash
docker-compose down
docker-compose up
```

## Additional Commands

### Stopping Services

To stop all Docker services:

```bash
docker-compose down
```

### Viewing Logs

To check logs for a specific Docker container:

```bash
docker logs <container_name>
```

## Running the Migration for Initial Setup

Before you start using the application, it's crucial to initialize the database with the required schema and data. This is done through running migrations which set up tables and insert necessary default records.

### How to Run Migrations

Navigate to the project's root directory and execute the following command to run migrations:

```bash
# Run migrations to set up the database
npm run migration:run
```

### What the Migration Does

The initial migration performs several key tasks:

1. **Creates Database Tables**: Sets up all the necessary tables such as `users`, `roles`, `permissions`, and `permission_categories` based on the entity definitions in your application.
2. **Inserts Default Data**:

   - **Roles**: Inserts predefined roles like 'Administrator'.
   - **Users**: Inserts a default user, typically with administrative privileges.
   - **Permission Categories**: Creates categories under which permissions can be organized.
   - **Permissions**: Inserts specific permissions, linking them to the appropriate categories and roles.

3. **Associates Data**: Establishes relationships between entities. For example, it links permissions to roles and roles to users, ensuring the database reflects the correct hierarchies and access controls as intended by the application's design.

4. **Ensures Integrity**: Sets foreign keys and other constraints to maintain data integrity and enforce the relationships between different pieces of data.
