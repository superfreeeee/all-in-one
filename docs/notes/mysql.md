# MySQL

https://xiaolincoding.com/mysql/

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

https://www.cnblogs.com/klvchen/p/10137117.html

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

- `select_type` 查询类型

```ts
type select_type = 
  | 'SIMPLE'       // 简单查询
  | 'PRIMARY'      // 最外层查询
  | 'SUBQUERY'     // 映射为子查询
  | 'DERIVED'      // 子查询
  | 'UNION'        // 联合
  | 'UNION RESULT' // 使用联合的结果
```

- `table` 查看表名
- `type` 查询方法
  - 性能：`all < index < range < index_merge < ref_or_null < ref < eq_ref < system/const`

```ts
type type =
  | 'ALL'         // 全表扫描
  | 'index'       // 全索引表扫描
  | 'RANGE'       // 索引列范围
  | 'INDEX_MERGE' // 合并索引
  | 'REF'         // 非唯一索引扫描
  | 'EQ_REF'      // 唯一索引扫描
  | 'CONST'       // 常量，只匹配一行
  | 'SYSTEM'      // 系统值，特殊 CONST
```

- `possible_keys` 可能使用索引
- `key` 实际使用索引
- `key_len` 索引列长度
- `rows` 扫描行数

# 2. 索引篇 Index

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

## 常见特性 feature

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

## 关于 B+ 树

### 为什么是 B+ 树

- 排序数组 => 二分查找 => 线性 => `O(n)`
- 二分查找树(BST = Binary Search Tree) => `O(logn)`
  - 高度随数据量增加快速增加 => 高度（depth） = 对应磁盘搜索（I/O）次数
  - 极端场景变成链表 => 退化成 `O(n)`
- 二分查找平衡树(AVL)
  - 自平衡，保证高度可控
  - 变种：红黑树

- 二叉 => 扩展成 M叉 => B 树
- B树 = M叉搜索树 `(节点 = 索引 + 数据)`
  - 数据大 => 搜索过程必须翻页 => I/O 增加
  - 无冗余节点 => `CREATE / DELETE` 时存在变形
- B+树 `(非叶节点 = 索引) + (叶节点 = 数据)`
  - 非叶节点可以保存更多索引 => 减少 I/O
  - 数据下沉到叶节点，增加平均 depth 距离，但是减少 I/O 次数 => 磁盘搜索 转移成 内存搜索
  - 有冗余节点 => `CREATE / DELETE` 时不变形 => 最小化磁盘 I/O
  - 叶子结点存在额外指针

### 单表上限

https://xiaolincoding.com/mysql/index/2000w.html#mysql-%E5%8D%95%E8%A1%A8%E4%B8%8D%E8%A6%81%E8%B6%85%E8%BF%87-2000w-%E8%A1%8C-%E9%9D%A0%E8%B0%B1%E5%90%97

- 设定索引、行数据，可以计算得到深度为 3 的时候能存储 2000w 行数据（or 500w 行）
- 超过时会直接增加 B+ 树深度

## 索引失效

### 左模糊匹配

`LIKE %xxx` 或是 `LIKE %xxx%`

### 索引 + 函数

- MySQL 8.0 支持针对函数进行索引

### 索引 + 表达式

经过运算就无法确定原始值顺序

### 隐式类型转换

### 联合索引非最左匹配

- MySQL 5.6 开始支持索引下推，可以优化部分联合索引 => 减少回表

### WHERE + OR

- `OR` 的每个字段都需要包含在索引内 => 会使用索引合并 => 一样可以缩减范围

## 特殊 case

### 全字段都有索引

这时候可能退化成全扫描二级索引，而不需要全表扫描

### `COUNT(1)` 与 `COUNT(*)`

$$
count(*) = count(1) > count(PRIMARY KEY) > COUNT(COL)
$$

- `count` 会记录非 NULL 记录数量

- `count(PRIMARY KEY)` => 索引覆盖
  - 走聚簇索引
  - 走二级索引
- `count(1)` => 任何记录都 +1 就行了
  - 走聚簇索引
  - 走二级索引
- `count(*)` => `count(0)` = `count(1)`
  - 走 `key_len` 最小的二级索引
- `count(COL)`
  - 全表扫描
  - 需要记录非 NULL => 建立索引 => 走 `WHERE` 查询优化

- 为什么 `count` 要遍历
  - MVCC 支持事务，无法确定动态行数

- `count` 优化
  - 使用 `EXPLAIN` 命令的 `rows`
  - 额外表计数

# 3. 事务篇 Transaction

## 事务特性

- 原子性 Atomicity: 要嘛全完成，要嘛全部不完成
- 一致性 Consistency: 操作前后总体状态一致，可以理解为 batch set
- 隔离性 Isolation: 多事务同时使用数据不干扰
- 持久性 Durability: 事务处理持久化

- 实现
  - Durability: redo log 重做日志
  - Atomicity: undo log 回滚日志
  - Isolation: MVCC 多版本并发控制 / 锁机制
  - Consistency := Durability + Atomicity + Isolation

## 并发问题

- 脏读: 一个事务读到另一个事务未提交的修改后数据
- 不可重复读: 一个事务前后**同一个数据**不一致
- 幻读 `Phantom Read`: 一个事务前后**记录数量**不一致

- 严重程度: 脏读 > 不可重复读 > 幻读

## 隔离机制

### 隔离级别

https://xiaolincoding.com/mysql/transaction/mvcc.html#%E4%BA%8B%E5%8A%A1%E7%9A%84%E9%9A%94%E7%A6%BB%E7%BA%A7%E5%88%AB%E6%9C%89%E5%93%AA%E4%BA%9B

