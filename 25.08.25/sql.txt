show databases;
use sathyabama;
show tables;

select * from ece;
select * from cse;

show tables;
create table categories (
  cid int not null primary key,
  cname varchar(30) not null,
  cdes varchar(50) not null
);
create table products (
  pid int not null primary key,
  pname varchar(30) not null,
  pdes varchar(40) not null,
  cid int not null,
  foreign key (cid) references categories (cid)
  on update cascade
  on delete cascade
);
insert into categories (cid, cname, cdes) values
(1, 'mobile', 'good'),
(2, 'watch', 'nice'),
(3, 'laptop', 'fast');
insert into products (pid, pname, pdes, cid) values
(101, 'iphone', 'apple phone', 1),
(102, 'samsung', 'android phone', 1),
(103, 'rolex', 'luxury watch', 2),
(104, 'dell', 'work laptop', 3);

select * from categories;
select * from products;

update categories set cid=10 where cid=1;
delete from categories where cid = 2;

create table college (
    college_id int primary key,
    college_name varchar(50) not null
);
create table department (
    dept_id int primary key,
    dept_name varchar(50) not null,
    college_id int,
    foreign key (college_id) references college(college_id)
    on update cascade
    on delete cascade
);
create table student (
    student_id int primary key,
    student_name varchar(50) not null,
    dept_id int,
    foreign key (dept_id) references department(dept_id)
    on update cascade
    on delete cascade
);
insert into college (college_id, college_name) values
(1, 'ABC College'),
(2, 'XYZ College');
insert into department (dept_id, dept_name, college_id) values
(101, 'CSE', 1),
(102, 'ECE', 1),
(201, 'MECH', 2);
insert into student (student_id, student_name, dept_id) values
(1001, 'Alice', 101),
(1002, 'Bob', 101),
(1003, 'Charlie', 102),
(1004, 'David', 201);

update college
set college_id = 10
where college_id = 1;

select * from college;
select * from department;

delete from college
where college_id = 2;

select * from college;
select * from department;
select * from student;

update department
set dept_id = 110
where dept_id = 101;

select * from department;
select * from student;

#aliases
select student_name as name, dept_id as department
from student;
select dept_id as id, dept_name as name from department;

#like
select * from student where student_name like 'a%';
select * from student where student_name like '%n';
select * from student where student_name like '%ar%';
select * from student where student_name like '_a%';

#views
create view student_view as
select student_name, dept_id
from student;
select * from student_view;

create or replace view dept_view as
select dept_id, dept_name
from department;
select * from dept_view;

drop view student_view;