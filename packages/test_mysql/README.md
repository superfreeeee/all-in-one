# MySQL 链接测试

# 1. Docker 环境 MySQL 准备 + 启动

- 拉镜像

```sh
docker pull mysql
```

- `docker-compose.yml`

参考 [](./docker-compose.yml)

对应原始启动命令如下

```sh
docker run --rm --name test_mysql_db_1 -e MYSQL_ROOT_PASSWORD=123456789 -d mysql
```

- 启动 docker 容器

```sh
docker-compose up

# 或是加上 -d 挂到后台运行
docker-compose up -d
```

- 登陆 mysql 查看细节

```sh
# 登陆同时 use 创建数据表
docker exec -it test_mysql_db_1 env LANG=C.UTF-8 mysql -u dev -p test_mysql
# 只登陆
docker exec -it test_mysql_db_1 env LANG=C.UTF-8 mysql -u dev -p
```

# 2. 建立数据表

- 建立数据库

docker-compose 里面已经配置了数据库，也可以手动创建

```sql
create database test_db;
use test_db;
```

- 创建数据表

```sql
CREATE TABLE todo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(200),
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

- 插入一些数据

```sql
INSERT INTO todo (title, description) VALUES ('测试 todo 1', '这是一个测试任务，需要完成项目的所有任务');
INSERT INTO todo (title, description) VALUES ('测试 todo 2', '这是一个测试任务，需要完成项目的所有任务');
INSERT INTO todo (title, description) VALUES ('测试 todo 3', '这是一个测试任务，需要完成项目的所有任务');

UPDATE todo SET description = 'field modified' WHERE id = 2;
```

# 3. 基于 Node.js 环境 连接 MySQL 数据库操作

- todo 包含了简单的查找 & 插入数据的示例
- counter 包含更复杂的查询场景 + 事务处理的例子

```sh
pnpm dev:todo
pnpm dev:counter
```