- 读未提交 `read uncommitted`: 事务能看到**未提交变更**
- 读提交 `read committed`: 事务只能看到被**提交的变更**
- 可重复读 `repeatable read`: 事务看到启动时的视图
- 串行化 `serializable`: 读写锁

- InnoDB 默认实现 `repeatable read`
  - 快照读 = 普通 `select`: 使用 MVCC 解决幻读
  - 当前读 = `select for update`: 使用 `next-key lock` 记录锁 + 间隙锁

### 不同隔离级别可发生的问题

| 隔离级别                    | 可能问题               |
| --------------------------- | ---------------------- |
| 读未提交 `read uncommitted` | 脏读、不可重复读、幻读 |
| 读提交 `read committed`     | 不可重复读、幻读       |
| 可重复读 `repeatable read`  | 幻读                   |
| 串行化 `serializable`       |                        |

### 隔离级别实现

- 读未提交 `read uncommitted`: 都可以读
- 读提交 `read committed`: 每个语句的 `ReadView`
- 可重复读 `repeatable read`: 每个事务的 `ReadView`
- 串行化 `serializable`: 读写锁

- ReadView 实现 + 可重复读/读提交解析

https://xiaolincoding.com/mysql/transaction/mvcc.html#read-view-%E5%9C%A8-mvcc-%E9%87%8C%E5%A6%82%E4%BD%95%E5%B7%A5%E4%BD%9C%E7%9A%84

## 幻读失效

1. 事务更新别的事务创建的纪录
  - 不要去操作看不到的数据
  - 操作涉及 `update` 就要先 `select for update`
2. 先快照读，后当前读 => 上锁时机晚
  - `for update` 提到最前

## 查看事务隔离级别

- `select @@global.tx_isolation` 系统隔离级别
- `select @@tx_isolation;` 5.0+ 事务/会话隔离级别
- `select @@transaction_isolation` 8.0+ 事务/会话隔离级别

https://blog.csdn.net/mameng1988/article/details/120842987

# 4. 锁篇 Lock

- 加锁范围
  - 全局锁
  - 表级锁
  - 行级锁

## 全局锁

```sql
-- 上锁 => 全局只读
flush tables with read lock;

-- 解锁
unlock tables;
```

- 应用场景: 全库逻辑备份
- `mysqldump` 会开启可重复读事务
- MyISAM 不支持 => 全局锁

## 表级锁

- 表锁
- 元数据锁 MDL
- 意向锁  
- AUTO-INC 锁

### 表锁

```sql
-- 读锁
lock tables t_student read;

-- 写锁
lock tables t_student write;

-- 解锁
unlock tables;
```

### 元数据锁 MDL

- CRUD = MDL 读锁
- 表结构变更 = MDL 写锁

### 意向锁

- 行共享锁前 => 意向共享锁
- 行独占锁前 => 意向独占锁 = `insert, update, delete` 前

```sql
-- 读 + 意向共享锁
select ... lock in share mode;

-- 读 + 意向独占锁
select ... for update;
```

- 无意向锁 => 遍历所有记录检查锁
- 有意向锁 => 不用遍历

### AUTO-INC 锁

- 插入语句结束释放
- MySQL 5.1.22 实现轻量级锁，只锁 `AUTO_INCREMENT` 的字段，不需要等待整条记录插入
  - `innodb_autoinc_lock_mode` 变量控制
  - `innodb_autoinc_lock_mode = 0` 语句结束释放
  - `innodb_autoinc_lock_mode = 2` 轻量级锁，生成后就释放
  - `innodb_autoinc_lock_mode = 1`
    - 普通 `insert` => 生成后释放
    - 批量插入 `insert ... select` => 插入结束后释放

- 主从复制场景下，binlog 内 `insert` 语句不连贯
  - `binlog_format = row` 使用主库的自增值

## 行级锁

- Record Lock 记录锁
- Gap Lock 间隙锁
- Next-Key Lock = Record Lock + Gap Lock

### Record Lock 记录锁

- X型/S型，类似写/读锁

```sql
-- S型 => 类似读锁
select ... lock in share mode;

-- X型 => 类似写锁
select ... for update;
```

### Gap Lock 间隙锁

- 防止插入范围内记录
- 找到第一个大于范围的记录，与前一条记录，形成区间锁
- `(x, y]` 前开后闭区间

### Next-Key Lock

防止插入 + 修改

## MySQL 如何加锁

- 加锁的对象是索引，基本单位是 next-key lock => 退化成其他两种

### 加锁分析

```sql
select * from performance_schema.data_locks\G;
```

- LOCK_TYPE: 锁级别
  - TABLE 表级锁
  - RECORD 行级锁
- LOCK_MODE: 加锁类型
  - IX: X型意向锁
  - `X`: next-key 锁
  - `X, GAP`: 间隙锁
  - `X, REC_NOT_GAP`: 记录锁
- LOCK_DATA

### 唯一索引 + 等值查询

- 记录存在 => Record Lock
- 记录不存在 => Gap Lock

### 唯一索引 + 范围查询

# 5. 日志篇 Log

- undo log 回滚日志: 保证一致性
  - 事务回滚、MVCC
- redo log 重做日志: 保证持久性
  - 场景：掉电故障恢复
- binlog 归档日志
  - 数据备份、主从复制

## undo log 回滚日志

- 插入记录: 保留主键 id
  - 回滚: 删除记录
- 删除记录: 保留记录内容
  - 回滚: 恢复记录
- 更新记录: 保留旧值
  - 回滚: 更新为旧值

- 行记录
  - `trx_id` 记录操作的事务 id
  - `roll_pointer` 回滚日志地址

- 通过 ReadView + undo log 实现 MVCC 多版本并发控制
- 刷盘时间与一致性由 redo log 保证

## Buffer Pool 缓存池
