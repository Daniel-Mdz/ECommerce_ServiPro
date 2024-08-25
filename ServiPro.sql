-- Tabla Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Identificador único para cada usuario (clave primaria)
    dni VARCHAR(20) UNIQUE, -- Documento Nacional de Identidad, debe ser único
    username VARCHAR(50) UNIQUE, -- Nombre de usuario, debe ser único
    first_name VARCHAR(50) NOT NULL, -- Nombre del usuario
    last_name VARCHAR(50) NOT NULL, -- Apellido del usuario
    email VARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico del usuario, debe ser único
    password VARCHAR(255) NOT NULL, -- Contraseña del usuario (almacenada de forma cifrada)
    phone_number VARCHAR(30), -- Número de teléfono del usuario
    address TEXT, -- Dirección del usuario
    city VARCHAR(50), -- Ciudad de residencia del usuario
    state VARCHAR(50), -- Estado o región de residencia del usuario
    postal_code VARCHAR(20), -- Código postal del usuario
    country VARCHAR(50), -- País de residencia del usuario
    profile_picture_url VARCHAR(255), -- URL de la imagen de perfil del usuario
    user_type VARCHAR(50) CHECK (user_type IN ('client', 'service_provider')) NOT NULL, -- Tipo de usuario: cliente o proveedor de servicios
    status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'banned')) DEFAULT 'active', -- Estado de la cuenta del usuario (activo, inactivo, o suspendido)
    date_of_birth DATE, -- Fecha de nacimiento del usuario
    gender VARCHAR(50) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')), -- Género del usuario
    is_verified BOOLEAN DEFAULT FALSE, -- Indica si el usuario ha verificado su cuenta
    two_factor_enabled BOOLEAN DEFAULT FALSE, -- Indica si el usuario ha habilitado la autenticación de dos factores
    login_attempts INT DEFAULT 0, -- Número de intentos fallidos de inicio de sesión
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la cuenta
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de última actualización de la cuenta
    last_login TIMESTAMP -- Fecha y hora del último inicio de sesión
);

    -- Función que actualiza el campo `updated_at` con la fecha y hora actuales
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); -- Establece `updated_at` a la fecha y hora actuales
   RETURN NEW; -- Devuelve el nuevo registro con el campo actualizado
END;
$$ LANGUAGE plpgsql;

    -- Trigger que llama a la función `update_updated_at_column` antes de actualizar una fila
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Administradores

CREATE TABLE admins (
    id SERIAL PRIMARY KEY, -- Identificador único para cada administrador (clave primaria)
    dni VARCHAR(20) UNIQUE NOT NULL, -- Documento Nacional de Identidad, debe ser único y no nulo
    username VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario, debe ser único y no nulo
    first_name VARCHAR(50) NOT NULL, -- Nombre del administrador
    last_name VARCHAR(50) NOT NULL, -- Apellido del administrador
    email VARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico del administrador, debe ser único
    password VARCHAR(255) NOT NULL, -- Contraseña del administrador (almacenada de forma cifrada)
    phone_number VARCHAR(30), -- Número de teléfono del administrador
    role VARCHAR(50) NOT NULL, -- Rol del administrador (por ejemplo, 'superadmin', 'admin', etc.)
    role_assigned_by INT, -- Identificador del administrador que asignó el rol (relación con la tabla admins)
    is_active BOOLEAN DEFAULT TRUE, -- Indica si el administrador está activo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de última actualización del registro
    last_login TIMESTAMP, -- Fecha y hora del último inicio de sesión
    last_login_ip INET, -- Dirección IP del último inicio de sesión para rastreo de seguridad
    failed_login_attempts INT DEFAULT 0, -- Número de intentos fallidos de inicio de sesión
    account_locked_until TIMESTAMP -- Fecha y hora hasta la cual la cuenta está bloqueada (en caso de intentos fallidos excesivos)
);

ALTER TABLE admins -- Añadir una restricción de clave foránea para `role_assigned_by`
    ADD CONSTRAINT fk_role_assigned_by
    FOREIGN KEY (role_assigned_by) REFERENCES admins(dni);


-- Categoria de Servicos

CREATE TABLE services_category (
    id SERIAL PRIMARY KEY, -- Identificador único para cada categoría (clave primaria)
    title VARCHAR(100) NOT NULL, -- Título de la categoría
    description TEXT, -- Descripción de la categoría
    include_types VARCHAR(255), -- Tipos de servicios incluidos en esta categoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación de la categoría (valor por defecto es la fecha y hora actuales)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de última actualización de la categoría (se actualizará mediante un trigger)
    created_by VARCHAR(20), -- DNI del administrador que creó la categoría (relación con la tabla de admins)
    is_active BOOLEAN DEFAULT TRUE, -- Indica si la categoría está activa (valor por defecto es TRUE)
    priority INT DEFAULT 0, -- Prioridad de la categoría (para ordenar categorías, valor por defecto es 0)
    image_url VARCHAR(255), -- URL de una imagen representativa de la categoría
    metadata JSONB, -- Datos adicionales en formato JSON
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES admins(dni) -- Clave foránea que referencia a la tabla de admins (campo 'dni')
);
    -- Crear una función de trigger que actualiza el campo 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Establece el campo 'updated_at' con la fecha y hora actuales
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Devuelve el nuevo registro con el campo 'updated_at' actualizado
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
    -- Crear un trigger que ejecute la función de actualización antes de cada actualización en la tabla 'services_category'
CREATE TRIGGER update_services_category_updated_at
BEFORE UPDATE ON services_category
FOR EACH ROW
    -- Ejecuta la función 'update_updated_at_column' para actualizar la columna 'updated_at'
EXECUTE FUNCTION update_updated_at_column();