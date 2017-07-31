DROP TABLE shirts;
DROP TABLE statuses;
DROP TABLE orders;

CREATE TABLE orders(
   orderNumber serial primary key,
   name VARCHAR(400) NOT NULL,
   address VARCHAR(400) NOT NULL,
   email VARCHAR(400) NOT NULL,
   telephone VARCHAR(400) NOT NULL,
   cost INT NOT NULL
);

CREATE TABLE statuses(
   statusID serial primary key,
   orderNumber serial NOT NULL references orders(orderNumber),
   dateChanged timestamp NOT NULL,
   description VARCHAR(400) NOT NULL
);

CREATE TABLE shirts(
   shirtID serial primary key,
   orderNumber serial NOT NULL references orders(orderNumber),
   sleeve BOOLEAN NOT NULL,
   kitName VARCHAR(400) NOT NULL,
   kitNumber VARCHAR(400) NOT NULL,
   deliveryType VARCHAR(400) NOT NULL,
   printingType VARCHAR(400) NOT NULL,
   style VARCHAR(400) NOT NULL,
   club VARCHAR(400),
   strip VARCHAR(400),
   colour VARCHAR(400),
   letter VARCHAR(400)
);

INSERT INTO orders(name, address, email, mobile, cost) 
   VALUES ('James Adams', '123 test lane, test street, test', '07777777777', 'test@gmail.com', 25);

INSERT INTO orders(name, address, email, mobile, cost) 
   VALUES ('Harley Rowland', '82 test road, test street, test', '07777777777', 'test1@gmail.com', 32);

INSERT INTO orders(name, address, email, mobile, cost) 
   VALUES ('Sam Jones', '82 test road, test street, test', '07777777777', 'test1@gmail.com', 29);

INSERT INTO orders(name, address, email, mobile, cost) 
   VALUES ('Tom Smith', '26 test street, test street, test', '07777777777', 'test2@gmail.com', 27);

INSERT INTO orders(name, address, email, mobile, cost) 
   VALUES ('Ryan Johannson', '6 test avenue, test street, test', '07777777777', 'test3@gmail.com', 25);

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (1, now(), 'Waiting for shirt');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (2, now(), 'Shirt Recieved');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (2, now(), 'Waiting for shirt');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (2, now(), 'Shirt Sent Back');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (3, now(), 'Waiting for shirt');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (4, now(), 'Waiting for shirt');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (4, now(), 'Shirt Recieved');

INSERT INTO statuses(orderNumber, dateChanged, description)
   VALUES (5, now(), 'Waiting for shirt');

INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES (1, false, 'Kolarov', '11', 'post', 'hero', 'current', 'manchesterCity', 'home');

INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
   VALUES (1, false, 'Rooney', '9', 'post', 'hero', 'current', 'everton', 'home');

INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES (2, true, 'Sterling', '7', 'post', 'hero', 'current', 'manchesterCity', 'home');

INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES (3, false, 'Rowland', '17', 'bring', 'custom', 'previous', 'chelsea', 'away');

INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES (4, true, 'Edwards', '12', 'post', 'custom', 'current', 'arsenal', 'home');

INSERT INTO shirts(orderNumber, sleeve, kitName, kitNumber, deliveryType, printingType, style, colour, letter) 
	VALUES (5,false, 'Ralph', '4', 'post', 'custom', 'current', 'black', 'straight');
