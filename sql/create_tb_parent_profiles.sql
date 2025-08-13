
CREATE TABLE parent_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    relation VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    occupation VARCHAR(100),
    income DECIMAL(15,2),
    birth_date DATE,
    gender ENUM('Laki-laki', 'Perempuan'),
    CONSTRAINT fk_parent_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);