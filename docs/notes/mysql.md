# MySQL

# 1. 基础篇

## 查看内容

- `show processlist` 查看当前 connection
- `show variables` 配置变量
  - `wait_timeout` connection 断开时间
  - `max_connections` 最大 connection 数
  - `datadir` 数据存放目录
- `kill connection +<id>` 主动断开链接

## 存储结构

- `db.opt` 字符集
- `<db>.frm` 表结构
- `<db>.ibd` 表数据

- `Table` 表 > `Segment` 段 > `Extent` 区 > `Page` 页 > `Row` 行
  - `Page` 默认 16KB
  - `Extent` 默认 1MB = 64 页 * 16KB
  - `Segment`
    - 索引段：非叶子结点的区
    - 数据段：叶子结点的区
    - 回滚段：回滚数据的区

## InnoDB 行格式

- `row_format` 类型
  - Redundant: 老
  - Compact: 新
  - Dynamic: Compact变体
  - Compressed: Compact变体

- Compact 格式
  - 变长字段长度列表: 逆序存放
  - NULL 值列表: 8bits 标志位、逆序
  - `NOT NULL`: 可以保证不需要生成 NULL 值列表 空间
  - `row_id`: 没有主键 or 唯一约束列的时候生成，6bits
  - `trx_id`: 事务 id，6bits
  - `roll_ptr`: 回滚指针，7bits

```
| 变长字段长度列表 | NULL 值列表 | 记录头信息 | row_id | trx_id | roll_ptr | 列 1 val | 列 2 val | ... |
```

- 长度限制
  - 非 TEXT、BLOB 行总长度需 <= 65536 字节 = 2^16 bytes = 64KB
  - `VARCHAR(n)` 表示的是字符数，UTF-8 每个字符最大需要 3bytes
  - 一页为 16KB，单行溢出时，存放到溢出页上
  - Dynamic、Compressed 所有数据都在溢出页上

## InnoDB 数据页

- 物理不连续，逻辑连续
- 单向链表
- B+树，聚簇索引 / 非聚簇索引（二级索引）
- 索引覆盖（一次 B+ 树） / 回表（两次 B+ 树）

## 执行计划分析

- `EXPLAIN <sql>;` 查看执行计划

```sql
mysql> explain select * from todo;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | todo  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |   100.00 | NULL  |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.01 sec)
```

# 2. 索引篇

## 索引的作用 / 目的

- 索引的目标在于划定扫描边界
  - 范围查询（>、< 等）的时候，主 col 可以使用范围索引
  - 联合索引的后续字段是局部排序的，所以在前位 col 相同时后位索引才能生效

## 索引分类

- 数据结构：B+树、Hash、Full-text
- 物理存储：聚簇索引（主键索引）、二级索引（辅助索引）
- 字段特性：主键索引、唯一索引、普通索引、前缀索引
- 字段个数：单列索引、联合索引

### InnoDB 默认索引

- 主键
- 不含 NULL 唯一列
- 隐式 id

- InnoDB 主键跟二级索引都是使用 B+树索引

### 字段特性索引

- 主键索引

```sql
CREATE TABLE table_name  (
  ....
  PRIMARY KEY (index_column_1) USING BTREE
);
```

- 唯一索引：值唯一，不为 NULL

```sql
CREATE TABLE table_name  (
  ....
  UNIQUE KEY(index_column_1,index_column_2,...) 
);
```

```sql
CREATE UNIQUE INDEX index_name
ON table_name(index_column_1,index_column_2,...);
```

- 普通索引：可以不用 UNIQUE

```sql
CREATE TABLE table_name  (
  ....
  INDEX(index_column_1,index_column_2,...) 
);
```

```sql
CREATE INDEX index_name
ON table_name(index_column_1,index_column_2,...); 
```

- 前缀索引：字符串前缀，压缩索引占用空间

```sql
CREATE TABLE table_name(
    column_list,
    INDEX(column_name(length))
);
```

```sql
CREATE INDEX index_name
ON table_name(column_name(length)); 
```

### 字段个数索引

- 单列索引

- 联合索引
  - 最左匹配原则
  - 需要严格按照建立索引的顺序查找

## 常见场景 / 其他 feature

- 索引下推
  - old：二级索引回表后检查后续 where 过滤条件
  - new：回表前过滤剩余未用索引列

- 索引区分度计算

$$
区分度 = \frac{distinct(columns)}{count(*)}
$$

- 查询优化器
  - 命中百分比 > 30% 的时候忽略，直接进行全表扫描

- 联合索引能有效提升排序查询

## 使用场景

- 要
  - 字段具有唯一性
  - 经常使用 `WHERE`
  - 经常使用 `GROUP BY`、`ORDER BY` 的语句
- 不要
  - `WHERE`、`GROUP BY`、`ORDER BY` 没用到的
  - 大量重复值
  - 数据量少
  - 经常更新的字段 => 需要重新排序索引

## 索引优化

### 前缀索引优化

- for 大字符串字段

- 缺点
  - order by 无法使用索引 => `ORDER BY` 还是需要全量数据，没有划分搜索范围
  - 必须回表

### 覆盖索引优化

建立包含 query 语句需要的索引 => 避免回表

### 自增主键

新增记录总是追加页面

### NOT NULL

优化存储空间

### 防止索引失效

- `LIKE %xx` 左模糊会造成索引失效
- 最左匹配原则
- `OR` 包含非索引列也会失效

# 3. 事务篇

## 查看事务隔离级别

- `select @@global.tx_isolation` 系统隔离级别
- `select @@tx_isolation;` 5.0+ 事务/会话隔离级别
- `select @@transaction_isolation` 8.0+ 事务/会话隔离级别

https://blog.csdn.net/mameng1988/article/details/120842987
