DROP TABLE orders;

CREATE TABLE orders(
   orderNumber serial primary key,
   email VARCHAR(400) NOT NULL,
   status INT NOT NULL,
   cost VARCHAR(400) NOT NULL,
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

INSERT INTO orders(email, status, cost, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES ('test1@gmail.com', 0, '25', false, 'Kolarov', '11', 'post', 'hero', 'current', 'manchesterCity', 'home');

INSERT INTO orders(email, status, cost, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES ('test1@gmail.com', 0, '25', false, 'Sterling', '7', 'post', 'hero', 'current', 'manchesterCity', 'home');

INSERT INTO orders(email, status, cost, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES ('test2@gmail.com', 1, '25', false, 'Rowland', '17', 'bring', 'custom', 'previous', 'chelsea', 'away');

INSERT INTO orders(email, status, cost, sleeve, kitName, kitNumber, deliveryType, printingType, style, club, strip) 
	VALUES ('test3@gmail.com', 2, '25', false, 'Edwards', '12', 'post', 'custom', 'current', 'arsenal', 'home');

INSERT INTO orders(email, status, cost, sleeve, kitName, kitNumber, deliveryType, printingType, style, colour, letter) 
	VALUES ('test4@gmail.com', 0, '25', false, 'Ralph', '4', 'post', 'custom', 'current', 'black', 'straight');
