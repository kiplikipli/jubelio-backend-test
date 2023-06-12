CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    image VARCHAR NOT NULL,
    price DECIMAL(13,2) NOT NULL,
    description text
);

CREATE TABLE adjustment_transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products (id) ON DELETE CASCADE,
    qty INTEGER NOT NULL,
    amount DECIMAL(13,2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);