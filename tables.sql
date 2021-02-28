USE `dumont-rafael-fontes`;

CREATE TABLE IF NOT EXISTS FullStack_user (
	id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	nickname VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS FullStack_image (
	id VARCHAR(255) PRIMARY KEY,
	subtitle VARCHAR(255) NOT NULL,
	author VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
	file VARCHAR(255) NOT NULL,
	collection VARCHAR(255),
    FOREIGN KEY (author) REFERENCES FullStack_user(id)
);

CREATE TABLE IF NOT EXISTS FullStack_tag (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS FullStack_image_tag (
	image_id VARCHAR(255) NOT NULL,
	tag_id INT NOT NULL,
    FOREIGN KEY (image_id) REFERENCES FullStack_image(id),
    FOREIGN KEY (tag_id) REFERENCES FullStack_tag(id)
);

