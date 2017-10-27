--<author>
------------------------------------------------------------------------------------------
CREATE TABLE author
(
	--PK
	id          SERIAL       NOT NULL,

	--Fields
	firstname   VARCHAR(30)  NOT NULL,
	lastname    VARCHAR(30)  NOT NULL,
	
	CONSTRAINT pk_author PRIMARY KEY (id)  --PK               
);


--<book>
------------------------------------------------------------------------------------------
CREATE TABLE book
(
	--PK
	id        SERIAL       NOT NULL,

    --FK
    author_id INTEGER      NOT NULL,

	--Fields
	title     VARCHAR(100) NOT NULL,
    rating    INTEGER      NOT NULL,

	CONSTRAINT pk_book        PRIMARY KEY (id),                             --PK
    CONSTRAINT fk_book_author FOREIGN KEY (author_id) REFERENCES author(id) --FK
);


INSERT INTO author (firstname, lastname) VALUES
     ('J.K.',   'Rowling')        --1
	,('George', 'Martin')         --2
	,('Steven', 'King')           --3
	,('Mark',   'Twain');         --4
    
INSERT INTO book (title, author_id, rating) VALUES
     ('Harry Potter and the Philosopher''s Stone', 1,  8)  --1
	,('Harry Potter and the Chamber of Secrets',   1, 10)  --2
    ,('Harry Potter and the Prisoner of Azkaban',  1,  9)  --3
   
    ,('A Game of Thrones', 2, 10)                          --4
    ,('A Clash of Kings',  2, 9)                           --5
    ,('A Storm of Swords', 2, 7);                          --6
	
	
UPDATE book SET title = upper(title);