CREATE TABLE teacher_profile(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    nip VARCHAR(50),
    phone VARCHAR(50),
    address TEXT,
    birth_place VARCHAR(100),
    birth_date DATE,
    education VARCHAR(100),
    subject_specialization VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
