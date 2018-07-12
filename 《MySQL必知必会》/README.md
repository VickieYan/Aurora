# SQL必知必会
## 第1章 了解SQL
### 数据库基础
#### 什么是数据库
数据库：保存有组织的数据的容器

#### 表

相同的数据库中不能两次使用相同的表名

模式（schema)：关于数据库和表的布局及特性的信息

#### 列和数据类型

#### 行

#### 主键

每一行的**唯一**标识。

注意⚠️：

* 任意两行都不具有相同的主键值
* 每个行都必须具有一个主键值

### 什么是SQL

### 动手操作

## MySQL简介

### 什么是MySQL

MySQL是一种DBMS（数据库管理软件）。

#### 客户机-服务器软件

DBMS分为：

* 基于共享文件系统的DBMS（Microsoft Access)\
* 基于客户机-服务器的DBMS（MySQL）

#### MySQL版本

### MySQL工具

## 第3章 使用MySQL

### 连接

```shell
 mysql -uroot -proot
```

### 选择数据库

```shell
USE fierstdb；
```

### 了解数据库和表

获取数据库列表，当不知道有哪些表时用作查询

```shell
SHOW DATABASES;
```

获取数据库内可用表的列表

```shell
SHOW TABLES;
```

获取表内所有字段列表

```sql
SHOW COLUMNS FROM users;
```

其他语句：

```sql
SHOW STATUS; 显示广泛的服务器状态
SHOW GRANTS; 显示授予用户的安全权限
```

## 第4章 检索数据

### SELECT语句

### 检索单个列

```sql
SELECT username FROM users;
```

sql语句可以不区分大小写

### 检索多个列

```sql
SELECT username, password FROM users;
```

### 检索所有列

```sql
SELECT * FROM users;
```

### 检索不同的行

```sql
SELECT DISTINCT usernmae FROM users;
```

### 限制结果

```sql
SELECT username FROM users LIMIT 3;
```

### 使用完全限定的表名

```sql
SELECT user.username FROM users;
```

## 第5章 排序检索数据

### 排序数据

```sql
SELECT _id, usernmae, age FROM users ORDER BY age;
```

### 按多个列排序

```sql
SELECT _id, usernmae, age, level FROM users ORDER BY age, level;
```

### 指定排序方向

默认升序，加入DESC后降序

```sql
SELECT _id, usernmae, age, level FROM users ORDER BY age DESC, level;
```

组合 ORDER BY 和 LIMIT可以找出一个列中的最大最小值。

## 第6章 过滤数据

```sql
SELECT * FROM users WHERE age = 20;
```

WHERE和ORDER BY一起使用时，ORDER BY位于WHERE之后

### WHERE子句操作符

#### 检查单个值

#### 范围值检查

```sql
SELECT * FROM users WHERE age BETWEEN 18 AND 20;
```

### 空值检查

```sql
SELECT * FROM users WHERE age IS NULL;
```

## 第7章 数据过滤

### 组合WHERE子句

#### AND操作符

#### OR操作符

#### 计算次序

在处理OR操作符前，优先处理AND操作符

### IN操作符

功能和OR相同

```sql
SELECT * FROM users WHERE age in (17, 18);
```

### NOT操作符

```sql
SELECT * FROM users WHERE age not in (17, 18)
```

## 第8章 用通配符进行过滤

### LIKE操作符

#### %通配符

匹配多个字符

```sql
SELECT username FROM users WHERE username LIKE '%ason'
```

#### _通配符

匹配单个字符

## 第9章 用正则表达式进行搜索

### 使用MySQL正则表达式

#### 基本字符匹配

```sql
SELECT username FROM users WHERE username REGEXP '.ason'
```

区分大小写

```sql
SELECT username FROM users WHERE username REGEXP BINARY '.ason|.ickie'
```

#### 匹配几个字符之一

```sql
SELECT username FROM users WHERE username REGEXP '[JHK]ason'
```

#### 匹配范围

#### 匹配特殊字符串

\\\转义

```sql
SELECT username FROM users WHERE username REGEXP '\\.'
```

#### 匹配字符类

任意字母和数字 [a-zA-Z0-9]

