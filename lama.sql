-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: lama-mysql:3306
-- Generation Time: Jun 26, 2022 at 06:41 PM
-- Server version: 8.0.29
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lama`
--

-- --------------------------------------------------------

--
-- Table structure for table `alembic_version`
--

CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alembic_version`
--

INSERT INTO `alembic_version` (`version_num`) VALUES
('a6ea72042021');

-- --------------------------------------------------------

--
-- Table structure for table `artifact`
--

CREATE TABLE `artifact` (
  `id` int NOT NULL,
  `identifier` varchar(64) NOT NULL,
  `data` text NOT NULL,
  `start` int DEFAULT NULL,
  `end` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `artifact`
--

INSERT INTO `artifact` (`id`, `identifier`, `data`, `start`, `end`, `parent_id`, `p_id`) VALUES
(1, '2FA3F', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus interdum at justo at feugiat. In sed venenatis elit. Proin arcu libero, dignissim nec mollis eu, efficitur eu magna. Ut blandit iaculis elit et rhoncus. Mauris id sapien imperdiet, interdum augue at, aliquam nisl. Vivamus placerat efficitur tortor, vitae tristique neque egestas ac. Ut mattis odio vestibulum varius feugiat. Morbi a dolor sit amet nisi consectetur sagittis in eget leo. Etiam sit amet efficitur lorem. Sed nec massa sem.', NULL, NULL, NULL, 1),
(2, '2FA3F', 'Cras pulvinar enim sed posuere molestie. Integer ultrices, leo sit amet hendrerit sodales, diam dui scelerisque nulla, vitae ullamcorper nulla purus ut magna. Cras elementum vitae augue ut maximus. Donec fringilla pellentesque dapibus. Proin non nisl sed sem laoreet luctus a nec leo. Nunc accumsan turpis et orci dictum, vitae efficitur ex ultricies. Nam consectetur, ipsum eget fringilla ultrices, nisi lacus mollis arcu, vitae varius tellus massa eu eros. Pellentesque eget sollicitudin massa, id mollis turpis. Vestibulum in lorem sit amet ligula pulvinar pellentesque eget in leo. Suspendisse blandit, purus non sagittis tempus, sem elit sodales risus, eleifend porttitor metus nunc a ligula. Cras venenatis ex a mi suscipit ornare. In fringilla sit amet ipsum ut molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus.', NULL, NULL, NULL, 1),
(3, '2FA3F', 'Fusce sagittis massa felis, sit amet finibus nibh placerat quis. Vestibulum ut velit ut dolor ultrices pharetra a sit amet neque. Nullam feugiat nunc in ex tincidunt, aliquam scelerisque orci molestie. Phasellus vehicula nulla nec arcu tempus, non placerat felis fermentum. Donec ligula felis, congue nec feugiat sed, venenatis sit amet nunc. Maecenas condimentum accumsan orci a euismod. Fusce maximus ipsum eget enim maximus, a vestibulum tellus rhoncus. Quisque laoreet gravida leo quis sagittis. Aliquam fermentum porttitor orci, eget venenatis turpis accumsan a. Praesent fermentum at eros sit amet consequat. Quisque aliquam lorem massa, at elementum tortor porttitor sit amet. Maecenas mollis neque id tempor luctus. Nam ornare ligula a ornare mattis.', NULL, NULL, NULL, 1),
(4, '2FA3F', 'Pellentesque dui purus, cursus id neque eu, bibendum bibendum nisl. Cras elementum ipsum suscipit pulvinar rhoncus. Duis elementum sit amet leo vitae vehicula. Suspendisse rutrum ut turpis ornare lobortis. Donec pretium, urna eu mollis auctor, arcu sapien ultricies leo, ut tincidunt magna metus eu odio. Cras vel velit felis. Vestibulum congue fermentum augue, in efficitur velit feugiat id. Suspendisse ut mauris sed mauris tempor tincidunt. Aliquam vehicula, diam eget pretium ullamcorper, mi magna hendrerit nibh, at commodo arcu lacus porta erat. Nam quam tortor, vulputate vitae velit quis, lobortis vestibulum tortor. Praesent quam nisi, malesuada eget suscipit sit amet, euismod sit amet arcu. Mauris commodo posuere arcu, sit amet vulputate tortor ultrices iaculis. Vestibulum pretium elit non suscipit commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;', NULL, NULL, NULL, 1),
(5, '2FA3F', 'Cras luctus fringilla erat ac laoreet. Praesent in tincidunt ex, nec vehicula urna. Proin aliquam egestas pharetra. Donec volutpat malesuada tortor. Pellentesque a nulla id augue molestie semper ac et tortor. Duis dapibus neque a erat pulvinar pulvinar. Vestibulum quis dolor eget tortor eleifend tempus nec in diam. Aliquam lacinia velit sit amet egestas eleifend. Mauris facilisis, lacus eget faucibus ultrices, sem justo sollicitudin diam, vitae fermentum turpis lorem eget tortor. Vestibulum ligula ante, eleifend vitae cursus quis, iaculis ac orci.', NULL, NULL, NULL, 1),
(6, '2FA3F', 'Nunc aliquam lobortis metus at sagittis. Aenean aliquet rutrum eros dapibus tempor. Etiam bibendum enim id elementum varius. Fusce feugiat elit nisi, nec fringilla odio hendrerit a. Aenean id velit in justo sodales lacinia a in ante. Aenean malesuada nisi interdum, ultrices urna eget, bibendum leo. Aenean nisi diam, congue at molestie eget, aliquet vel lacus. Nunc euismod non nisi tincidunt auctor. Duis fringilla, libero sit amet viverra lobortis, diam nulla ullamcorper diam, ut aliquet est risus in nunc. Pellentesque iaculis tortor eu lacinia euismod. Quisque convallis odio malesuada purus faucibus, vel finibus ex ullamcorper. Nam sed mi vestibulum, viverra erat egestas, interdum enim.', NULL, NULL, NULL, 1),
(7, '2FA3F', 'Cras diam enim, hendrerit vel sem at, convallis ornare ex. In viverra dui vitae sodales ullamcorper. Duis semper tempus justo non finibus. Maecenas at tempus nibh, ac fringilla ex. Phasellus ac interdum odio. Nulla facilisi. In dapibus, mi non mollis congue, nibh nunc malesuada purus, sed mollis orci libero at neque.', NULL, NULL, NULL, 1),
(8, '2FA3F', 'Vestibulum id condimentum nulla. Nunc dignissim orci ut euismod tempus. Morbi velit felis, tempor sed libero nec, dignissim dignissim turpis. Maecenas non commodo lectus, at elementum est. Sed fermentum interdum odio id eleifend. Quisque suscipit ligula felis, non placerat augue accumsan id. Proin vel velit sem. Aliquam ultrices, enim sit amet feugiat porttitor, purus velit tincidunt ligula, sagittis faucibus nisl massa eu tortor. Quisque vehicula augue lacus, vel iaculis augue posuere id. Morbi eu scelerisque nisi, sit amet pretium nibh. Vivamus tincidunt, ex id fermentum venenatis, justo metus convallis ante, ac auctor augue odio vel massa. Donec tempus est diam, sit amet commodo magna luctus id. In hac habitasse platea dictumst. Proin suscipit ut ligula sit amet pellentesque.', NULL, NULL, NULL, 1),
(9, '2FA3F', 'Nulla vel pharetra felis. Aliquam vehicula mattis enim, sit amet ultrices massa aliquam quis. Proin rutrum urna et justo scelerisque dapibus. Quisque tempor metus sed est ultrices, at fermentum enim rhoncus. Nam diam erat, finibus eget rutrum eu, dictum nec purus. Ut tempus dolor est, at dapibus tortor vehicula a. Praesent pretium metus vel arcu faucibus, nec congue magna bibendum. Mauris sagittis sodales arcu, in convallis lectus blandit ut. In vitae auctor orci. Pellentesque vitae diam quis felis cursus dignissim. Donec efficitur nisl ut pulvinar molestie. Curabitur auctor velit lorem, quis congue turpis luctus eu. Fusce sagittis sit amet neque a congue.', NULL, NULL, NULL, 1),
(10, '2FA3F', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus tincidunt iaculis mauris, non sodales justo blandit nec. Nulla commodo ornare tortor eu porta. Maecenas tellus nunc, auctor non ex et, semper placerat diam. Fusce bibendum ipsum id magna tincidunt pretium. Duis dapibus consectetur nunc vitae condimentum. Vivamus eu enim id erat faucibus lobortis. Pellentesque vehicula, sapien id fermentum consequat, sapien enim porta quam, a feugiat ligula urna vel mi. Nulla suscipit diam leo, vitae bibendum elit dapibus sit amet.', NULL, NULL, NULL, 1),
(11, '25A56', 'This is a new artifact', NULL, NULL, NULL, 1),
(12, '2FA3F', 'According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don\'t care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let\'s shake it up a little. Barry! Breakfast is ready! Coming! Hang on a second. Hello? - Barry? - Adam? - Can you believe this is happening? - I can\'t. I\'ll pick you up. Looking sharp. Use the stairs. Your father paid good money for those. Sorry. I\'m excited. Here\'s the graduate. We\'re very proud of you, son. A perfect report card, all B\'s. Very proud. Ma! I got a thing going here. - You got lint on your fuzz. - Ow! That\'s me! - Wave to us! We\'ll be in row 118,000. - Bye! Barry, I told you, stop flying in the house! - Hey, Adam. - Hey, Barry. - Is that fuzz gel? - A little. Special day, graduation. Never thought I\'d make it. Three days grade school, three days high school.', NULL, NULL, NULL, 2),
(13, '2FA3F', ' Those were awkward. Three days college. I\'m glad I took a day and hitchhiked around the hive. You did come back different. - Hi, Barry. - Artie, growing a mustache? Looks good. - Hear about Frankie? - Yeah. - You going to the funeral? - No, I\'m not going. Everybody knows, sting someone, you die. Don\'t waste it on a squirrel. Such a hothead. I guess he could have just gotten out of the way. I love this incorporating an amusement park into our day. That\'s why we don\'t need vacations. Boy, quite a bit of pomp... under the circumstances. - Well, Adam, today we are men. - We are! - Bee-men. - Amen! Hallelujah! Students, faculty, distinguished bees, please welcome Dean Buzzwell. Welcome, New Hive City graduating class of... ...9:15. That concludes our ceremonies. And begins your career at Honex Industries! Will we pick our job today? I heard it\'s just orientation. Heads up! Here we go. Keep your hands and antennas inside the tram at all times. - Wonder what it\'ll be like? - A little scary. ', NULL, NULL, NULL, 2),
(14, '2FA3F', 'Welcome to Honex, a division of Honesco and a part of the Hexagon Group. This is it! Wow. Wow. We know that you, as a bee, have worked your whole life to get to the point where you can work for your whole life. Honey begins when our valiant Pollen Jocks bring the nectar to the hive. Our top-secret formula is automatically color-corrected, scent-adjusted and bubble-contoured into this soothing sweet syrup with its distinctive golden glow you know as... Honey! - That girl was hot. - She\'s my cousin! - She is? - Yes, we\'re all cousins. - Right. You\'re right. - At Honex, we constantly strive to improve every aspect of bee existence. These bees are stress-testing a new helmet technology. - What do you think he makes? - Not enough. Here we have our latest advancement, the Krelman. - What does that do? - Catches that little strand of honey that hangs after you pour it. Saves us millions. Can anyone work on the Krelman? Of course. Most bee jobs are small ones. But bees know that every small job, if it\'s done well, means a lot.', NULL, NULL, NULL, 2),
(15, '2FA3F', 'But choose carefully because you\'ll stay in the job you pick for the rest of your life. The same job the rest of your life? I didn\'t know that. What\'s the difference? You\'ll be happy to know that bees, as a species, haven\'t had one day off in 27 million years. So you\'ll just work us to death? We\'ll sure try. Wow! That blew my mind! \"What\'s the difference?\" How can you say that? One job forever? That\'s an insane choice to have to make. I\'m relieved. Now we only have to make one decision in life. But, Adam, how could they never have told us that? Why would you question anything? We\'re bees. We\'re the most perfectly functioning society on Earth. You ever think maybe things work a little too well here? Like what? Give me one example. I don\'t know. But you know what I\'m talking about. Please clear the gate. Royal Nectar Force on approach. Wait a second. Check it out. - Hey, those are Pollen Jocks! - Wow. I\'ve never seen them this close. They know what it\'s like outside the hive. Yeah, but some don\'t come back.', NULL, NULL, NULL, 2),
(16, '2FA3F', '- Hey, Jocks! - Hi, Jocks! You guys did great! You\'re monsters! You\'re sky freaks! I love it! I love it! - I wonder where they were. - I don\'t know. Their day\'s not planned. Outside the hive, flying who knows where, doing who knows what. You can\'t just decide to be a Pollen Jock. You have to be bred for that. Right. Look. That\'s more pollen than you and I will see in a lifetime. It\'s just a status symbol. Bees make too much of it. Perhaps. Unless you\'re wearing it and the ladies see you wearing it. Those ladies? Aren\'t they our cousins too? Distant. Distant. Look at these two. - Couple of Hive Harrys. - Let\'s have fun with them. It must be dangerous being a Pollen Jock. Yeah. Once a bear pinned me against a mushroom! He had a paw on my throat, and with the other, he was slapping me! - Oh, my! - I never thought I\'d knock him out. What were you doing during this? Trying to alert the authorities. I can autograph that. A little gusty out there today, wasn\'t it, comrades? Yeah. Gusty. We\'re hitting a sunflower patch six miles from here tomorrow.', NULL, NULL, NULL, 2),
(17, '2FA3F', '- Six miles, huh? - Barry! A puddle jump for us, but maybe you\'re not up for it. - Maybe I am. - You are not! We\'re going 0900 at J-Gate. What do you think, buzzy-boy? Are you bee enough? I might be. It all depends on what 0900 means. Hey, Honex! Dad, you surprised me. You decide what you\'re interested in? - Well, there\'s a lot of choices. - But you only get one. Do you ever get bored doing the same job every day? Son, let me tell you about stirring. You grab that stick, and you just move it around, and you stir it around. You get yourself into a rhythm. It\'s a beautiful thing. You know, Dad, the more I think about it, maybe the honey field just isn\'t right for me. You were thinking of what, making balloon animals? That\'s a bad job for a guy with a stinger. Janet, your son\'s not sure he wants to go into honey! - Barry, you are so funny sometimes. - I\'m not trying to be funny. You\'re not funny! You\'re going into honey. Our son, the stirrer! - You\'re gonna be a stirrer? - No one\'s listening to me!', NULL, NULL, NULL, 2),
(18, '2FA3F', 'Wait till you see the sticks I have. I could say anything right now. I\'m gonna get an ant tattoo! Let\'s open some honey and celebrate! Maybe I\'ll pierce my thorax. Shave my antennae. Shack up with a grasshopper. Get a gold tooth and call everybody \"dawg\"! I\'m so proud. - We\'re starting work today! - Today\'s the day. Come on! All the good jobs will be gone. Yeah, right. Pollen counting, stunt bee, pouring, stirrer, front desk, hair removal... - Is it still available? - Hang on. Two left! One of them\'s yours! Congratulations! Step to the side. - What\'d you get? - Picking crud out. Stellar! Wow! Couple of newbies? Yes, sir! Our first day! We are ready! Make your choice. - You want to go first? - No, you go. Oh, my. What\'s available? Restroom attendant\'s open, not for the reason you think. - Any chance of getting the Krelman? - Sure, you\'re on. I\'m sorry, the Krelman just closed out. Wax monkey\'s always open. The Krelman opened up again. What happened? A bee died. Makes an opening. See? He\'s dead.', NULL, NULL, NULL, 2),
(19, '2FA3F', 'Another dead one. Deady. Deadified. Two more dead. Dead from the neck up. Dead from the neck down. That\'s life! Oh, this is so hard! Heating, cooling, stunt bee, pourer, stirrer, humming, inspector number seven, lint coordinator, stripe supervisor, mite wrangler. Barry, what do you think I should... Barry? Barry! All right, we\'ve got the sunflower patch in quadrant nine... What happened to you? Where are you? - I\'m going out. - Out? Out where? - Out there. - Oh, no! I have to, before I go to work for the rest of my life. You\'re gonna die! You\'re crazy! Hello? Another call coming in. If anyone\'s feeling brave, there\'s a Korean deli on 83rd that gets their roses today. Hey, guys. - Look at that. - Isn\'t that the kid we saw yesterday? Hold it, son, flight deck\'s restricted. It\'s OK, Lou. We\'re gonna take him up. Really? Feeling lucky, are you? Sign here, here. Just initial that. - Thank you. - OK. You got a rain advisory today, and as you all know, bees cannot fly in rain. So be careful. ', NULL, NULL, NULL, 2),
(20, '2FA3F', 'As always, watch your brooms, hockey sticks, dogs, birds, bears and bats. Also, I got a couple of reports of root beer being poured on us. Murphy\'s in a home because of it, babbling like a cicada! - That\'s awful. - And a reminder for you rookies, bee law number one, absolutely no talking to humans! All right, launch positions! Buzz, buzz, buzz, buzz! Buzz, buzz, buzz, buzz! Buzz, buzz, buzz, buzz! Black and yellow! Hello! You ready for this, hot shot? Yeah. Yeah, bring it on. Wind, check. - Antennae, check. - Nectar pack, check. - Wings, check. - Stinger, check. Scared out of my shorts, check. OK, ladies, let\'s move it out! Pound those petunias, you striped stem-suckers! All of you, drain those flowers! Wow! I\'m out! I can\'t believe I\'m out! So blue. I feel so fast and free! Box kite! Wow! Flowers! This is Blue Leader. We have roses visual. Bring it around 30 degrees and hold. Roses! 30 degrees, roger. Bringing it around. Stand to the side, kid. It\'s got a bit of a kick. That is one nectar collector!', NULL, NULL, NULL, 2),
(21, '2FA3F', '- Ever see pollination up close? - No, sir. I pick up some pollen here, sprinkle it over here. Maybe a dash over there, a pinch on that one. See that? It\'s a little bit of magic. That\'s amazing. Why do we do that? That\'s pollen power. More pollen, more flowers, more nectar, more honey for us. Cool. I\'m picking up a lot of bright yellow. Could be daisies. Don\'t we need those? Copy that visual. Wait. One of these flowers seems to be on the move. Say again? You\'re reporting a moving flower? Affirmative. That was on the line! This is the coolest. What is it? I don\'t know, but I\'m loving this color. It smells good. Not like a flower, but I like it. Yeah, fuzzy. Chemical-y. Careful, guys. It\'s a little grabby. My sweet lord of bees! Candy-brain, get off there! Problem! - Guys! - This could be bad. Affirmative. Very close. Gonna hurt. Mama\'s little boy. You are way out of position, rookie! Coming in at you like a missile! Help me! I don\'t think these are flowers. - Should we tell him? - I think he knows.', NULL, NULL, NULL, 2),
(22, '2FA3F', 'What is this?! Match point! You can start packing up, honey, because you\'re about to eat it! Yowser! Gross. There\'s a bee in the car! - Do something! - I\'m driving! - Hi, bee. - He\'s back here! He\'s going to sting me! Nobody move. If you don\'t move, he won\'t sting you. Freeze! He blinked! Spray him, Granny! What are you doing?! Wow... the tension level out here is unbelievable. I gotta get home. Can\'t fly in rain. Can\'t fly in rain. Can\'t fly in rain. Mayday! Mayday! Bee going down! Ken, could you close the window please? Ken, could you close the window please? Check out my new resume. I made it into a fold-out brochure. You see? Folds out. Oh, no. More humans. I don\'t need this. What was that? Maybe this time. This time. This time. This time! This time! This... Drapes! That is diabolical. It\'s fantastic. It\'s got all my special skills, even my top-ten favorite movies. What\'s number one? Star Wars? Nah, I don\'t go for that... ...kind of stuff. No wonder we shouldn\'t talk to them. They\'re out of their minds.', NULL, NULL, NULL, 2),
(23, '2FA3F', 'When I leave a job interview, they\'re flabbergasted, can\'t believe what I say. There\'s the sun. Maybe that\'s a way out. I don\'t remember the sun having a big 75 on it. I predicted global warming. I could feel it getting hotter. At first I thought it was just me. Wait! Stop! Bee! Stand back. These are winter boots. Wait! Don\'t kill him! You know I\'m allergic to them! This thing could kill me! Why does his life have less value than yours? Why does his life have any less value than mine? Is that your statement? I\'m just saying all life has value. You don\'t know what he\'s capable of feeling. My brochure! There you go, little guy. I\'m not scared of him. It\'s an allergic thing. Put that on your resume brochure. My whole face could puff up. Make it one of your special skills. Knocking someone out is also a special skill. Right. Bye, Vanessa. Thanks. - Vanessa, next week? Yogurt night? - Sure, Ken. You know, whatever. - You could put carob chips on there. - Bye. - Supposed to be less calories. ', NULL, NULL, NULL, 2),
(24, '2FA3F', '- Bye. I gotta say something. She saved my life. I gotta say something. All right, here it goes. Nah. What would I say? I could really get in trouble. It\'s a bee law. You\'re not supposed to talk to a human. I can\'t believe I\'m doing this. I\'ve got to. Oh, I can\'t do it. Come on! No. Yes. No. Do it. I can\'t. How should I start it? \"You like jazz?\" No, that\'s no good. Here she comes! Speak, you fool! Hi! I\'m sorry. - You\'re talking. - Yes, I know. You\'re talking! I\'m so sorry. No, it\'s OK. It\'s fine. I know I\'m dreaming. But I don\'t recall going to bed. Well, I\'m sure this is very disconcerting. This is a bit of a surprise to me. I mean, you\'re a bee! I am. And I\'m not supposed to be doing this, but they were all trying to kill me. And if it wasn\'t for you... I had to thank you. It\'s just how I was raised. That was a little weird. - I\'m talking with a bee. - Yeah. I\'m talking to a bee. And the bee is talking to me! I just want to say I\'m grateful. I\'ll leave now. - Wait! How did you learn to do that?', NULL, NULL, NULL, 2),
(25, '2FA3F', '- What? The talking thing. Same way you did, I guess. \"Mama, Dada, honey.\" You pick it up. - That\'s very funny. - Yeah. Bees are funny. If we didn\'t laugh, we\'d cry with what we have to deal with. Anyway... Can I... ...get you something? - Like what? I don\'t know. I mean... I don\'t know. Coffee? I don\'t want to put you out. It\'s no trouble. It takes two minutes. - It\'s just coffee. - I hate to impose. - Don\'t be ridiculous! - Actually, I would love a cup. Hey, you want rum cake? - I shouldn\'t. - Have some. - No, I can\'t. - Come on! I\'m trying to lose a couple micrograms. - Where? - These stripes don\'t help. You look great! I don\'t know if you know anything about fashion. Are you all right? No. He\'s making the tie in the cab as they\'re flying up Madison. He finally gets there. He runs up the steps into the church. The wedding is on. And he says, \"Watermelon? I thought you said Guatemalan. Why would I marry a watermelon?\" Is that a bee joke? That\'s the kind of stuff we do. Yeah, different.', NULL, NULL, NULL, 2),
(26, '2FA3F', 'So, what are you gonna do, Barry? About work? I don\'t know. I want to do my part for the hive, but I can\'t do it the way they want. I know how you feel. - You do? - Sure. My parents wanted me to be a lawyer or a doctor, but I wanted to be a florist. - Really? - My only interest is flowers. Our new queen was just elected with that same campaign slogan. Anyway, if you look... There\'s my hive right there. See it? You\'re in Sheep Meadow! Yes! I\'m right off the Turtle Pond! No way! I know that area. I lost a toe ring there once. - Why do girls put rings on their toes? - Why not? - It\'s like putting a hat on your knee. - Maybe I\'ll try that. - You all right, ma\'am? - Oh, yeah. Fine. Just having two cups of coffee! Anyway, this has been great. Thanks for the coffee. Yeah, it\'s no trouble. Sorry I couldn\'t finish it. If I did, I\'d be up the rest of my life. Are you...? Can I take a piece of this with me? Sure! Here, have a crumb. - Thanks! - Yeah. All right. Well, then... I guess I\'ll see you around.', NULL, NULL, NULL, 2),
(27, '2FA3F', 'Or not. OK, Barry. And thank you so much again... for before. Oh, that? That was nothing. Well, not nothing, but... Anyway... This can\'t possibly work. He\'s all set to go. We may as well try it. OK, Dave, pull the chute. - Sounds amazing. - It was amazing! It was the scariest, happiest moment of my life. Humans! I can\'t believe you were with humans! Giant, scary humans! What were they like? Huge and crazy. They talk crazy. They eat crazy giant things. They drive crazy. - Do they try and kill you, like on TV? - Some of them. But some of them don\'t. - How\'d you get back? - Poodle. You did it, and I\'m glad. You saw whatever you wanted to see. You had your \"experience.\" Now you can pick out your job and be normal. - Well... - Well? Well, I met someone. You did? Was she Bee-ish? - A wasp?! Your parents will kill you! - No, no, no, not a wasp. - Spider? - I\'m not attracted to spiders. I know it\'s the hottest thing, with the eight legs and all. I can\'t get by that face. So who is she? She\'s... human.', NULL, NULL, NULL, 2),
(28, '2FA3F', 'No, no. That\'s a bee law. You wouldn\'t break a bee law. - Her name\'s Vanessa. - Oh, boy. She\'s so nice. And she\'s a florist! Oh, no! You\'re dating a human florist! We\'re not dating. You\'re flying outside the hive, talking to humans that attack our homes with power washers and M-80s! One-eighth a stick of dynamite! She saved my life! And she understands me. This is over! Eat this. This is not over! What was that? - They call it a crumb. - It was so stingin\' stripey! And that\'s not what they eat. That\'s what falls off what they eat! - You know what a Cinnabon is? - No. It\'s bread and cinnamon and frosting. They heat it up... Sit down! ...really hot! - Listen to me! We are not them! We\'re us. There\'s us and there\'s them! Yes, but who can deny the heart that is yearning? There\'s no yearning. Stop yearning. Listen to me! You have got to start thinking bee, my friend. Thinking bee! - Thinking bee. - Thinking bee. Thinking bee! Thinking bee! Thinking bee! Thinking bee! There he is. He\'s in the pool.', NULL, NULL, NULL, 2),
(29, '2FA3F', 'You know what your problem is, Barry? I gotta start thinking bee? How much longer will this go on? It\'s been three days! Why aren\'t you working? I\'ve got a lot of big life decisions to think about. What life? You have no life! You have no job. You\'re barely a bee! Would it kill you to make a little honey? Barry, come out. Your father\'s talking to you. Martin, would you talk to him? Barry, I\'m talking to you! You coming? Got everything? All set! Go ahead. I\'ll catch up. Don\'t be too long. Watch this! Vanessa! - We\'re still here. - I told you not to yell at him. He doesn\'t respond to yelling! - Then why yell at me? - Because you don\'t listen! I\'m not listening to this. Sorry, I\'ve gotta go. - Where are you going? - I\'m meeting a friend. A girl? Is this why you can\'t decide? Bye. I just hope she\'s Bee-ish. They have a huge parade of flowers every year in Pasadena? To be in the Tournament of Roses, that\'s every florist\'s dream! Up on a float, surrounded by flowers, crowds cheering. A tournament.', NULL, NULL, NULL, 2),
(30, '2FA3F', 'Do the roses compete in athletic events? No. All right, I\'ve got one. How come you don\'t fly everywhere? It\'s exhausting. Why don\'t you run everywhere? It\'s faster. Yeah, OK, I see, I see. All right, your turn. TiVo. You can just freeze live TV? That\'s insane! You don\'t have that? We have Hivo, but it\'s a disease. It\'s a horrible, horrible disease. Oh, my. Dumb bees! You must want to sting all those jerks. We try not to sting. It\'s usually fatal for us. So you have to watch your temper. Very carefully. You kick a wall, take a walk, write an angry letter and throw it out. Work through it like any emotion: Anger, jealousy, lust. Oh, my goodness! Are you OK? Yeah. - What is wrong with you?! - It\'s a bug. He\'s not bothering anybody. Get out of here, you creep! What was that? A Pic \'N\' Save circular? Yeah, it was. How did you know? It felt like about 10 pages. Seventy-five is pretty much our limit. You\'ve really got that down to a science. - I lost a cousin to Italian Vogue. - I\'ll bet. What in the name of Mighty Hercules is this?', NULL, NULL, NULL, 2),
(31, '2FA3F', 'How did this get here? Cute Bee, Golden Blossom, Ray Liotta Private Select? - Is he that actor? - I never heard of him. - Why is this here? - For people. We eat it. You don\'t have enough food of your own? - Well, yes. - How do you get it? - Bees make it. - I know who makes it! And it\'s hard to make it! There\'s heating, cooling, stirring. You need a whole Krelman thing! - It\'s organic. - It\'s our-ganic! It\'s just honey, Barry. Just what?! Bees don\'t know about this! This is stealing! A lot of stealing! You\'ve taken our homes, schools, hospitals! This is all we have! And it\'s on sale?! I\'m getting to the bottom of this. I\'m getting to the bottom of all of this! Hey, Hector. - You almost done? - Almost. He is here. I sense it. Well, I guess I\'ll go home now and just leave this nice honey out, with no one around. You\'re busted, box boy! I knew I heard something. So you can talk! I can talk. And now you\'ll start talking! Where you getting the sweet stuff? Who\'s your supplier? I don\'t understand.', NULL, NULL, NULL, 2),
(32, '2FA3F', 'I thought we were friends. The last thing we want to do is upset bees! You\'re too late! It\'s ours now! You, sir, have crossed the wrong sword! You, sir, will be lunch for my iguana, Ignacio! Where is the honey coming from? Tell me where! Honey Farms! It comes from Honey Farms! Crazy person! What horrible thing has happened here? These faces, they never knew what hit them. And now they\'re on the road to nowhere! Just keep still. What? You\'re not dead? Do I look dead? They will wipe anything that moves. Where you headed? To Honey Farms. I am onto something huge here. I\'m going to Alaska. Moose blood, crazy stuff. Blows your head off! I\'m going to Tacoma. - And you? - He really is dead. All right. Uh-oh! - What is that?! - Oh, no! - A wiper! Triple blade! - Triple blade? Jump on! It\'s your only chance, bee! Why does everything have to be so doggone clean?! How much do you people need to see?! Open your eyes! Stick your head out the window! From NPR News in Washington, I\'m Carl Kasell. But don\'t kill no more bugs!', NULL, NULL, NULL, 2),
(33, '2FA3F', '- Bee! - Moose blood guy!! - You hear something? - Like what? Like tiny screaming. Turn off the radio. Whassup, bee boy? Hey, Blood. Just a row of honey jars, as far as the eye could see. Wow! I assume wherever this truck goes is where they\'re getting it. I mean, that honey\'s ours. - Bees hang tight. - We\'re all jammed in. It\'s a close community. Not us, man. We on our own. Every mosquito on his own. - What if you get in trouble? - You a mosquito, you in trouble. Nobody likes us. They just smack. See a mosquito, smack, smack! At least you\'re out in the world. You must meet girls. Mosquito girls try to trade up, get with a moth, dragonfly. Mosquito girl don\'t want no mosquito. You got to be kidding me! Mooseblood\'s about to leave the building! So long, bee! - Hey, guys! - Mooseblood! I knew I\'d catch y\'all down here. Did you bring your crazy straw? We throw it in jars, slap a label on it, and it\'s pretty much pure profit. What is this place? A bee\'s got a brain the size of a pinhead. They are pinheads! Pinhead.', NULL, NULL, NULL, 2),
(34, '2FA3F', '- Check out the new smoker. - Oh, sweet. That\'s the one you want. The Thomas 3000! Smoker? Ninety puffs a minute, semi-automatic. Twice the nicotine, all the tar. A couple breaths of this knocks them right out. They make the honey, and we make the money. \"They make the honey, and we make the money\"? Oh, my! What\'s going on? Are you OK? Yeah. It doesn\'t last too long. Do you know you\'re in a fake hive with fake walls? Our queen was moved here. We had no choice. This is your queen? That\'s a man in women\'s clothes! That\'s a drag queen! What is this? Oh, no! There\'s hundreds of them! Bee honey. Our honey is being brazenly stolen on a massive scale! This is worse than anything bears have done! I intend to do something. Oh, Barry, stop. Who told you humans are taking our honey? That\'s a rumor. Do these look like rumors? That\'s a conspiracy theory. These are obviously doctored photos. How did you get mixed up in this? He\'s been talking to humans. - What? - Talking to humans?! He has a human girlfriend.', NULL, NULL, NULL, 2),
(35, '2FA3F', 'And they make out! Make out? Barry! We do not. - You wish you could. - Whose side are you on? The bees! I dated a cricket once in San Antonio. Those crazy legs kept me up all night. Barry, this is what you want to do with your life? I want to do it for all our lives. Nobody works harder than bees! Dad, I remember you coming home so overworked your hands were still stirring. You couldn\'t stop. I remember that. What right do they have to our honey? We live on two cups a year. They put it in lip balm for no reason whatsoever! Even if it\'s true, what can one bee do? Sting them where it really hurts. In the face! The eye! - That would hurt. - No. Up the nose? That\'s a killer. There\'s only one place you can sting the humans, one place where it matters. Hive at Five, the hive\'s only full-hour action news source. No more bee beards! With Bob Bumble at the anchor desk. Weather with Storm Stinger. Sports with Buzz Larvi. And Jeanette Chung. - Good evening. I\'m Bob Bumble. - And I\'m Jeanette Chung.', NULL, NULL, NULL, 2),
(36, '2FA3F', 'A tri-county bee, Barry Benson, intends to sue the human race for stealing our honey, packaging it and profiting from it illegally! Tomorrow night on Bee Larry King, we\'ll have three former queens here in our studio, discussing their new book, Classy Ladies, out this week on Hexagon. Tonight we\'re talking to Barry Benson. Did you ever think, \"I\'m a kid from the hive. I can\'t do this\"? Bees have never been afraid to change the world. What about Bee Columbus? Bee Gandhi? Bee Jesus? Where I\'m from, we\'d never sue humans. We were thinking of stickball or candy stores. How old are you? The bee community is supporting you in this case, which will be the trial of the bee century. You know, they have a Larry King in the human world too. It\'s a common name. Next week... He looks like you and has a show and suspenders and colored dots... Next week... Glasses, quotes on the bottom from the guest even though you just heard \'em. Bear Week next week! They\'re scary, hairy and here live. Always leans forward, pointy shoulders, squinty eyes, very Jewish.', NULL, NULL, NULL, 2),
(37, '2FA3F', 'In tennis, you attack at the point of weakness! It was my grandmother, Ken. She\'s 81. Honey, her backhand\'s a joke! I\'m not gonna take advantage of that? Quiet, please. Actual work going on here. - Is that that same bee? - Yes, it is! I\'m helping him sue the human race. - Hello. - Hello, bee. This is Ken. Yeah, I remember you. Timberland, size ten and a half. Vibram sole, I believe. Why does he talk again? Listen, you better go \'cause we\'re really busy working. But it\'s our yogurt night! Bye-bye. Why is yogurt night so difficult?! You poor thing. You two have been at this for hours! Yes, and Adam here has been a huge help. - Frosting... - How many sugars? Just one. I try not to use the competition. So why are you helping me? Bees have good qualities. And it takes my mind off the shop. Instead of flowers, people are giving balloon bouquets now. Those are great, if you\'re three. And artificial flowers. - Oh, those just get me psychotic! - Yeah, me too. Bent stingers, pointless pollination.', NULL, NULL, NULL, 2),
(38, '2FA3F', 'Bees must hate those fake things! Nothing worse than a daffodil that\'s had work done. Maybe this could make up for it a little bit. - This lawsuit\'s a pretty big deal. - I guess. You sure you want to go through with it? Am I sure? When I\'m done with the humans, they won\'t be able to say, \"Honey, I\'m home,\" without paying a royalty! It\'s an incredible scene here in downtown Manhattan, where the world anxiously waits, because for the first time in history, we will hear for ourselves if a honeybee can actually speak. What have we gotten into here, Barry? It\'s pretty big, isn\'t it? I can\'t believe how many humans don\'t work during the day. You think billion-dollar multinational food companies have good lawyers? Everybody needs to stay behind the barricade. - What\'s the matter? - I don\'t know, I just got a chill. Well, if it isn\'t the bee team. You boys work on this? All rise! The Honorable Judge Bumbleton presiding. All right. Case number 4475, Superior Court of New York, Barry Bee Benson v.', NULL, NULL, NULL, 2),
(39, '2FA3F', 'the Honey Industry is now in session. Mr. Montgomery, you\'re representing the five food companies collectively? A privilege. Mr. Benson... you\'re representing all the bees of the world? I\'m kidding. Yes, Your Honor, we\'re ready to proceed. Mr. Montgomery, your opening statement, please. Ladies and gentlemen of the jury, my grandmother was a simple woman. Born on a farm, she believed it was man\'s divine right to benefit from the bounty of nature God put before us. If we lived in the topsy-turvy world Mr. Benson imagines, just think of what would it mean. I would have to negotiate with the silkworm for the elastic in my britches! Talking bee! How do we know this isn\'t some sort of holographic motion-picture-capture Hollywood wizardry? They could be using laser beams! Robotics! Ventriloquism! Cloning! For all we know, he could be on steroids! Mr. Benson? Ladies and gentlemen, there\'s no trickery here. I\'m just an ordinary bee. Honey\'s pretty important to me. It\'s important to all bees. We invented it!', NULL, NULL, NULL, 2),
(40, '2FA3F', 'We make it. And we protect it with our lives. Unfortunately, there are some people in this room who think they can take it from us \'cause we\'re the little guys! I\'m hoping that, after this is all over, you\'ll see how, by taking our honey, you not only take everything we have but everything we are! I wish he\'d dress like that all the time. So nice! Call your first witness. So, Mr. Klauss Vanderhayden of Honey Farms, big company you have. I suppose so. I see you also own Honeyburton and Honron! Yes, they provide beekeepers for our farms. Beekeeper. I find that to be a very disturbing term. I don\'t imagine you employ any bee-free-ers, do you? - No. - I couldn\'t hear you. - No. - No. Because you don\'t free bees. You keep bees. Not only that, it seems you thought a bear would be an appropriate image for a jar of honey. They\'re very lovable creatures. Yogi Bear, Fozzie Bear, Build-A-Bear. You mean like this? Bears kill bees! How\'d you like his head crashing through your living room?! Biting into your couch!', NULL, NULL, NULL, 2),
(41, '2FA3F', 'Spitting out your throw pillows! OK, that\'s enough. Take him away. So, Mr. Sting, thank you for being here. Your name intrigues me. - Where have I heard it before? - I was with a band called The Police. But you\'ve never been a police officer, have you? No, I haven\'t. No, you haven\'t. And so here we have yet another example of bee culture casually stolen by a human for nothing more than a prance-about stage name. Oh, please. Have you ever been stung, Mr. Sting? Because I\'m feeling a little stung, Sting. Or should I say... Mr. Gordon M. Sumner! That\'s not his real name?! You idiots! Mr. Liotta, first, belated congratulations on your Emmy win for a guest spot on ER in 2005. Thank you. Thank you. I see from your resume that you\'re devilishly handsome with a churning inner turmoil that\'s ready to blow. I enjoy what I do. Is that a crime? Not yet it isn\'t. But is this what it\'s come to for you? Exploiting tiny, helpless bees so you don\'t have to rehearse your part and learn your lines, sir? ', NULL, NULL, NULL, 2),
(42, '2FA3F', 'Watch it, Benson! I could blow right now! This isn\'t a goodfella. This is a bad fella! Why doesn\'t someone just step on this creep, and we can all go home?! - Order in this court! - You\'re all thinking it! Order! Order, I say! - Say it! - Mr. Liotta, please sit down! I think it was awfully nice of that bear to pitch in like that. I think the jury\'s on our side. Are we doing everything right, legally? I\'m a florist. Right. Well, here\'s to a great team. To a great team! Well, hello. - Ken! - Hello. I didn\'t think you were coming. No, I was just late. I tried to call, but... the battery. I didn\'t want all this to go to waste, so I called Barry. Luckily, he was free. Oh, that was lucky. There\'s a little left. I could heat it up. Yeah, heat it up, sure, whatever. So I hear you\'re quite a tennis player. I\'m not much for the game myself. The ball\'s a little grabby. That\'s where I usually sit. Right... there. Ken, Barry was looking at your resume, and he agreed with me that eating with chopsticks isn\'t really a special skill.', NULL, NULL, NULL, 2),
(43, '2FA3F', 'You think I don\'t see what you\'re doing? I know how hard it is to find the right job. We have that in common. Do we? Bees have 100 percent employment, but we do jobs like taking the crud out. That\'s just what I was thinking about doing. Ken, I let Barry borrow your razor for his fuzz. I hope that was all right. I\'m going to drain the old stinger. Yeah, you do that. Look at that. You know, I\'ve just about had it with your little mind games. - What\'s that? - Italian Vogue. Mamma mia, that\'s a lot of pages. A lot of ads. Remember what Van said, why is your life more valuable than mine? Funny, I just can\'t seem to recall that! I think something stinks in here! I love the smell of flowers. How do you like the smell of flames?! Not as much. Water bug! Not taking sides! Ken, I\'m wearing a Chapstick hat! This is pathetic! I\'ve got issues! Well, well, well, a royal flush! - You\'re bluffing. - Am I? Surf\'s up, dude! Poo water! That bowl is gnarly. Except for those dirty yellow rings! Kenneth! What are you doing?!', NULL, NULL, NULL, 2),
(44, '2FA3F', 'You know, I don\'t even like honey! I don\'t eat it! We need to talk! He\'s just a little bee! And he happens to be the nicest bee I\'ve met in a long time! Long time? What are you talking about?! Are there other bugs in your life? No, but there are other things bugging me in life. And you\'re one of them! Fine! Talking bees, no yogurt night... My nerves are fried from riding on this emotional roller coaster! Goodbye, Ken. And for your information, I prefer sugar-free, artificial sweeteners made by man! I\'m sorry about all that. I know it\'s got an aftertaste! I like it! I always felt there was some kind of barrier between Ken and me. I couldn\'t overcome it. Oh, well. Are you OK for the trial? I believe Mr. Montgomery is about out of ideas. We would like to call Mr. Barry Benson Bee to the stand. Good idea! You can really see why he\'s considered one of the best lawyers... Yeah. Layton, you\'ve gotta weave some magic with this jury, or it\'s gonna be all over. Don\'t worry. The only thing I have to do to turn this jury around is to remind them of what they don\'t like about bees.', NULL, NULL, NULL, 2),
(45, '2FA3F', '- You got the tweezers? - Are you allergic? Only to losing, son. Only to losing. Mr. Benson Bee, I\'ll ask you what I think we\'d all like to know. What exactly is your relationship to that woman? We\'re friends. - Good friends? - Yes. How good? Do you live together? Wait a minute... Are you her little... ...bedbug? I\'ve seen a bee documentary or two. From what I understand, doesn\'t your queen give birth to all the bee children? - Yeah, but... - So those aren\'t your real parents! - Oh, Barry... - Yes, they are! Hold me back! You\'re an illegitimate bee, aren\'t you, Benson? He\'s denouncing bees! Don\'t y\'all date your cousins? - Objection! - I\'m going to pincushion this guy! Adam, don\'t! It\'s what he wants! Oh, I\'m hit! Oh, lordy, I am hit! Order! Order! The venom! The venom is coursing through my veins! I have been felled by a winged beast of destruction! You see? You can\'t treat them like equals! They\'re striped savages! Stinging\'s the only thing they know! It\'s their way! - Adam, stay with me.', NULL, NULL, NULL, 2),
(46, '2FA3F', '- I can\'t feel my legs. What angel of mercy will come forward to suck the poison from my heaving buttocks? I will have order in this court. Order! Order, please! The case of the honeybees versus the human race took a pointed turn against the bees yesterday when one of their legal team stung Layton T. Montgomery. - Hey, buddy. - Hey. - Is there much pain? - Yeah. I... I blew the whole case, didn\'t I? It doesn\'t matter. What matters is you\'re alive. You could have died. I\'d be better off dead. Look at me. They got it from the cafeteria downstairs, in a tuna sandwich. Look, there\'s a little celery still on it. What was it like to sting someone? I can\'t explain it. It was all... All adrenaline and then... and then ecstasy! All right. You think it was all a trap? Of course. I\'m sorry. I flew us right into this. What were we thinking? Look at us. We\'re just a couple of bugs in this world. What will the humans do to us if they win? I don\'t know. I hear they put the roaches in motels. That doesn\'t sound so bad.', NULL, NULL, NULL, 2),
(47, '2FA3F', 'Adam, they check in, but they don\'t check out! Oh, my. Could you get a nurse to close that window? - Why? - The smoke. Bees don\'t smoke. Right. Bees don\'t smoke. Bees don\'t smoke! But some bees are smoking. That\'s it! That\'s our case! It is? It\'s not over? Get dressed. I\'ve gotta go somewhere. Get back to the court and stall. Stall any way you can. And assuming you\'ve done step correctly, you\'re ready for the tub. Mr. Flayman. Yes? Yes, Your Honor! Where is the rest of your team? Well, Your Honor, it\'s interesting. Bees are trained to fly haphazardly, and as a result, we don\'t make very good time. I actually heard a funny story about... Your Honor, haven\'t these ridiculous bugs taken up enough of this court\'s valuable time? How much longer will we allow these absurd shenanigans to go on? They have presented no compelling evidence to support their charges against my clients, who run legitimate businesses. I move for a complete dismissal of this entire case! Mr. Flayman, I\'m afraid I\'m going to have to consider Mr. Montgomery\'s motion.', NULL, NULL, NULL, 2),
(48, '2FA3F', 'But you can\'t! We have a terrific case. Where is your proof? Where is the evidence? Show me the smoking gun! Hold it, Your Honor! You want a smoking gun? Here is your smoking gun. What is that? It\'s a bee smoker! What, this? This harmless little contraption? This couldn\'t hurt a fly, let alone a bee. Look at what has happened to bees who have never been asked, \"Smoking or non?\" Is this what nature intended for us? To be forcibly addicted to smoke machines and man-made wooden slat work camps? Living out our lives as honey slaves to the white man? - What are we gonna do? - He\'s playing the species card. Ladies and gentlemen, please, free these bees! Free the bees! Free the bees! Free the bees! Free the bees! Free the bees! The court finds in favor of the bees! Vanessa, we won! I knew you could do it! High-five! Sorry. I\'m OK! You know what this means? All the honey will finally belong to the bees. Now we won\'t have to work so hard all the time. This is an unholy perversion of the balance of nature, Benson.', NULL, NULL, NULL, 2),
(49, '2FA3F', 'You\'ll regret this. Barry, how much honey is out there? All right. One at a time. Barry, who are you wearing? My sweater is Ralph Lauren, and I have no pants. - What if Montgomery\'s right? - What do you mean? We\'ve been living the bee way a long time, 27 million years. Congratulations on your victory. What will you demand as a settlement? First, we\'ll demand a complete shutdown of all bee work camps. Then we want back the honey that was ours to begin with, every last drop. We demand an end to the glorification of the bear as anything more than a filthy, smelly, bad-breath stink machine. We\'re all aware of what they do in the woods. Wait for my signal. Take him out. He\'ll have nauseous for a few hours, then he\'ll be fine. And we will no longer tolerate bee-negative nicknames... But it\'s just a prance-about stage name! ...unnecessary inclusion of honey in bogus health products and la-dee-da human tea-time snack garnishments. Can\'t breathe. Bring it in, boys! Hold it right there! Good. Tap it.', NULL, NULL, NULL, 2),
(50, '2FA3F', 'Mr. Buzzwell, we just passed three cups, and there\'s gallons more coming! - I think we need to shut down! - Shut down? We\'ve never shut down. Shut down honey production! Stop making honey! Turn your key, sir! What do we do now? Cannonball! We\'re shutting honey production! Mission abort. Aborting pollination and nectar detail. Returning to base. Adam, you wouldn\'t believe how much honey was out there. Oh, yeah? What\'s going on? Where is everybody? - Are they out celebrating? - They\'re home. They don\'t know what to do. Laying out, sleeping in. I heard your Uncle Carl was on his way to San Antonio with a cricket. At least we got our honey back. Sometimes I think, so what if humans liked our honey? Who wouldn\'t? It\'s the greatest thing in the world! I was excited to be part of making it. This was my new desk. This was my new job. I wanted to do it really well. And now... Now I can\'t. I don\'t understand why they\'re not happy. I thought their lives would be better! They\'re doing nothing. It\'s amazing.', NULL, NULL, NULL, 2),
(51, '2FA3F', 'Honey really changes people. You don\'t have any idea what\'s going on, do you? - What did you want to show me? - This. What happened here? That is not the half of it. Oh, no. Oh, my. They\'re all wilting. Doesn\'t look very good, does it? No. And whose fault do you think that is? You know, I\'m gonna guess bees. Bees? Specifically, me. I didn\'t think bees not needing to make honey would affect all these things. It\'s not just flowers. Fruits, vegetables, they all need bees. That\'s our whole SAT test right there. Take away produce, that affects the entire animal kingdom. And then, of course... The human species? So if there\'s no more pollination, it could all just go south here, couldn\'t it? I know this is also partly my fault. How about a suicide pact? How do we do it? - I\'ll sting you, you step on me. - That just kills you twice. Right, right. Listen, Barry... sorry, but I gotta get going. I had to open my mouth and talk. Vanessa? Vanessa? Why are you leaving? Where are you going? To the final Tournament of Roses parade in Pasadena.', NULL, NULL, NULL, 2);
INSERT INTO `artifact` (`id`, `identifier`, `data`, `start`, `end`, `parent_id`, `p_id`) VALUES
(52, '2FA3F', 'They\'ve moved it to this weekend because all the flowers are dying. It\'s the last chance I\'ll ever have to see it. Vanessa, I just wanna say I\'m sorry. I never meant it to turn out like this. I know. Me neither. Tournament of Roses. Roses can\'t do sports. Wait a minute. Roses. Roses? Roses! Vanessa! Roses?! Barry? - Roses are flowers! - Yes, they are. Flowers, bees, pollen! I know. That\'s why this is the last parade. Maybe not. Could you ask him to slow down? Could you slow down? Barry! OK, I made a huge mistake. This is a total disaster, all my fault. Yes, it kind of is. I\'ve ruined the planet. I wanted to help you with the flower shop. I\'ve made it worse. Actually, it\'s completely closed down. I thought maybe you were remodeling. But I have another idea, and it\'s greater than my previous ideas combined. I don\'t want to hear it! All right, they have the roses, the roses have the pollen. I know every bee, plant and flower bud in this park. All we gotta do is get what they\'ve got back here with what we\'ve got.', NULL, NULL, NULL, 2),
(53, '2FA3F', '- Bees. - Park. - Pollen! - Flowers. - Repollination! - Across the nation! Tournament of Roses, Pasadena, California. They\'ve got nothing but flowers, floats and cotton candy. Security will be tight. I have an idea. Vanessa Bloome, FTD. Official floral business. It\'s real. Sorry, ma\'am. Nice brooch. Thank you. It was a gift. Once inside, we just pick the right float. How about The Princess and the Pea? I could be the princess, and you could be the pea! Yes, I got it. - Where should I sit? - What are you? - I believe I\'m the pea. - The pea? It goes under the mattresses. - Not in this fairy tale, sweetheart. - I\'m getting the marshal. You do that! This whole parade is a fiasco! Let\'s see what this baby\'ll do. Hey, what are you doing?! Then all we do is blend in with traffic... ...without arousing suspicion. Once at the airport, there\'s no stopping us. Stop! Security. - You and your insect pack your float? - Yes. Has it been in your possession the entire time? Would you remove your shoes? - Remove your stinger.', NULL, NULL, NULL, 2),
(54, '2FA3F', '- It\'s part of me. I know. Just having some fun. Enjoy your flight. Then if we\'re lucky, we\'ll have just enough pollen to do the job. Can you believe how lucky we are? We have just enough pollen to do the job! I think this is gonna work. It\'s got to work. Attention, passengers, this is Captain Scott. We have a bit of bad weather in New York. It looks like we\'ll experience a couple hours delay. Barry, these are cut flowers with no water. They\'ll never make it. I gotta get up there and talk to them. Be careful. Can I get help with the Sky Mall magazine? I\'d like to order the talking inflatable nose and ear hair trimmer. Captain, I\'m in a real situation. - What\'d you say, Hal? - Nothing. Bee! Don\'t freak out! My entire species... What are you doing? - Wait a minute! I\'m an attorney! - Who\'s an attorney? Don\'t move. Oh, Barry. Good afternoon, passengers. This is your captain. Would a Miss Vanessa Bloome in 24B please report to the cockpit? And please hurry! What happened here? There was a DustBuster, a toupee, a life raft exploded.', NULL, NULL, NULL, 2),
(55, '2FA3F', 'One\'s bald, one\'s in a boat, they\'re both unconscious! - Is that another bee joke? - No! No one\'s flying the plane! This is JFK control tower, Flight 356. What\'s your status? This is Vanessa Bloome. I\'m a florist from New York. Where\'s the pilot? He\'s unconscious, and so is the copilot. Not good. Does anyone onboard have flight experience? As a matter of fact, there is. - Who\'s that? - Barry Benson. From the honey trial?! Oh, great. Vanessa, this is nothing more than a big metal bee. It\'s got giant wings, huge engines. I can\'t fly a plane. - Why not? Isn\'t John Travolta a pilot? - Yes. How hard could it be? Wait, Barry! We\'re headed into some lightning. This is Bob Bumble. We have some late-breaking news from JFK Airport, where a suspenseful scene is developing. Barry Benson, fresh from his legal victory... That\'s Barry! ...is attempting to land a plane, loaded with people, flowers and an incapacitated flight crew. Flowers?! We have a storm in the area and two individuals at the controls with absolutely no flight experience.', NULL, NULL, NULL, 2),
(56, '2FA3F', 'Just a minute. There\'s a bee on that plane. I\'m quite familiar with Mr. Benson and his no-account compadres. They\'ve done enough damage. But isn\'t he your only hope? Technically, a bee shouldn\'t be able to fly at all. Their wings are too small... Haven\'t we heard this a million times? \"The surface area of the wings and body mass make no sense.\" - Get this on the air! - Got it. - Stand by. - We\'re going live. The way we work may be a mystery to you. Making honey takes a lot of bees doing a lot of small jobs. But let me tell you about a small job. If you do it well, it makes a big difference. More than we realized. To us, to everyone. That\'s why I want to get bees back to working together. That\'s the bee way! We\'re not made of Jell-O. We get behind a fellow. - Black and yellow! - Hello! Left, right, down, hover. - Hover? - Forget hover. This isn\'t so hard. Beep-beep! Beep-beep! Barry, what happened?! Wait, I think we were on autopilot the whole time. - That may have been helping me. - And now we\'re not!', NULL, NULL, NULL, 2),
(57, '2FA3F', 'So it turns out I cannot fly a plane. All of you, let\'s get behind this fellow! Move it out! Move out! Our only chance is if I do what I\'d do, you copy me with the wings of the plane! Don\'t have to yell. I\'m not yelling! We\'re in a lot of trouble. It\'s very hard to concentrate with that panicky tone in your voice! It\'s not a tone. I\'m panicking! I can\'t do this! Vanessa, pull yourself together. You have to snap out of it! You snap out of it. You snap out of it. - You snap out of it! - You snap out of it! - You snap out of it! - You snap out of it! - You snap out of it! - You snap out of it! - Hold it! - Why? Come on, it\'s my turn. How is the plane flying? I don\'t know. Hello? Benson, got any flowers for a happy occasion in there? The Pollen Jocks! They do get behind a fellow. - Black and yellow. - Hello. All right, let\'s drop this tin can on the blacktop. Where? I can\'t see anything. Can you? No, nothing. It\'s all cloudy. Come on. You got to think bee, Barry. - Thinking bee. - Thinking bee.', NULL, NULL, NULL, 2),
(58, '2FA3F', 'Thinking bee! Thinking bee! Thinking bee! Wait a minute. I think I\'m feeling something. - What? - I don\'t know. It\'s strong, pulling me. Like a 27-million-year-old instinct. Bring the nose down. Thinking bee! Thinking bee! Thinking bee! - What in the world is on the tarmac? - Get some lights on that! Thinking bee! Thinking bee! Thinking bee! - Vanessa, aim for the flower. - OK. Out the engines. We\'re going in on bee power. Ready, boys? Affirmative! Good. Good. Easy, now. That\'s it. Land on that flower! Ready? Full reverse! Spin it around! - Not that flower! The other one! - Which one? - That flower. - I\'m aiming at the flower! That\'s a fat guy in a flowered shirt. I mean the giant pulsating flower made of millions of bees! Pull forward. Nose down. Tail up. Rotate around it. - This is insane, Barry! - This\'s the only way I know how to fly. Am I koo-koo-kachoo, or is this plane flying in an insect-like pattern? Get your nose in there. Don\'t be afraid. Smell it. Full reverse! Just drop it.', NULL, NULL, NULL, 2),
(59, '2FA3F', 'Be a part of it. Aim for the center! Now drop it in! Drop it in, woman! Come on, already. Barry, we did it! You taught me how to fly! - Yes. No high-five! - Right. Barry, it worked! Did you see the giant flower? What giant flower? Where? Of course I saw the flower! That was genius! - Thank you. - But we\'re not done yet. Listen, everyone! This runway is covered with the last pollen from the last flowers available anywhere on Earth. That means this is our last chance. We\'re the only ones who make honey, pollinate flowers and dress like this. If we\'re gonna survive as a species, this is our moment! What do you say? Are we going to be bees, or just Museum of Natural History keychains? We\'re bees! Keychain! Then follow me! Except Keychain. Hold on, Barry. Here. You\'ve earned this. Yeah! I\'m a Pollen Jock! And it\'s a perfect fit. All I gotta do are the sleeves. Oh, yeah. That\'s our Barry. Mom! The bees are back! If anybody needs to make a call, now\'s the time. I got a feeling we\'ll be working late tonight!', NULL, NULL, NULL, 2),
(60, '2FA3F', 'Here\'s your change. Have a great afternoon! Can I help who\'s next? Would you like some honey with that? It is bee-approved. Don\'t forget these. Milk, cream, cheese, it\'s all me. And I don\'t see a nickel! Sometimes I just feel like a piece of meat! I had no idea. Barry, I\'m sorry. Have you got a moment? Would you excuse me? My mosquito associate will help you. Sorry I\'m late. He\'s a lawyer too? I was already a blood-sucking parasite. All I needed was a briefcase. Have a great afternoon! Barry, I just got this huge tulip order, and I can\'t get them anywhere. No problem, Vannie. Just leave it to me. You\'re a lifesaver, Barry. Can I help who\'s next? All right, scramble, jocks! It\'s time to fly. Thank you, Barry! That bee is living my life! Let it go, Kenny. - When will this nightmare end?! - Let it all go. - Beautiful day to fly. - Sure is. Between you and me, I was dying to get out of that office. You have got to start thinking bee, my friend. - Thinking bee! - Me? Hold it. Let\'s just stop for a second. ', NULL, NULL, NULL, 2),
(61, '2FA3F', 'Hold it. I\'m sorry. I\'m sorry, everyone. Can we stop here? I\'m not making a major life decision during a production number! All right. Take ten, everybody. Wrap it up, guys. I had virtually no rehearsal for that. ', NULL, NULL, NULL, 2),
(62, '2FA3F', 'This is a new artifact', NULL, NULL, NULL, 3),
(63, '2FA3F', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus interdum at justo at feugiat. In sed venenatis elit. Proin arcu libero, dignissim nec mollis eu, efficitur eu magna. Ut blandit iaculis elit et rhoncus. Mauris id sapien imperdiet, interdum augue at, aliquam nisl. Vivamus placerat efficitur tortor, vitae tristique neque egestas ac. Ut mattis odio vestibulum varius feugiat. Morbi a dolor sit amet nisi consectetur sagittis in eget leo. Etiam sit amet efficitur lorem. Sed nec massa sem.', NULL, NULL, NULL, 4),
(64, '2FA3F', 'Cras pulvinar enim sed posuere molestie. Integer ultrices, leo sit amet hendrerit sodales, diam dui scelerisque nulla, vitae ullamcorper nulla purus ut magna. Cras elementum vitae augue ut maximus. Donec fringilla pellentesque dapibus. Proin non nisl sed sem laoreet luctus a nec leo. Nunc accumsan turpis et orci dictum, vitae efficitur ex ultricies. Nam consectetur, ipsum eget fringilla ultrices, nisi lacus mollis arcu, vitae varius tellus massa eu eros. Pellentesque eget sollicitudin massa, id mollis turpis. Vestibulum in lorem sit amet ligula pulvinar pellentesque eget in leo. Suspendisse blandit, purus non sagittis tempus, sem elit sodales risus, eleifend porttitor metus nunc a ligula. Cras venenatis ex a mi suscipit ornare. In fringilla sit amet ipsum ut molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus.', NULL, NULL, NULL, 4),
(65, '2FA3F', 'Fusce sagittis massa felis, sit amet finibus nibh placerat quis. Vestibulum ut velit ut dolor ultrices pharetra a sit amet neque. Nullam feugiat nunc in ex tincidunt, aliquam scelerisque orci molestie. Phasellus vehicula nulla nec arcu tempus, non placerat felis fermentum. Donec ligula felis, congue nec feugiat sed, venenatis sit amet nunc. Maecenas condimentum accumsan orci a euismod. Fusce maximus ipsum eget enim maximus, a vestibulum tellus rhoncus. Quisque laoreet gravida leo quis sagittis. Aliquam fermentum porttitor orci, eget venenatis turpis accumsan a. Praesent fermentum at eros sit amet consequat. Quisque aliquam lorem massa, at elementum tortor porttitor sit amet. Maecenas mollis neque id tempor luctus. Nam ornare ligula a ornare mattis.', NULL, NULL, NULL, 4),
(66, '2FA3F', 'Pellentesque dui purus, cursus id neque eu, bibendum bibendum nisl. Cras elementum ipsum suscipit pulvinar rhoncus. Duis elementum sit amet leo vitae vehicula. Suspendisse rutrum ut turpis ornare lobortis. Donec pretium, urna eu mollis auctor, arcu sapien ultricies leo, ut tincidunt magna metus eu odio. Cras vel velit felis. Vestibulum congue fermentum augue, in efficitur velit feugiat id. Suspendisse ut mauris sed mauris tempor tincidunt. Aliquam vehicula, diam eget pretium ullamcorper, mi magna hendrerit nibh, at commodo arcu lacus porta erat. Nam quam tortor, vulputate vitae velit quis, lobortis vestibulum tortor. Praesent quam nisi, malesuada eget suscipit sit amet, euismod sit amet arcu. Mauris commodo posuere arcu, sit amet vulputate tortor ultrices iaculis. Vestibulum pretium elit non suscipit commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;', NULL, NULL, NULL, 4),
(67, '2FA3F', 'Cras luctus fringilla erat ac laoreet. Praesent in tincidunt ex, nec vehicula urna. Proin aliquam egestas pharetra. Donec volutpat malesuada tortor. Pellentesque a nulla id augue molestie semper ac et tortor. Duis dapibus neque a erat pulvinar pulvinar. Vestibulum quis dolor eget tortor eleifend tempus nec in diam. Aliquam lacinia velit sit amet egestas eleifend. Mauris facilisis, lacus eget faucibus ultrices, sem justo sollicitudin diam, vitae fermentum turpis lorem eget tortor. Vestibulum ligula ante, eleifend vitae cursus quis, iaculis ac orci.', NULL, NULL, NULL, 4),
(68, '2FA3F', 'Nunc aliquam lobortis metus at sagittis. Aenean aliquet rutrum eros dapibus tempor. Etiam bibendum enim id elementum varius. Fusce feugiat elit nisi, nec fringilla odio hendrerit a. Aenean id velit in justo sodales lacinia a in ante. Aenean malesuada nisi interdum, ultrices urna eget, bibendum leo. Aenean nisi diam, congue at molestie eget, aliquet vel lacus. Nunc euismod non nisi tincidunt auctor. Duis fringilla, libero sit amet viverra lobortis, diam nulla ullamcorper diam, ut aliquet est risus in nunc. Pellentesque iaculis tortor eu lacinia euismod. Quisque convallis odio malesuada purus faucibus, vel finibus ex ullamcorper. Nam sed mi vestibulum, viverra erat egestas, interdum enim.', NULL, NULL, NULL, 4),
(69, '2FA3F', 'Cras diam enim, hendrerit vel sem at, convallis ornare ex. In viverra dui vitae sodales ullamcorper. Duis semper tempus justo non finibus. Maecenas at tempus nibh, ac fringilla ex. Phasellus ac interdum odio. Nulla facilisi. In dapibus, mi non mollis congue, nibh nunc malesuada purus, sed mollis orci libero at neque.', NULL, NULL, NULL, 4),
(70, '2FA3F', 'Vestibulum id condimentum nulla. Nunc dignissim orci ut euismod tempus. Morbi velit felis, tempor sed libero nec, dignissim dignissim turpis. Maecenas non commodo lectus, at elementum est. Sed fermentum interdum odio id eleifend. Quisque suscipit ligula felis, non placerat augue accumsan id. Proin vel velit sem. Aliquam ultrices, enim sit amet feugiat porttitor, purus velit tincidunt ligula, sagittis faucibus nisl massa eu tortor. Quisque vehicula augue lacus, vel iaculis augue posuere id. Morbi eu scelerisque nisi, sit amet pretium nibh. Vivamus tincidunt, ex id fermentum venenatis, justo metus convallis ante, ac auctor augue odio vel massa. Donec tempus est diam, sit amet commodo magna luctus id. In hac habitasse platea dictumst. Proin suscipit ut ligula sit amet pellentesque.', NULL, NULL, NULL, 4),
(71, '2FA3F', 'Nulla vel pharetra felis. Aliquam vehicula mattis enim, sit amet ultrices massa aliquam quis. Proin rutrum urna et justo scelerisque dapibus. Quisque tempor metus sed est ultrices, at fermentum enim rhoncus. Nam diam erat, finibus eget rutrum eu, dictum nec purus. Ut tempus dolor est, at dapibus tortor vehicula a. Praesent pretium metus vel arcu faucibus, nec congue magna bibendum. Mauris sagittis sodales arcu, in convallis lectus blandit ut. In vitae auctor orci. Pellentesque vitae diam quis felis cursus dignissim. Donec efficitur nisl ut pulvinar molestie. Curabitur auctor velit lorem, quis congue turpis luctus eu. Fusce sagittis sit amet neque a congue.', NULL, NULL, NULL, 4),
(72, '2FA3F', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus tincidunt iaculis mauris, non sodales justo blandit nec. Nulla commodo ornare tortor eu porta. Maecenas tellus nunc, auctor non ex et, semper placerat diam. Fusce bibendum ipsum id magna tincidunt pretium. Duis dapibus consectetur nunc vitae condimentum. Vivamus eu enim id erat faucibus lobortis. Pellentesque vehicula, sapien id fermentum consequat, sapien enim porta quam, a feugiat ligula urna vel mi. Nulla suscipit diam leo, vitae bibendum elit dapibus sit amet.', NULL, NULL, NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `artifact_change`
--

CREATE TABLE `artifact_change` (
  `id` int NOT NULL,
  `change_type` enum('create','name','description','split','merge','theme_children','labelled','deleted') NOT NULL,
  `description` text,
  `name` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `u_id` int NOT NULL,
  `p_id` int NOT NULL,
  `i_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `artifact_change`
--

INSERT INTO `artifact_change` (`id`, `change_type`, `description`, `name`, `timestamp`, `u_id`, `p_id`, `i_id`) VALUES
(1, 'create', NULL, '1', '2022-06-21 05:16:11', 1, 1, 1),
(2, 'create', NULL, '2', '2022-06-21 05:16:11', 1, 1, 2),
(3, 'create', NULL, '3', '2022-06-21 05:16:11', 1, 1, 3),
(4, 'create', NULL, '4', '2022-06-21 05:16:11', 1, 1, 4),
(5, 'create', NULL, '5', '2022-06-21 05:16:11', 1, 1, 5),
(6, 'create', NULL, '6', '2022-06-21 05:16:11', 1, 1, 6),
(7, 'create', NULL, '7', '2022-06-21 05:16:11', 1, 1, 7),
(8, 'create', NULL, '8', '2022-06-21 05:16:11', 1, 1, 8),
(9, 'create', NULL, '9', '2022-06-21 05:16:11', 1, 1, 9),
(10, 'create', NULL, '10', '2022-06-21 05:16:11', 1, 1, 10),
(11, 'create', NULL, '11', '2022-06-21 05:16:30', 1, 1, 11),
(12, 'labelled', 'label ; Emotion ; Happy ', '3', '2022-06-21 05:27:08', 2, 1, 3),
(13, 'labelled', 'label ; Technology ; Docker', '3', '2022-06-21 05:27:08', 2, 1, 3),
(14, 'labelled', 'label ; Emotion ; Happy ', '9', '2022-06-21 05:27:43', 2, 1, 9),
(15, 'labelled', 'label ; Technology ; Docker', '9', '2022-06-21 05:27:43', 2, 1, 9),
(16, 'labelled', 'label ; Emotion ; Happy ', '1', '2022-06-21 05:27:54', 2, 1, 1),
(17, 'labelled', 'label ; Technology ; HTML', '1', '2022-06-21 05:27:54', 2, 1, 1),
(18, 'labelled', 'label ; Emotion ; Sad', '5', '2022-06-21 05:28:06', 2, 1, 5),
(19, 'labelled', 'label ; Technology ; Angular', '5', '2022-06-21 05:28:06', 2, 1, 5),
(20, 'labelled', 'label ; Emotion ; Happy ', '2', '2022-06-21 05:28:20', 2, 1, 2),
(21, 'labelled', 'label ; Technology ; Flask', '2', '2022-06-21 05:28:20', 2, 1, 2),
(22, 'labelled', 'label ; Emotion ; Sleepy', '10', '2022-06-21 05:28:33', 2, 1, 10),
(23, 'labelled', 'label ; Technology ; HTML', '10', '2022-06-21 05:28:33', 2, 1, 10),
(24, 'labelled', 'label ; Emotion ; Angry ', '6', '2022-06-21 05:28:47', 2, 1, 6),
(25, 'labelled', 'label ; Technology ; Docker', '6', '2022-06-21 05:28:47', 2, 1, 6),
(26, 'labelled', 'label ; Emotion ; Excited', '7', '2022-06-21 05:29:00', 2, 1, 7),
(27, 'labelled', 'label ; Technology ; Laptop', '7', '2022-06-21 05:29:00', 2, 1, 7),
(28, 'labelled', 'label ; Emotion ; Angry ', '4', '2022-06-21 05:29:16', 2, 1, 4),
(29, 'labelled', 'label ; Technology ; SQL', '4', '2022-06-21 05:29:17', 2, 1, 4),
(30, 'labelled', 'label ; Emotion ; Curious', '11', '2022-06-21 05:29:31', 2, 1, 11),
(31, 'labelled', 'label ; Technology ; Software', '11', '2022-06-21 05:29:31', 2, 1, 11),
(32, 'labelled', 'label ; Emotion ; Scared', '8', '2022-06-21 05:29:44', 2, 1, 8),
(33, 'labelled', 'label ; Technology ; SQL', '8', '2022-06-21 05:29:44', 2, 1, 8),
(34, 'labelled', 'label ; Emotion ; Sad', '7', '2022-06-21 05:32:03', 3, 1, 7),
(35, 'labelled', 'label ; Technology ; Laptop', '7', '2022-06-21 05:32:03', 3, 1, 7),
(36, 'labelled', 'label ; Emotion ; Angry ', '5', '2022-06-21 05:32:14', 3, 1, 5),
(37, 'labelled', 'label ; Technology ; Laptop', '5', '2022-06-21 05:32:14', 3, 1, 5),
(38, 'labelled', 'label ; Emotion ; Scared', '6', '2022-06-21 05:32:25', 3, 1, 6),
(39, 'labelled', 'label ; Technology ; Software', '6', '2022-06-21 05:32:25', 3, 1, 6),
(40, 'labelled', 'label ; Emotion ; Happy ', '3', '2022-06-21 05:33:37', 6, 1, 3),
(41, 'labelled', 'label ; Technology ; Software', '3', '2022-06-21 05:33:37', 6, 1, 3),
(42, 'labelled', 'label ; Emotion ; Angry ', '9', '2022-06-21 05:33:46', 6, 1, 9),
(43, 'labelled', 'label ; Technology ; Software', '9', '2022-06-21 05:33:46', 6, 1, 9),
(44, 'labelled', 'label ; Emotion ; Happy ', '8', '2022-06-21 05:33:57', 6, 1, 8),
(45, 'labelled', 'label ; Technology ; Docker', '8', '2022-06-21 05:33:57', 6, 1, 8),
(46, 'labelled', 'label ; Emotion ; Happy ', '2', '2022-06-21 05:34:08', 6, 1, 2),
(47, 'labelled', 'label ; Technology ; SQL', '2', '2022-06-21 05:34:08', 6, 1, 2),
(48, 'labelled', 'label ; Emotion ; Happy ', '1', '2022-06-21 05:36:27', 5, 1, 1),
(49, 'labelled', 'label ; Technology ; HTML', '1', '2022-06-21 05:36:27', 5, 1, 1),
(50, 'labelled', 'label ; Emotion ; Excited', '4', '2022-06-21 05:37:39', 11, 1, 4),
(51, 'labelled', 'label ; Technology ; Flask', '4', '2022-06-21 05:37:39', 11, 1, 4),
(52, 'create', NULL, '12', '2022-06-21 05:44:53', 11, 2, 12),
(53, 'create', NULL, '13', '2022-06-21 05:44:53', 11, 2, 13),
(54, 'create', NULL, '14', '2022-06-21 05:44:53', 11, 2, 14),
(55, 'create', NULL, '15', '2022-06-21 05:44:53', 11, 2, 15),
(56, 'create', NULL, '16', '2022-06-21 05:44:53', 11, 2, 16),
(57, 'create', NULL, '17', '2022-06-21 05:44:53', 11, 2, 17),
(58, 'create', NULL, '18', '2022-06-21 05:44:53', 11, 2, 18),
(59, 'create', NULL, '19', '2022-06-21 05:44:53', 11, 2, 19),
(60, 'create', NULL, '20', '2022-06-21 05:44:53', 11, 2, 20),
(61, 'create', NULL, '21', '2022-06-21 05:44:53', 11, 2, 21),
(62, 'create', NULL, '22', '2022-06-21 05:44:53', 11, 2, 22),
(63, 'create', NULL, '23', '2022-06-21 05:44:53', 11, 2, 23),
(64, 'create', NULL, '24', '2022-06-21 05:44:53', 11, 2, 24),
(65, 'create', NULL, '25', '2022-06-21 05:44:53', 11, 2, 25),
(66, 'create', NULL, '26', '2022-06-21 05:44:53', 11, 2, 26),
(67, 'create', NULL, '27', '2022-06-21 05:44:53', 11, 2, 27),
(68, 'create', NULL, '28', '2022-06-21 05:44:53', 11, 2, 28),
(69, 'create', NULL, '29', '2022-06-21 05:44:53', 11, 2, 29),
(70, 'create', NULL, '30', '2022-06-21 05:44:53', 11, 2, 30),
(71, 'create', NULL, '31', '2022-06-21 05:44:53', 11, 2, 31),
(72, 'create', NULL, '32', '2022-06-21 05:44:53', 11, 2, 32),
(73, 'create', NULL, '33', '2022-06-21 05:44:53', 11, 2, 33),
(74, 'create', NULL, '34', '2022-06-21 05:44:53', 11, 2, 34),
(75, 'create', NULL, '35', '2022-06-21 05:44:53', 11, 2, 35),
(76, 'create', NULL, '36', '2022-06-21 05:44:53', 11, 2, 36),
(77, 'create', NULL, '37', '2022-06-21 05:44:53', 11, 2, 37),
(78, 'create', NULL, '38', '2022-06-21 05:44:53', 11, 2, 38),
(79, 'create', NULL, '39', '2022-06-21 05:44:53', 11, 2, 39),
(80, 'create', NULL, '40', '2022-06-21 05:44:53', 11, 2, 40),
(81, 'create', NULL, '41', '2022-06-21 05:44:53', 11, 2, 41),
(82, 'create', NULL, '42', '2022-06-21 05:44:53', 11, 2, 42),
(83, 'create', NULL, '43', '2022-06-21 05:44:53', 11, 2, 43),
(84, 'create', NULL, '44', '2022-06-21 05:44:53', 11, 2, 44),
(85, 'create', NULL, '45', '2022-06-21 05:44:53', 11, 2, 45),
(86, 'create', NULL, '46', '2022-06-21 05:44:53', 11, 2, 46),
(87, 'create', NULL, '47', '2022-06-21 05:44:53', 11, 2, 47),
(88, 'create', NULL, '48', '2022-06-21 05:44:53', 11, 2, 48),
(89, 'create', NULL, '49', '2022-06-21 05:44:53', 11, 2, 49),
(90, 'create', NULL, '50', '2022-06-21 05:44:53', 11, 2, 50),
(91, 'create', NULL, '51', '2022-06-21 05:44:53', 11, 2, 51),
(92, 'create', NULL, '52', '2022-06-21 05:44:53', 11, 2, 52),
(93, 'create', NULL, '53', '2022-06-21 05:44:53', 11, 2, 53),
(94, 'create', NULL, '54', '2022-06-21 05:44:53', 11, 2, 54),
(95, 'create', NULL, '55', '2022-06-21 05:44:53', 11, 2, 55),
(96, 'create', NULL, '56', '2022-06-21 05:44:53', 11, 2, 56),
(97, 'create', NULL, '57', '2022-06-21 05:44:53', 11, 2, 57),
(98, 'create', NULL, '58', '2022-06-21 05:44:53', 11, 2, 58),
(99, 'create', NULL, '59', '2022-06-21 05:44:53', 11, 2, 59),
(100, 'create', NULL, '60', '2022-06-21 05:44:53', 11, 2, 60),
(101, 'create', NULL, '61', '2022-06-21 05:44:53', 11, 2, 61),
(102, 'create', NULL, '62', '2022-06-21 05:46:08', 11, 3, 62),
(103, 'create', NULL, '63', '2022-06-21 10:11:40', 1, 4, 63),
(104, 'create', NULL, '64', '2022-06-21 10:11:40', 1, 4, 64),
(105, 'create', NULL, '65', '2022-06-21 10:11:40', 1, 4, 65),
(106, 'create', NULL, '66', '2022-06-21 10:11:40', 1, 4, 66),
(107, 'create', NULL, '67', '2022-06-21 10:11:40', 1, 4, 67),
(108, 'create', NULL, '68', '2022-06-21 10:11:40', 1, 4, 68),
(109, 'create', NULL, '69', '2022-06-21 10:11:40', 1, 4, 69),
(110, 'create', NULL, '70', '2022-06-21 10:11:40', 1, 4, 70),
(111, 'create', NULL, '71', '2022-06-21 10:11:40', 1, 4, 71),
(112, 'create', NULL, '72', '2022-06-21 10:11:40', 1, 4, 72),
(113, 'labelled', 'label ; Labels ; New', '65', '2022-06-21 10:12:35', 1, 4, 65),
(114, 'labelled', 'label ; Labels ; Old', '70', '2022-06-21 10:13:12', 1, 4, 70),
(115, 'labelled', 'label ; Labels ; Old', '67', '2022-06-21 10:13:17', 1, 4, 67),
(116, 'labelled', 'label ; Labels ; Old', '64', '2022-06-21 10:13:22', 1, 4, 64),
(117, 'labelled', 'label ; Labels ; Old', '66', '2022-06-21 10:13:31', 1, 4, 66),
(118, 'labelled', 'label ; Labels ; Old', '69', '2022-06-21 10:13:53', 1, 4, 69),
(119, 'labelled', 'label ; Labels ; Not new', '63', '2022-06-21 10:14:03', 1, 4, 63),
(120, 'labelled', 'label ; Labels ; Not old', '71', '2022-06-21 10:14:11', 1, 4, 71),
(121, 'labelled', 'label ; Labels ; Old', '68', '2022-06-21 10:14:16', 1, 4, 68),
(122, 'labelled', 'label ; Labels ; Not new', '72', '2022-06-21 10:14:21', 1, 4, 72),
(123, 'labelled', 'label ; Ideas ; Fun idea', '36', '2022-06-21 10:18:04', 1, 2, 36),
(124, 'labelled', 'label ; Ideas ; Boring idea', '56', '2022-06-21 10:18:12', 1, 2, 56),
(125, 'labelled', 'label ; Ideas ; Interesting idea', '52', '2022-06-21 10:18:42', 5, 2, 52),
(126, 'labelled', 'label ; Ideas ; Fun idea', '30', '2022-06-21 10:18:48', 5, 2, 30),
(127, 'labelled', 'label ; Ideas ; Boring idea', '59', '2022-06-21 10:18:54', 5, 2, 59),
(128, 'labelled', 'label ; Ideas ; Interesting idea', '23', '2022-06-21 10:19:00', 5, 2, 23),
(129, 'labelled', 'label ; Ideas ; Funny idea', '43', '2022-06-21 10:19:06', 5, 2, 43),
(130, 'labelled', 'label ; Ideas ; Boring idea', '15', '2022-06-21 10:19:25', 5, 2, 15),
(131, 'labelled', 'label ; Ideas ; Smart idea', '54', '2022-06-21 10:19:33', 5, 2, 54),
(132, 'labelled', 'label ; Ideas ; Genius idea', '53', '2022-06-21 10:19:39', 5, 2, 53),
(133, 'labelled', 'label ; Ideas ; Funny idea', '49', '2022-06-21 10:19:47', 5, 2, 49),
(134, 'merge', 'Smart-genius idea ; Ideas ; Genius idea', '53', '2022-06-21 10:20:21', 5, 2, 53),
(135, 'merge', 'Smart-genius idea ; Ideas ; Smart idea', '54', '2022-06-21 10:20:21', 5, 2, 54),
(136, 'labelled', 'label ; Ideas ; Boring idea', '59', '2022-06-21 10:21:38', 1, 2, 59),
(137, 'labelled', 'label ; Ideas ; Boring idea', '36', '2022-06-21 10:22:49', 4, 2, 36),
(138, 'labelled', 'label ; Ideas ; Boring idea', '54', '2022-06-21 10:23:00', 4, 2, 54),
(139, 'labelled', 'label ; Ideas ; Funny idea', '56', '2022-06-21 10:23:43', 4, 2, 56),
(140, 'labelled', 'label ; Ideas ; Genius idea', '52', '2022-06-21 10:23:57', 4, 2, 52),
(141, 'labelled', 'label ; Ideas ; Boring idea', '30', '2022-06-21 10:24:03', 4, 2, 30),
(142, 'merge', 'Fun life emotions ; Emotion ; Happy ', '1', '2022-06-21 10:26:51', 4, 1, 1),
(143, 'merge', 'Fun life emotions ; Emotion ; Happy ', '2', '2022-06-21 10:26:51', 4, 1, 2),
(144, 'merge', 'Fun life emotions ; Emotion ; Happy ', '3', '2022-06-21 10:26:51', 4, 1, 3),
(145, 'merge', 'Fun life emotions ; Emotion ; Happy ', '9', '2022-06-21 10:26:51', 4, 1, 9),
(146, 'merge', 'Fun life emotions ; Emotion ; Happy ', '8', '2022-06-21 10:26:51', 4, 1, 8),
(147, 'merge', 'Fun life emotions ; Emotion ; Excited', '7', '2022-06-21 10:26:51', 4, 1, 7),
(148, 'merge', 'Fun life emotions ; Emotion ; Excited', '4', '2022-06-21 10:26:51', 4, 1, 4),
(149, 'labelled', 'label ; Ideas ; Boring idea', '37', '2022-06-21 10:28:45', 4, 2, 37),
(150, 'labelled', 'label ; Ideas ; Funny idea', '33', '2022-06-21 10:28:51', 4, 2, 33),
(151, 'labelled', 'label ; Ideas ; Genius idea', '31', '2022-06-21 10:29:14', 4, 2, 31),
(152, 'labelled', 'label ; Ideas ; Smart-genius idea', '13', '2022-06-21 10:29:26', 4, 2, 13),
(153, 'labelled', 'label ; Ideas ; Funny idea', '61', '2022-06-21 10:30:04', 4, 2, 61),
(154, 'labelled', 'label ; Ideas ; Funny idea', '59', '2022-06-21 10:31:40', 4, 2, 59);

-- --------------------------------------------------------

--
-- Table structure for table `highlight`
--

CREATE TABLE `highlight` (
  `u_id` int NOT NULL,
  `a_id` int NOT NULL,
  `p_id` int NOT NULL,
  `id` int NOT NULL,
  `start` int NOT NULL,
  `end` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `label`
--

CREATE TABLE `label` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `lt_id` int NOT NULL,
  `description` text NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label`
--

INSERT INTO `label` (`id`, `name`, `lt_id`, `description`, `deleted`, `child_id`, `p_id`) VALUES
(1, 'Happy', 2, 'happy label', 0, NULL, 1),
(2, 'Sad', 2, 'Sad label', 0, NULL, 1),
(3, 'Excited', 2, 'Excited label', 0, NULL, 1),
(4, 'Angry', 2, 'Angry label', 0, NULL, 1),
(5, 'Frustracted', 2, 'Frustracted label', 0, NULL, 1),
(6, 'Scared', 2, 'Scared label', 0, NULL, 1),
(7, 'Sleepy', 2, 'Sleepy label', 0, NULL, 1),
(8, 'Curious', 2, 'Curious label', 0, NULL, 1),
(9, 'Docker', 1, 'Docker label', 0, NULL, 1),
(10, 'Angular', 1, 'Angular label', 0, NULL, 1),
(11, 'SQL', 1, 'SQL label', 0, NULL, 1),
(12, 'HTML', 1, 'HTML label', 0, NULL, 1),
(13, 'Flask', 1, 'Flask label', 0, NULL, 1),
(14, 'Laptop', 1, 'Laptop label', 0, NULL, 1),
(15, 'Software', 1, 'Software label', 0, NULL, 1),
(16, 'Dissapointed', 2, 'Dissapointed label', 0, NULL, 1),
(17, 'New Technology', 1, 'ne tech', 0, NULL, 1),
(18, 'New', 6, 'new label', 0, NULL, 4),
(19, 'Old', 6, 'old', 0, NULL, 4),
(20, 'Not new', 6, 'not new', 0, NULL, 4),
(21, 'Not old', 6, 'not old', 0, NULL, 4),
(22, 'Interesting idea', 3, 'interesting', 0, NULL, 2),
(23, 'Fun idea', 3, 'fun idea', 0, NULL, 2),
(24, 'Boring idea', 3, 'boring', 0, NULL, 2),
(25, 'Funny idea', 3, 'funny', 0, NULL, 2),
(26, 'Genius idea', 3, 'genius', 0, NULL, 2),
(27, 'Smart idea', 3, 'idea', 0, NULL, 2),
(28, 'Smart-genius idea', 3, 'This is a very smart idea', 0, NULL, 2),
(29, 'Fun life emotions', 2, 'fun', 0, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `labelling`
--

CREATE TABLE `labelling` (
  `u_id` int NOT NULL,
  `a_id` int NOT NULL,
  `lt_id` int NOT NULL,
  `l_id` int NOT NULL,
  `p_id` int NOT NULL,
  `remark` text,
  `time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `labelling`
--

INSERT INTO `labelling` (`u_id`, `a_id`, `lt_id`, `l_id`, `p_id`, `remark`, `time`) VALUES
(1, 36, 3, 23, 2, 'fun', '00:01:20'),
(1, 56, 3, 24, 2, 'boring', '00:00:06'),
(1, 59, 3, 24, 2, 'boring', '00:00:08'),
(1, 63, 6, 20, 4, 'not new', '00:00:08'),
(1, 64, 6, 19, 4, 'old', '00:00:03'),
(1, 65, 6, 18, 4, 'label', '00:00:39'),
(1, 66, 6, 19, 4, 'old', '00:00:07'),
(1, 67, 6, 19, 4, 'old', '00:00:03'),
(1, 68, 6, 19, 4, 'old', '00:00:03'),
(1, 69, 6, 19, 4, 'old', '00:00:06'),
(1, 70, 6, 19, 4, 'old', '00:00:35'),
(1, 71, 6, 21, 4, 'not old', '00:00:05'),
(1, 72, 6, 20, 4, 'not new', '00:00:04'),
(2, 1, 1, 12, 1, 'different', '00:00:10'),
(2, 1, 2, 29, 1, 'again', '00:00:10'),
(2, 2, 1, 11, 1, 'backend', '00:00:12'),
(2, 2, 2, 29, 1, 'positive', '00:00:12'),
(2, 3, 1, 17, 1, 'interesting', '00:00:21'),
(2, 3, 2, 29, 1, 'happy', '00:00:21'),
(2, 4, 1, 11, 1, 'database', '00:00:15'),
(2, 4, 2, 4, 1, 'negative', '00:00:15'),
(2, 5, 1, 10, 1, 'frontend', '00:00:12'),
(2, 5, 2, 2, 1, 'not the same', '00:00:12'),
(2, 6, 1, 9, 1, 'technology', '00:00:13'),
(2, 6, 2, 4, 1, 'angry', '00:00:13'),
(2, 7, 1, 14, 1, 'using a laptop', '00:00:13'),
(2, 7, 2, 29, 1, 'excited', '00:00:13'),
(2, 8, 1, 11, 1, 'backend', '00:00:12'),
(2, 8, 2, 6, 1, 'scared', '00:00:12'),
(2, 9, 1, 9, 1, 'interesting again', '00:00:33'),
(2, 9, 2, 29, 1, 'Another one', '00:00:33'),
(2, 10, 1, 12, 1, 'frontend', '00:00:12'),
(2, 10, 2, 7, 1, 'sleepy', '00:00:12'),
(2, 11, 1, 15, 1, 'software', '00:00:13'),
(2, 11, 2, 8, 1, 'curious', '00:00:13'),
(3, 5, 1, 14, 1, 'laptop', '00:00:10'),
(3, 5, 2, 4, 1, 'angry', '00:00:10'),
(3, 6, 1, 15, 1, 'software', '00:00:10'),
(3, 6, 2, 6, 1, 'scared tech', '00:00:10'),
(3, 7, 1, 14, 1, 'laptop tech', '00:00:15'),
(3, 7, 2, 2, 1, 'sad emotions', '00:00:15'),
(4, 13, 3, 28, 2, 'very grenius', '00:00:10'),
(4, 30, 3, 23, 2, 'boring', '00:00:04'),
(4, 31, 3, 26, 2, 'very smart', '00:00:07'),
(4, 33, 3, 25, 2, 'funny', '00:00:04'),
(4, 36, 3, 24, 2, 'cool', '00:00:05'),
(4, 37, 3, 24, 2, 'boring', '00:00:06'),
(4, 52, 3, 26, 2, 'smart', '00:00:05'),
(4, 54, 3, 24, 2, 'boring', '00:00:05'),
(4, 56, 3, 25, 2, 'funny', '00:00:09'),
(4, 59, 3, 24, 2, 'funnyyyy', '00:00:07'),
(4, 61, 3, 25, 2, 'very funny', '00:00:07'),
(5, 1, 1, 12, 1, 'frontend', '00:00:13'),
(5, 1, 2, 29, 1, 'positive', '00:00:13'),
(5, 15, 3, 24, 2, 'boring', '00:00:04'),
(5, 23, 3, 22, 2, 'cool', '00:00:04'),
(5, 30, 3, 23, 2, 'fun', '00:00:03'),
(5, 43, 3, 25, 2, 'funny', '00:00:04'),
(5, 49, 3, 25, 2, 'funny', '00:00:06'),
(5, 52, 3, 22, 2, 'interesting', '00:00:06'),
(5, 53, 3, 28, 2, 'smart', '00:00:04'),
(5, 54, 3, 28, 2, 'smart', '00:00:06'),
(5, 59, 3, 24, 2, 'boring', '00:00:04'),
(6, 2, 1, 11, 1, 'database', '00:00:10'),
(6, 2, 2, 29, 1, 'happy', '00:00:10'),
(6, 3, 1, 17, 1, 'software', '00:00:09'),
(6, 3, 2, 29, 1, 'happy', '00:00:09'),
(6, 8, 1, 9, 1, 'docker tech', '00:00:10'),
(6, 8, 2, 29, 1, 'happy', '00:00:10'),
(6, 9, 1, 15, 1, 'software', '00:00:09'),
(6, 9, 2, 4, 1, 'angry', '00:00:09'),
(11, 4, 1, 13, 1, 'backend', '00:00:13'),
(11, 4, 2, 29, 1, 'positive', '00:00:13');

-- --------------------------------------------------------

--
-- Table structure for table `label_change`
--

CREATE TABLE `label_change` (
  `id` int NOT NULL,
  `change_type` enum('create','name','description','split','merge','theme_children','labelled','deleted') NOT NULL,
  `description` text,
  `name` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `u_id` int NOT NULL,
  `p_id` int NOT NULL,
  `i_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label_change`
--

INSERT INTO `label_change` (`id`, `change_type`, `description`, `name`, `timestamp`, `u_id`, `p_id`, `i_id`) VALUES
(1, 'create', 'Emotion', 'Happy ', '2022-06-21 05:16:45', 1, 1, 1),
(2, 'create', 'Emotion', 'Sad', '2022-06-21 05:16:59', 1, 1, 2),
(3, 'create', 'Emotion', 'Excited', '2022-06-21 05:17:14', 1, 1, 3),
(4, 'create', 'Emotion', 'Angry label', '2022-06-21 05:17:32', 1, 1, 4),
(5, 'name', 'Angry ', 'Angry label', '2022-06-21 05:17:47', 4, 1, 4),
(6, 'create', 'Emotion', 'Frustracted', '2022-06-21 05:18:27', 1, 1, 5),
(7, 'create', 'Emotion', 'Scared', '2022-06-21 05:18:43', 1, 1, 6),
(8, 'create', 'Emotion', 'Sleepy', '2022-06-21 05:19:20', 1, 1, 7),
(9, 'create', 'Emotion', 'Curious', '2022-06-21 05:19:40', 1, 1, 8),
(10, 'create', 'Technology', 'Docker', '2022-06-21 05:20:11', 1, 1, 9),
(11, 'create', 'Technology', 'Angular', '2022-06-21 05:20:28', 1, 1, 10),
(12, 'create', 'Technology', 'SQL', '2022-06-21 05:20:38', 1, 1, 11),
(13, 'create', 'Technology', 'HTML', '2022-06-21 05:20:51', 1, 1, 12),
(14, 'create', 'Technology', 'Flask', '2022-06-21 05:21:08', 1, 1, 13),
(15, 'create', 'Technology', 'Laptop', '2022-06-21 05:21:29', 1, 1, 14),
(16, 'create', 'Technology', 'Software', '2022-06-21 05:22:14', 1, 1, 15),
(17, 'create', 'Emotion', 'Dissapointed', '2022-06-21 05:26:19', 2, 1, 16),
(18, 'create', 'Technology', 'New Technology', '2022-06-21 10:10:46', 1, 1, 17),
(19, 'create', 'Labels', 'New', '2022-06-21 10:12:11', 1, 4, 18),
(20, 'create', 'Labels', 'Old', '2022-06-21 10:12:46', 1, 4, 19),
(21, 'create', 'Labels', 'Not new', '2022-06-21 10:12:55', 1, 4, 20),
(22, 'create', 'Labels', 'Not old', '2022-06-21 10:13:07', 1, 4, 21),
(23, 'create', 'Ideas', 'Interesting idea', '2022-06-21 10:16:56', 1, 2, 22),
(24, 'create', 'Ideas', 'Fun idea', '2022-06-21 10:17:08', 1, 2, 23),
(25, 'create', 'Ideas', 'Boring idea', '2022-06-21 10:17:18', 1, 2, 24),
(26, 'create', 'Ideas', 'Funny idea', '2022-06-21 10:17:31', 1, 2, 25),
(27, 'create', 'Ideas', 'Genius idea', '2022-06-21 10:17:44', 1, 2, 26),
(28, 'create', 'Ideas', 'Smart idea', '2022-06-21 10:17:56', 1, 2, 27),
(29, 'merge', 'Smart-genius idea ; Ideas ; Genius idea,Smart idea', 'Smart-genius idea', '2022-06-21 10:20:21', 5, 2, 28),
(30, 'merge', 'Fun life emotions ; Emotion ; Happy ,Excited', 'Fun life emotions', '2022-06-21 10:26:51', 4, 1, 29);

-- --------------------------------------------------------

--
-- Table structure for table `label_to_theme`
--

CREATE TABLE `label_to_theme` (
  `p_id` int DEFAULT NULL,
  `t_id` int NOT NULL,
  `l_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label_to_theme`
--

INSERT INTO `label_to_theme` (`p_id`, `t_id`, `l_id`) VALUES
(1, 1, 8),
(1, 1, 29),
(1, 2, 2),
(1, 2, 4),
(1, 2, 5),
(1, 2, 6),
(1, 2, 7),
(1, 2, 16),
(1, 3, 11),
(1, 3, 13),
(1, 4, 10),
(1, 4, 12),
(1, 5, 14),
(1, 5, 15),
(1, 7, 11),
(1, 9, 11);

-- --------------------------------------------------------

--
-- Table structure for table `label_type`
--

CREATE TABLE `label_type` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `label_type`
--

INSERT INTO `label_type` (`id`, `name`, `p_id`) VALUES
(2, 'Emotion', 1),
(1, 'Technology', 1),
(3, 'Ideas', 2),
(4, 'Code', 3),
(5, 'Language', 3),
(6, 'Labels', 4),
(7, 'Words', 5);

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `p_id` int NOT NULL,
  `u_id` int NOT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`p_id`, `u_id`, `admin`, `deleted`) VALUES
(1, 1, 1, 0),
(1, 2, 1, 0),
(1, 3, 1, 0),
(1, 4, 1, 0),
(1, 5, 1, 0),
(1, 6, 0, 0),
(1, 7, 0, 0),
(1, 8, 0, 0),
(1, 9, 0, 0),
(1, 10, 0, 0),
(1, 11, 1, 0),
(2, 1, 1, 0),
(2, 2, 1, 0),
(2, 3, 0, 0),
(2, 4, 0, 0),
(2, 5, 0, 0),
(2, 6, 1, 0),
(2, 11, 1, 0),
(3, 1, 1, 0),
(3, 2, 0, 0),
(3, 11, 1, 0),
(4, 1, 1, 0),
(4, 11, 1, 0),
(5, 1, 1, 0),
(5, 11, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text,
  `criteria` int DEFAULT NULL,
  `frozen` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `name`, `description`, `criteria`, `frozen`) VALUES
(1, 'Project 1', 'There are 11 conflicts and 11 users. There are 2 label types and 18 labels.  The settings are set to have a labeller count of 2. There are 6 project admins: user1, user2, user3, user4, user10 and admin. There are 7 themes, with one subtheme \"Database technology\" from \"Backend technology\"', 2, 0),
(2, 'Project 2', 'This project has 1 label type, 7 labels, and 7 users.  There are 4 conflicts. The labeller count 3. The project admins are user1, user5, user10 and admin.', 3, 0),
(3, 'Project 3', 'There are 2 label types and 3 users. Project admins are user10 and admin. There is 1 artifact.', 2, 0),
(4, 'Project 4', 'This is a project with 10 artifacts, 1 label type and 4 labels. The labeller count is 1. All the artifacts have been labelled.', 2, 0),
(5, 'Project 5', 'Completely empty project with just user 10 in it. There is 1 label type', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE `theme` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text,
  `deleted` tinyint(1) DEFAULT NULL,
  `super_theme_id` int DEFAULT NULL,
  `p_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `theme`
--

INSERT INTO `theme` (`id`, `name`, `description`, `deleted`, `super_theme_id`, `p_id`) VALUES
(1, 'Positive emotions', 'These are positive emotions', 0, NULL, 1),
(2, 'Negative emotions', 'These are negative emotions', 0, NULL, 1),
(3, 'Backend technology', 'These are backend technologies', 0, NULL, 1),
(4, 'Frontend technologies', 'These are frontend technologies', 0, NULL, 1),
(5, 'Technology', 'This is technology', 0, NULL, 1),
(6, 'Neutral emotions', 'These are neutral emotions', 0, NULL, 1),
(7, 'Database technology', 'These are database technologies', 0, 3, 1),
(8, 'Empty theme', 'Empty theme desc', 0, NULL, 1),
(9, 'SQL', 'SQL', 0, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `theme_change`
--

CREATE TABLE `theme_change` (
  `id` int NOT NULL,
  `change_type` enum('create','name','description','split','merge','theme_children','labelled','deleted') NOT NULL,
  `description` text,
  `name` text NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `u_id` int NOT NULL,
  `p_id` int NOT NULL,
  `i_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `theme_change`
--

INSERT INTO `theme_change` (`id`, `change_type`, `description`, `name`, `timestamp`, `u_id`, `p_id`, `i_id`) VALUES
(1, 'create', NULL, 'Positive emotions', '2022-06-21 05:22:50', 1, 1, 1),
(2, 'theme_children', 'label ; Happy ,Excited,Curious', 'Positive emotions', '2022-06-21 05:22:50', 1, 1, 1),
(3, 'create', NULL, 'Negative emotions', '2022-06-21 05:23:18', 1, 1, 2),
(4, 'theme_children', 'label ; Sad,Angry ,Frustracted,Scared,Sleepy', 'Negative emotions', '2022-06-21 05:23:18', 1, 1, 2),
(5, 'create', NULL, 'Backend technology', '2022-06-21 05:23:40', 1, 1, 3),
(6, 'theme_children', 'label ; SQL,Flask', 'Backend technology', '2022-06-21 05:23:40', 1, 1, 3),
(7, 'create', NULL, 'Frontend technologies', '2022-06-21 05:24:13', 1, 1, 4),
(8, 'theme_children', 'label ; Angular,HTML', 'Frontend technologies', '2022-06-21 05:24:13', 1, 1, 4),
(9, 'create', NULL, 'Technology', '2022-06-21 05:24:43', 1, 1, 5),
(10, 'theme_children', 'label ; Laptop,Software', 'Technology', '2022-06-21 05:24:43', 1, 1, 5),
(11, 'create', NULL, 'Neutral emotions', '2022-06-21 05:25:09', 1, 1, 6),
(12, 'theme_children', 'label ; Sad,Angry ,Frustracted,Scared,Sleepy,Dissapointed', 'Negative emotions', '2022-06-21 05:26:42', 2, 1, 2),
(13, 'create', NULL, 'Database technology', '2022-06-21 05:30:45', 2, 1, 7),
(14, 'theme_children', 'label ; SQL', 'Database technology', '2022-06-21 05:30:45', 2, 1, 7),
(15, 'theme_children', 'subtheme ; Database technology', 'Backend technology', '2022-06-21 05:30:59', 2, 1, 3),
(16, 'merge', 'Fun life emotions ; Emotion ; Happy ', 'Positive emotions', '2022-06-21 10:26:51', 4, 1, 1),
(17, 'merge', 'Fun life emotions ; Emotion ; Excited', 'Positive emotions', '2022-06-21 10:26:51', 4, 1, 1),
(18, 'create', NULL, 'Empty theme', '2022-06-23 09:37:32', 1, 1, 8),
(19, 'create', NULL, 'SQL', '2022-06-26 18:40:37', 1, 1, 9),
(20, 'theme_children', 'label ; SQL', 'SQL', '2022-06-26 18:40:37', 1, 1, 9),
(21, 'theme_children', 'subtheme ; Database technology,SQL', 'Backend technology', '2022-06-26 18:40:47', 1, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(320) NOT NULL,
  `status` enum('pending','approved','denied','deleted') NOT NULL,
  `description` text,
  `super_admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `status`, `description`, `super_admin`) VALUES
(1, 'admin', 'pbkdf2:sha256:260000$2P9aWXjiUexx1ebo$799d3114e2e0dd39a1eb2bc214761aca501d7eb7b0eafcd044b4cc96fda55500', '', 'approved', 'Auto-generated super admin', 1),
(2, 'user1', 'pbkdf2:sha256:260000$ArQ5WOAxgaXL58S3$f0c6c1d39a5086268c7fecdaad8c96d2314a324002995f7b82a65808bae76b33', 'user1@test.com', 'approved', 'test', 0),
(3, 'user2', 'pbkdf2:sha256:260000$xgoMCrVvck3qpaO2$e1c81b6db96a3481efbd8f40bea2456b5097ce9d3f84c37b9a62ffe849fdf3b9', 'user2@test.com', 'approved', 'test', 0),
(4, 'user3', 'pbkdf2:sha256:260000$h2YhBIXdsa13l0UL$f24986b6f7489bd0d9ee8d7cef4a7e766b4987a20ca7cd73d8bdd8edf9312a9c', 'user3@test.com', 'approved', 'test', 0),
(5, 'user4', 'pbkdf2:sha256:260000$ObrkJd5p9lFboeah$44cdc1a2fb5827a102f7986ea32ba2ec1271876283cc83ded5e2a44a49136d43', 'user4@test.com', 'approved', 'test', 0),
(6, 'user5', 'pbkdf2:sha256:260000$kdhXUseilKeReHw5$0c1eb8df47a09e7661fe59cccd489bfb6edf3cfb9cfc40e2e0a3f5437a31fe72', 'user5@test.com', 'approved', 'test', 0),
(7, 'user6', 'pbkdf2:sha256:260000$5bFZMq1ZtWT21B0u$ab2203242df16a990580d78bb1f9c4303b0aed91000749fa8441cb925f413006', 'user6@test.com', 'approved', 'test', 0),
(8, 'user7', 'pbkdf2:sha256:260000$evBnMUNrVDVvfkeP$1f18addc46e293d2a499660c1d6ebe1799b325f42b91ec972898c7f0634459a4', 'user7@test.com', 'approved', 'test', 0),
(9, 'user8', 'pbkdf2:sha256:260000$v60w0XFD5RBm7eVw$69a1e4d80530affcfb5309ca8f92fd556459cee1c53e2fc212c2d3b90cdc1689', 'user8@test.com', 'approved', 'test', 0),
(10, 'user9', 'pbkdf2:sha256:260000$7jWxfDeq6EkGlpqS$04b59128a9d9906bd5ab4c11d145bf8bf8720b4424117df8e9890e63a5f550c0', 'user9@test.com', 'approved', 'test\n', 0),
(11, 'user10', 'pbkdf2:sha256:260000$inOHQtvuCm6wC5C9$be389a121e2a4b62311ce715e5770103b854dd5a5e721760a5b1f425d0c82518', 'user10@test.com', 'approved', 'test', 0),
(12, 'vicbog11', 'pbkdf2:sha256:260000$qNGmCWZfKFCzz4hN$7a0bdf19df4045adfed700fc6ecc0538dc155915e08f2aeeb339664e6a8dc39c', 'test@test.com', 'approved', 'test', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alembic_version`
--
ALTER TABLE `alembic_version`
  ADD PRIMARY KEY (`version_num`);

--
-- Indexes for table `artifact`
--
ALTER TABLE `artifact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `artifact_change`
--
ALTER TABLE `artifact_change`
  ADD PRIMARY KEY (`id`),
  ADD KEY `i_id` (`i_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `highlight`
--
ALTER TABLE `highlight`
  ADD PRIMARY KEY (`id`),
  ADD KEY `a_id` (`a_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `label`
--
ALTER TABLE `label`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_uniqueness` (`p_id`,`name`),
  ADD KEY `child_id` (`child_id`),
  ADD KEY `lt_id` (`lt_id`);

--
-- Indexes for table `labelling`
--
ALTER TABLE `labelling`
  ADD PRIMARY KEY (`u_id`,`a_id`,`lt_id`),
  ADD KEY `a_id` (`a_id`),
  ADD KEY `l_id` (`l_id`),
  ADD KEY `lt_id` (`lt_id`),
  ADD KEY `p_id` (`p_id`);

--
-- Indexes for table `label_change`
--
ALTER TABLE `label_change`
  ADD PRIMARY KEY (`id`),
  ADD KEY `i_id` (`i_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `label_to_theme`
--
ALTER TABLE `label_to_theme`
  ADD PRIMARY KEY (`t_id`,`l_id`),
  ADD KEY `l_id` (`l_id`),
  ADD KEY `p_id` (`p_id`);

--
-- Indexes for table `label_type`
--
ALTER TABLE `label_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_uniqueness` (`p_id`,`name`);

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`p_id`,`u_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `theme`
--
ALTER TABLE `theme`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_uniqueness` (`p_id`,`name`),
  ADD KEY `super_theme_id` (`super_theme_id`);

--
-- Indexes for table `theme_change`
--
ALTER TABLE `theme_change`
  ADD PRIMARY KEY (`id`),
  ADD KEY `i_id` (`i_id`),
  ADD KEY `p_id` (`p_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artifact`
--
ALTER TABLE `artifact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `artifact_change`
--
ALTER TABLE `artifact_change`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `highlight`
--
ALTER TABLE `highlight`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `label`
--
ALTER TABLE `label`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `label_change`
--
ALTER TABLE `label_change`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `label_type`
--
ALTER TABLE `label_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `theme`
--
ALTER TABLE `theme`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `theme_change`
--
ALTER TABLE `theme_change`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artifact`
--
ALTER TABLE `artifact`
  ADD CONSTRAINT `artifact_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `artifact_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `artifact` (`id`);

--
-- Constraints for table `artifact_change`
--
ALTER TABLE `artifact_change`
  ADD CONSTRAINT `artifact_change_ibfk_1` FOREIGN KEY (`i_id`) REFERENCES `artifact` (`id`),
  ADD CONSTRAINT `artifact_change_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `artifact_change_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `highlight`
--
ALTER TABLE `highlight`
  ADD CONSTRAINT `highlight_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `artifact` (`id`),
  ADD CONSTRAINT `highlight_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `highlight_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `label`
--
ALTER TABLE `label`
  ADD CONSTRAINT `label_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `label_ibfk_2` FOREIGN KEY (`lt_id`) REFERENCES `label_type` (`id`),
  ADD CONSTRAINT `label_ibfk_3` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`);

--
-- Constraints for table `labelling`
--
ALTER TABLE `labelling`
  ADD CONSTRAINT `labelling_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `artifact` (`id`),
  ADD CONSTRAINT `labelling_ibfk_2` FOREIGN KEY (`l_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `labelling_ibfk_3` FOREIGN KEY (`lt_id`) REFERENCES `label_type` (`id`),
  ADD CONSTRAINT `labelling_ibfk_4` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `labelling_ibfk_5` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `label_change`
--
ALTER TABLE `label_change`
  ADD CONSTRAINT `label_change_ibfk_1` FOREIGN KEY (`i_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `label_change_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `label_change_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `label_to_theme`
--
ALTER TABLE `label_to_theme`
  ADD CONSTRAINT `label_to_theme_ibfk_1` FOREIGN KEY (`l_id`) REFERENCES `label` (`id`),
  ADD CONSTRAINT `label_to_theme_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `label_to_theme_ibfk_3` FOREIGN KEY (`t_id`) REFERENCES `theme` (`id`);

--
-- Constraints for table `label_type`
--
ALTER TABLE `label_type`
  ADD CONSTRAINT `label_type_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`);

--
-- Constraints for table `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `theme`
--
ALTER TABLE `theme`
  ADD CONSTRAINT `theme_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `theme_ibfk_2` FOREIGN KEY (`super_theme_id`) REFERENCES `theme` (`id`);

--
-- Constraints for table `theme_change`
--
ALTER TABLE `theme_change`
  ADD CONSTRAINT `theme_change_ibfk_1` FOREIGN KEY (`i_id`) REFERENCES `theme` (`id`),
  ADD CONSTRAINT `theme_change_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `project` (`id`),
  ADD CONSTRAINT `theme_change_ibfk_3` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
