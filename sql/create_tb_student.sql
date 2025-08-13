CREATE TABLE students (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          parent_id INT NOT NULL,
                          full_name VARCHAR(100) NOT NULL,
                          nickname VARCHAR(50),
                          birth_place VARCHAR(100),
                          birth_date DATE,
                          gender ENUM('Laki-laki','Perempuan'),
                          religion VARCHAR(50),
                          address TEXT,
                          rt_rw VARCHAR(20),
                          village VARCHAR(100),
                          district VARCHAR(100),
                          nationality VARCHAR(50),
                          child_number INT,
                          siblings_count INT,
                          nisn VARCHAR(20) DEFAULT NULL, -- diisi guru
                          nis VARCHAR(20) DEFAULT NULL,  -- diisi guru
                          FOREIGN KEY (parent_id) REFERENCES parent_profiles(user_id) ON DELETE CASCADE
);