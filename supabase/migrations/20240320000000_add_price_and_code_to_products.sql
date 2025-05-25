-- Adiciona colunas de preço e código aos produtos
ALTER TABLE products
ADD COLUMN price DECIMAL(10,2),
ADD COLUMN code VARCHAR(50) GENERATED ALWAYS AS (CONCAT('PROD-', id::text)) STORED;

-- Cria tabela de tamanhos
CREATE TABLE sizes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cria tabela de relacionamento entre produtos e tamanhos
CREATE TABLE product_sizes (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size_id UUID REFERENCES sizes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (product_id, size_id)
);

-- Insere alguns tamanhos padrão
INSERT INTO sizes (name, description) VALUES
    ('PP', 'Tamanho PP'),
    ('P', 'Tamanho P'),
    ('M', 'Tamanho M'),
    ('G', 'Tamanho G'),
    ('GG', 'Tamanho GG'),
    ('XG', 'Tamanho XG');

-- Adiciona RLS para as novas tabelas
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;

-- Cria políticas para sizes
CREATE POLICY "Permitir leitura pública de sizes"
    ON sizes FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção de sizes para admins"
    ON sizes FOR INSERT
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Permitir atualização de sizes para admins"
    ON sizes FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Permitir deleção de sizes para admins"
    ON sizes FOR DELETE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Cria políticas para product_sizes
CREATE POLICY "Permitir leitura pública de product_sizes"
    ON product_sizes FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção de product_sizes para admins"
    ON product_sizes FOR INSERT
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Permitir atualização de product_sizes para admins"
    ON product_sizes FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Permitir deleção de product_sizes para admins"
    ON product_sizes FOR DELETE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users)); 