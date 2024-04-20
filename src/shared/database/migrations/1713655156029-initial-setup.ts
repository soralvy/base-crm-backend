import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class InitialSetup1713655156029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Roles Table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(512) NOT NULL,
                description VARCHAR(1024) NOT NULL
            );
        `);

    // Create Users Table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(320) UNIQUE NOT NULL,
                name VARCHAR(256) NOT NULL,
                surname VARCHAR(256) NOT NULL
            );
        `);

    // Create Permission Categories Table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS permission_categories (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(512) NOT NULL,
                description VARCHAR(1024) NOT NULL
            );
        `);

    // Insert a default permission category
    await queryRunner.query(`
            INSERT INTO permission_categories (name, description) VALUES 
            ('General Permissions', 'General permissions for the application');
        `);

    // Fetch the ID of the newly inserted permission category
    const [category] = await queryRunner.query(
      `SELECT id FROM permission_categories WHERE name = 'General Permissions'`,
    );

    // Create Permissions Table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS permissions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(256) NOT NULL,
                description VARCHAR(1024),
                action VARCHAR(256) UNIQUE NOT NULL,
                permissionCategoryId UUID NOT NULL,
                FOREIGN KEY (permissionCategoryId) REFERENCES permission_categories(id)
            );
        `);

    // Insert initial permissions with category
    await queryRunner.query(`
            INSERT INTO permissions (name, description, action, permissionCategoryId) VALUES 
            ('Create Users', 'Allow user to create other users', 'user.create', '${category.id}'),
            ('Delete Users', 'Allow user to delete other users', 'user.delete', '${category.id}');
        `);

    // Create Users_Roles Junction Table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users_roles (
                userId UUID,
                roleId UUID,
                PRIMARY KEY (userId, roleId),
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (roleId) REFERENCES roles(id)
            );
        `);

    // Create User_Roles_Permissions Junction Table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS user_roles_permissions (
                roleId UUID,
                permissionId UUID,
                PRIMARY KEY (roleId, permissionId),
                FOREIGN KEY (roleId) REFERENCES roles(id),
                FOREIGN KEY (permissionId) REFERENCES permissions(id)
            );
        `);

    // Insert initial records for roles
    await queryRunner.query(`
            INSERT INTO roles (name, description) VALUES ('Administrator', 'User with access to all system features');
        `);

    // Insert initial user
    await queryRunner.query(`
            INSERT INTO users (email, name, surname) VALUES ('admin@example.com', 'Admin', 'User');
        `);

    // Associate all permissions with the administrator role
    await queryRunner.query(`
            INSERT INTO user_roles_permissions (roleId, permissionId)
            SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'Administrator';
        `);

    // Associate the administrator role with a user
    await queryRunner.query(`
            INSERT INTO users_roles (userId, roleId)
            SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'admin@example.com' AND r.name = 'Administrator';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS user_roles_permissions');
    await queryRunner.query('DROP TABLE IF EXISTS users_roles');
    await queryRunner.query('DROP TABLE IF EXISTS permissions');
    await queryRunner.query('DROP TABLE IF EXISTS permission_categories');
    await queryRunner.query('DROP TABLE IF EXISTS users');
    await queryRunner.query('DROP TABLE IF EXISTS roles');
  }
}