#### 匹配多个实例

#### 定位符

## 第10章 创建计算字段

### 计算字段

### 拼接字段

RTrim去掉左边空格

```mysql
SELECT Concat(RTrim(username), '(', age, ')') FROM users;
```

使用别名

```sql
SELECT Concat(RTrim(username), '(', age, ')') AS username_age FROM users;
```

### 执行算术计算

```sql
SELECT 
	prod_id, 
	quantity, 
	item_price, 
	quantity*item_price AS expanded_price 
FROM orderitems;
```

## 第11章 使用数据处理函数

#### 函数

#### 文本处理函数

Length()

Upper()

Soundx()

#### 日期和时间处理函数

Date()

Year()

#### 数值处理函数

Abs()

Cos()

Exp() 指数值

## 第12章 汇总数据

### 聚集函数

```sql
SELECT AVG(age) AS age_avg from users;
```

COUNT() 计算某列行数

MAX()

MIN()

SUM()

### 组合聚集函数

## 第13章 分组数据

GROUP BY

```sql
SELECT age, COUNT(*) AS age_num FROM users GROUP BY age;
```

### 过滤分组

```sql
SELECT age, COUNT(*) AS age_num FROM users GROUP BY age HAVING COUNT(*) >=2;
```

### SELECT子句顺序

SELECT

FROM

WHERE

GROUP BY

HAVING

ORDER BY

LIMIT

## 第14章 使用子查询

### 利用子查询进行过滤

### 作为计算字段使用子查询

## 第15章 联结表

### 联结

#### 关系表

外键：外键为某个表中的一列，它包含另一个表的主键值，定义了两个表之间的关系。

### 创建联结

```sql
SELECT vend_name, prod_name, prod_price 
FROM vendors, products 
WHERE vendors.vnd_id = products.vend_id;
```



#### WHERE子句的重要性

#### 内部联结

```sql
SELECT vend_name, prod_name, prod_price 
FROM vendors INNER JOIN products 
ON vendors.vnd_id = products.vend_id;
```

#### 联结多个表

## 第16章 创建高级联结

### 使用别名

### 使用不同类型的联结

#### 自联结

#### 自然联结

#### 外部联结

这里讲一下inner join和outer join的一些点。

- **INNER JOIN（内连接,或等值连接）**：获取两个表中字段匹配关系的记录。
- **LEFT JOIN（左连接）：**获取左表所有记录，即使右表没有对应匹配的记录。
- **RIGHT JOIN（右连接）：** 与 LEFT JOIN 相反，用于获取右表所有记录，即使左表没有对应匹配的记录。

## 第19章 插入数据

### 数据插入

### 插入完整的行

```sql
INSERT INTO users VALUES(
	6,
    6,
    'Jerry',
    111,
    30,
    2,
    '2018-07-12 09:51:36',
    '2018-07-12 09:51:36'
);
```

虽然这种语法很简单，但并不安全，应该尽量避免使用。

推荐下面这种写法：

```sql
INSERT INTO users(
	id,
    _id,
    username,
    password,
    age,
    level,
    createAt,
    updateAt
)
VALUES(
	6,
    6,
    'Jerry',
    111,
    30,
    2,
    '2018-07-12 09:51:36',
    '2018-07-12 09:51:36'
)
```

### 插入检索出的数据

```sql
INSERT INTO mfwUsers(
	id,
    _id,
    username,
    password,
    age,
    level,
    createAt,
    updateAt
)
SELECT id,
    _id,
    username,
    password,
    age,
    level,
    createAt,
    updateAt
FROM users
```

## 第20章 更新和删除数据

### 更新数据

```sql
UPDATE users
SET username = 'Helen'
WHERE id = 3
```

### 删除数据

```sql
DELETE FROM users WHERE id = 5;
```

## 第21章 创建和操纵表

### 创建表

```sql
CREATE TABLE customers(
	cust_id int N
)
```

### 更新表

```sql
ALTER TABLE users ADD phone_numb CHAR(20);
```

### 删除表

```sql
DROP TABLE users;
```

### 重命名表

```sql
RENAME TABLE users TO customers;
```



