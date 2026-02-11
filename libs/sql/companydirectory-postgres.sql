-- Create location table
CREATE TABLE IF NOT EXISTS location (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Create department table
CREATE TABLE IF NOT EXISTS department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  locationID INT NOT NULL,
  CONSTRAINT FK_department_location FOREIGN KEY (locationID) REFERENCES location (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create personnel table
CREATE TABLE IF NOT EXISTS personnel (
  id SERIAL PRIMARY KEY,
  lastName VARCHAR(50) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  jobTitle VARCHAR(50) DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  departmentID INT NOT NULL,
  CONSTRAINT FK_personnel_department FOREIGN KEY (departmentID) REFERENCES department (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert locations (original data)
INSERT INTO location (id, name) VALUES
(1,'London'),
(2,'New York'),
(3,'Paris'),
(4,'Munich'),
(5,'Rome');

-- Insert departments (original data)
INSERT INTO department (id, name, locationID) VALUES
(1,'Human Resources',1),
(2,'Sales',2),
(3,'Marketing',2),
(4,'Legal',1),
(5,'Services',1),
(6,'Research and Development',3),
(7,'Training',4),
(8,'Accounting',5),
(9,'Support',1),
(10,'Management',2),
(11,'Engineering',3),
(12,'Quality Assurance',4);

-- Insert personnel (original 100 employees)
INSERT INTO personnel (id, lastName, firstName, jobTitle, email, departmentID) VALUES
(1,'Hunnisett','Lorenza','Electrical Engineer','lhunnisett0@about.com',6),
(2,'Sdismissed','Kaine','Systems Administrator','kdismissed1@tinyurl.com',11),
(3,'Sloley','Lyell','Software Test Engineer','lsloley2@washington.edu',12),
(4,'Ganter','Ulberto','Business Systems Analyst','uganter3@scientificamerican.com',11),
(5,'Markie','Cesare','Project Manager','cmarkie4@google.co.uk',10),
(6,'Peplay','Geraldine','Internal Auditor','gpeplay5@apple.com',8),
(7,'Eardley','Allin','Research Associate','aeardley6@businessinsider.com',6),
(8,'Lacroux','Kendre','Office Assistant','klasroux7@elegantthemes.com',5),
(9,'Andreichik','Tait','Product Engineer','tandreichik8@unc.edu',11),
(10,'Danzelman','Susie','Staff Accountant','sdanzelman9@csmonitor.com',8),
(11,'Baldini','Nealson','Chief Design Engineer','nbaldinia@yahoo.co.jp',11),
(12,'Gavan','Aloisia','Marketing Manager','agavanb@forbes.com',3),
(13,'Oran','Carmine','Database Administrator','coranc@fc2.com',11),
(14,'Garrals','Kerrill','Human Resources Assistant','kgarralsd@wufoo.com',1),
(15,'Mildmott','Paco','Programmer Analyst','pmildmotte@dailymail.co.uk',11),
(16,'Bullan','Sutherlan','Programmer Analyst','sbullanf@constantcontact.com',11),
(17,'Colley','Timotheus','Operator','tcolleyg@biblegateway.com',9),
(18,'Puden','Pia','Electrical Engineer','ppudenh@cnn.com',6),
(19,'Runchman','Doll','Payment Adjustment Coordinator','drunchmani@intel.com',8),
(20,'Fallow','Clayborne','Food Chemist','cfallowj@sun.com',6),
(21,'Harp','Caryn','Registered Nurse','charpk@livejournal.com',9),
(22,'Grzelewski','Timotheus','Professor','tgrzelewskil@shareasale.com',7),
(23,'Kerfod','Cullie','GIS Technical Architect','ckerfodm@hao123.com',11),
(24,'Pimm','Leena','Registered Nurse','lpimmn@123-reg.co.uk',9),
(25,'Luetkemeyer','Derick','Compensation Analyst','dluetkemeyero@moonfruit.com',1),
(26,'Goschalk','Sargent','Senior Financial Analyst','ggoschalkp@google.com.br',8),
(27,'Baggalley','Sher','VP Product Management','sbaggalleyq@techcrunch.com',10),
(28,'Bartolomivis','Gerri','Budget Analyst','gbartolomivisr@ehow.com',8),
(29,'Beran','Daisey','Electrical Engineer','dberans@netlog.com',6),
(30,'Casajuana','Karia','Sales Representative','kcasajuanat@weather.com',2),
(31,'Gepp','Agna','Information Systems Manager','ageppu@sun.com',11),
(32,'Fancutt','Jamison','Cost Accountant','jfancuttv@amazon.co.jp',8),
(33,'Ellam','Wally','VP Marketing','wellamw@auda.org.au',3),
(34,'Bevar','Ange','Business Systems Analyst','abevarx@sciencedaily.com',11),
(35,'Crippes','Obediah','Assistant Manager','ocrippesy@vk.com',10),
(36,'Cawkill','Silvana','Chemical Engineer','scawkillz@samsung.com',6),
(37,'Phipson','Inna','VP Sales','iphipson10@furl.net',2),
(38,'McAllen','Emory','Marketing Assistant','emcallen11@china.com.cn',3),
(39,'Ivanusyev','Madeleine','Assistant Manager','mivanusyev12@phpbb.com',10),
(40,'Penney','Linette','Paralegal','lpenney13@deviantart.com',4),
(41,'Sahlstrom','Norrie','Senior Quality Engineer','nsahlstrom14@rakuten.co.jp',12),
(42,'Huby','Gayla','Accountant','ghuby15@cisco.com',8),
(43,'Penchen','Grier','Account Coordinator','gpenchen16@altervista.org',2),
(44,'Allbut','Kearney','Electrical Engineer','kallbut17@arstechnica.com',6),
(45,'Zappel','Darryl','Financial Analyst','dzappel18@tmall.com',8),
(46,'Chestnutt','Meredithe','Structural Engineer','mchestnutt19@springer.com',11),
(47,'Dufour','Noelle','Technical Writer','ndufour1a@google.ca',11),
(48,'Lorryman','Antonella','Quality Control Specialist','alorryman1b@cocolog-nifty.com',12),
(49,'Skitch','Nicola','Civil Engineer','nskitch1c@adobe.com',11),
(50,'Braunlein','Corinne','Software Test Engineer','cbraunlein1d@163.com',12),
(51,'Cokayne','Karie','Occupational Therapist','kcokayne1e@independent.co.uk',9),
(52,'Meert','Grantham','Help Desk Operator','gmeert1f@ebay.co.uk',9),
(53,'McCaughran','Jeannie','Nurse Practicioner','jmccaughran1g@sogou.com',9),
(54,'Drewett','Kilian','Account Coordinator','kdrewett1h@state.gov',2),
(55,'Abramsky','Edan','Data Coordinator','eabramsky1i@google.ru',11),
(56,'Gerge','Lula','Office Assistant','lgerge1j@webnode.com',5),
(57,'Tock','Walton','Human Resources Assistant','wtock1k@epa.gov',1),
(58,'Carek','Lyndsey','Marketing Manager','lcarek1l@prweb.com',3),
(59,'Deplacido','Ardyce','Budget Analyst','adeplacido1m@storify.com',8),
(60,'Gowans','Myriam','Sales Associate','mgowans1n@cbslocal.com',2),
(61,'Stanlock','Artemas','Operator','astanlock1o@topsy.com',9),
(62,'McConway','Shawnee','Geological Engineer','smcconway1p@51.la',6),
(63,'Merrywether','Emelina','Junior Executive','emerrywether1q@addtoany.com',10),
(64,'Mularkey','Tiffanie','Programmer Analyst','tmularkey1r@cnbc.com',11),
(65,'Wallas','Kriste','VP Accounting','kwallas1s@tiny.cc',8),
(66,'Brechin','Brnaba','Office Assistant','bbrechin1t@alibaba.com',5),
(67,'Boules','Cristionna','Chemical Engineer','cboules1u@123-reg.co.uk',6),
(68,'Mallebone','Evelin','Electrical Engineer','emallebone1v@google.it',6),
(69,'Frisch','Rianon','Programmer Analyst','rfrisch1w@businessweek.com',11),
(70,'Aicken','Myrle','Community Outreach Specialist','maicken1x@ameblo.jp',9),
(71,'Leaning','Wilone','Internal Auditor','wleaning1y@addtoany.com',8),
(72,'Stobbes','Nedi','Administrative Officer','nstobbes1z@mozilla.com',5),
(73,'Woolhouse','Ricoriki','Electrical Engineer','rwoolhouse20@elegantthemes.com',6),
(74,'de Tocqueville','Karilynn','Environmental Specialist','kdetocqueville21@utexas.edu',6),
(75,'Goadbie','Brena','Automation Specialist','bgoadbie22@soundcloud.com',11),
(76,'Lanham','Haily','VP Marketing','hlanham23@soundcloud.com',3),
(77,'Eathorne','Sigismond','Cost Accountant','seathorne24@ezinearticles.com',8),
(78,'Naisbit','Kanya','Quality Control Specialist','knaisbit25@cbslocal.com',12),
(79,'Luard','Berget','Recruiter','bluard26@amazon.de',1),
(80,'Antonias','Clarine','Paralegal','cantonias27@utexas.edu',4),
(81,'Ellson','Sherwood','Software Consultant','sellson28@reverbnation.com',11),
(82,'Rubinsaft','Marice','Registered Nurse','mrubinsaft29@imgur.com',9),
(83,'Larkcum','Arty','Sales Associate','alarkcum2a@wordpress.org',2),
(84,'Bettenson','Bernadene','Data Coordinator','bbettenson2b@goo.ne.jp',11),
(85,'Bladesmith','Hamish','Human Resources Manager','hbladesmith2c@etsy.com',1),
(86,'Parussi','Clemmie','Staff Accountant','cparussi2d@amazonaws.com',8),
(87,'Greve','Angie','Social Worker','agreve2e@dell.com',9),
(88,'Ivanichev','Orelee','Analyst Programmer','oivanichev2f@amazon.com',11),
(89,'Druce','Risa','Project Manager','rdruce2g@elegantthemes.com',10),
(90,'Lerego','Deina','Community Outreach Specialist','dlerego2h@cnbc.com',9),
(91,'Neasam','Darice','Environmental Specialist','dneasam2i@usatoday.com',6),
(92,'Daintry','Julienne','Pharmacist','jdaintry2j@photobucket.com',9),
(93,'Blumsom','Gale','Quality Engineer','gblumsom2k@naver.com',12),
(94,'Flory','Inesita','Human Resources Assistant','iflory2l@prlog.org',1),
(95,'Andrzej','Marjie','Graphic Designer','mandrzej2m@scribd.com',3),
(96,'Manske','Dorey','Quality Control Specialist','dmanske2n@rambler.ru',12),
(97,'Mawd','Cassandry','Sales Representative','cmawd2o@printfriendly.com',2),
(98,'Duffet','Annabela','Safety Technician','aduffet2p@sciencedaily.com',12),
(99,'Milborn','Ashlan','Structural Analysis Engineer','amilborn2q@skyrock.com',11),
(100,'Wapole','Brenna','Software Engineer','bwapole2r@netvibes.com',11);

-- Reset sequences to continue from last inserted ID
SELECT setval('location_id_seq', (SELECT MAX(id) FROM location));
SELECT setval('department_id_seq', (SELECT MAX(id) FROM department));
SELECT setval('personnel_id_seq', (SELECT MAX(id) FROM personnel));
