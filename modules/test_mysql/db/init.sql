CREATE DATABASE IF NOT EXISTS test_go;
USE test_go;

CREATE TABLE IF NOT EXISTS todo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(200),
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- INSERT INTO todo (title, description) VALUES ('测试 todo 1', '这是一个测试任务，需要完成项目的所有任务');
INSERT INTO todo (title, description) VALUES ('测试 todo 1', '这是一个测试任务，需要完成项目的所有任务');
INSERT INTO todo (title, description) VALUES ('测试 todo 2', '这是一个测试任务，需要完成项目的所有任务');
INSERT INTO todo (title, description) VALUES ('测试 todo 3', '这是一个测试任务，需要完成项目的所有任务');

CREATE TABLE IF NOT EXISTS counter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  num INT NOT NULL DEFAULT 0
);

-- INSERT INTO counter () VALUES ();
