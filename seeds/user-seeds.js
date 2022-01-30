const { User } = require('../models');

const userData = [
  {
    username: 'Brandon',
    email: 'brandon@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '2001/4/12',
    bio: 'Im a high school student and freelance hero/vigilante. I like to work on coding projects related to security and data encryption',
    education: 'High School',
  },
  {
    username: 'Cody',
    email: 'cody@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '2001/4/12',
    bio: 'Im a high school student and freelance hero/vigilante. I like to work on coding projects related to security and data encryption',
    education: 'High School',
  },
  {
    username: 'bachmeister',
    email: 'erlbach@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Silicon Valley',
    profile_image:
      'https://media.allure.com/photos/5a555213cacd0c487a51e915/3:2/w_2687,h_1791,c_limit/GettyImages-628741288.jpg',
    birthday: '1969/4/20',
    bio: 'Founder of Pied Piper. I am a highly distinguished businessman with a kick ass and take names mentality. I smoke the occasional joint and Im not afraid to tell it how it is. My coding career has taken a significant decline due to my carpel tunnel diagnoses. Currently looking for a team of engineers to design and build the next ebay.',
    education: 'High School',
  },
  {
    username: 'bigheadboi',
    email: 'nellybighetti@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Silicon Valley',
    profile_image:
      'https://www.themoviedb.org/t/p/original/sIyQYq2imu1V2RxRQ1zp70RSqTi.jpg',
    birthday: '1990/3/20',
    bio: "He is later removed from the Nucleus project due to his lack of technical knowledge, and has absolutely no responsibilities at Hooli. He was later promoted further to make it appear that he was the actual creator of Pied Piper while working at Hooli, but he is unaware of this. After a disastrous binding arbitration with Pied Piper, Gavin makes Big Head redundant and pays him $20 million in severance, which he blows through very quickly when Erlich tricks him into entering into a business arrangement with him, naming their firm, 'Bachmanity'",
    education: 'Doctoral Degree',
  },
  {
    username: 'bertram11',
    email: 'bman11@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Silicon Valley',
    profile_image:
      'https://static.wikia.nocookie.net/comedybangbang/images/3/3e/Starr.jpg/revision/latest?cb=20130626165235',
    birthday: '1985/12/12',
    bio: 'online security expert, and as such is responsible for system administration and server configuration at Pied Piper',
    education: 'High School',
  },
  {
    username: 'chosen1',
    email: 'neo@gmail.com',
    password: 'password',
    state: 'Hawaii',
    city: 'Hilo',
    profile_image:
      'https://www.looper.com/img/gallery/lines-in-the-matrix-movies-that-mean-more-than-you-realized/intro-1564174093.jpg',
    birthday: '1999/3/11',
    bio: 'Im is a quiet man, who thinks more than he speaks. I also have no problem learning how to fight and holding his my own in a coding battle. I quickly rose to the responsibility of saving his friends when they are in danger, and he even begins to believe that he might be able to save the entire human race. Im looking for like minded individuals looking to free people from the Matrix',
    education: 'Doctoral Degree',
  },
  {
    username: 'joeschmo',
    email: 'joe@gmail.com',
    password: 'password',
    state: 'Alabama',
    city: 'Mobile',
    profile_image:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-jimmy-neutron/l-intro-1602679825.jpg',
    birthday: '1995/7/4',
    bio: 'I have been studying web development since 2009 and I develop in both C# and PHP, though I primarily use C#. I am experienced in both front and back-end development, and I am proficient in HTML/HTML5, CSS/CSS3, LESS, SASS, XML, JavaScript, jQuery, AJAX, and SQL/MySQL/PostgreSQL, to name a few. I am also proficient in many non-web-based languages, including but not limited to Java, Scheme/Racket, C, ACL2 (LISP), and MIPS Assembly. I have also worked on some smaller Python projects, and have used the language to create one-time use tools for data processing and similar purposes',
    education: "Master's Degree",
  },
  {
    username: 'boygenius12',
    email: 'jimmy@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Nashville',
    profile_image:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-jimmy-neutron/l-intro-1602679825.jpg',
    birthday: '2000/3/2',
    bio: 'I am a Sitecore Certified Professional Web Developer, and have been developing enterprise solutions using the Sitecore content management system since 2012. I have worked on over ten different Sitecore solutions, ranging from a major travel engine',
    education: 'Boot Camp Certification',
  },
  {
    username: 'hennythingispossible',
    email: 'hendog@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image:
      'https://cdn.shopify.com/s/files/1/0293/9277/products/Hennything_Is_Possible_Short_Sleeve_Crew_Tee_-_Black_MH_468x.jpg?v=1611964536',
    birthday: '1989/4/20',
    bio: 'Anything is possible. wanting to learn more about node js and how to build web apis ya hurddddd',
    education: "Associate's Degree",
  },
  {
    username: 'kimp',
    email: 'kimpossible@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image:
      'https://www.https://blog.texasbar.com/files/2011/12/housto-bankruptcy-attorney-adam-schachter1.jpg.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '2001/6/32',
    bio: 'Im a high school student and freelance hero/vigilante. I like to work on coding projects related to security and data encryption',
    education: 'High School',
  },
  {
    username: 'simpsona1',
    email: 'simp@gmail.com',
    password: 'password',
    state: 'Nebraska',
    city: 'Lincon',
    profile_image:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '2001/4/12',
    bio: 'Coffee junkie. Analyst. Incurable beer specialist. Proud social media lover. Web ninja. Lifelong alcoholaholic."',
    education: 'High School',
  },
  {
    username: 'verus431',
    email: 'versus@gmail.com',
    password: 'password',
    state: 'Pensilvania',
    city: 'Scranton',
    profile_image: '',
    birthday: '2001/4/12',
    bio: 'Proud problem solver. Hardcore travelaholic. Creator. Internet enthusiast. Troublemaker. Reader."',
    education: "Bachelor's Degree",
  },
  {
    username: 'kennyl',
    email: 'ken@gmail.com',
    password: 'password',
    state: 'Texas',
    city: 'Austin',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/gaf722d5be9f30c451871dd1dc75669b6f56a086941a0bc27d822b3b2f7e4b0a291b672326d65b6e92b76211c652487c5_640.jpg',
    birthday: '1990/8/12',
    bio: 'Avid twitter expert. Lifelong travel specialist. Infuriatingly humble troublemaker. Freelance social media ninja. Devoted reader',
    education: "Master's Degree",
  },
  {
    username: 'jennp',
    email: 'jenp@gmail.com',
    password: 'password',
    state: 'Texas',
    city: 'Houston',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/gfc47389984697c096f32cff6ef7f6a08ca7c646ac3d1766aeaa987c4404267bb8fb6877a32229a86121ff842e0fd7553_640.jpg',
    birthday: '1997/3/12',
    bio: 'Travel expert. Award-winning web fanatic. Tv scholar. Hipster-friendly writer. Music practitioner',
    education: 'Doctoral Degree',
  },
  {
    username: 'lennykenny',
    email: 'lenken@gmail.com',
    password: 'password',
    state: 'Maryland',
    city: 'Baltimore',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g807c681d5f257eb8c3961d9565e9692d444f7f8a056352c391d962acf3f4e5901e68cb72a188e355b90a4dd879a45178_640.jpg',
    birthday: '1980/5/12',
    bio: 'Lifelong beer geek. Evil bacon junkie. Internet fan. Proud troublemaker. Travel guru. Devoted coffeeaholic',
    education: "Bachelor's Degree",
  },
  {
    username: 'wren87654',
    email: 'wren7654@gmail.com',
    password: 'password',
    state: 'New Mexico',
    city: 'Santa Fe',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g5d8c66cb0f69f011ab5315c6e3b29c5250a2c59f03c9fb0136a638b1bb9b2d20172975768ce3425bde4d664b712ace74_640.jpg',
    birthday: '1990/8/12',
    bio: 'Coffee guru. Proud zombie scholar. Beer nerd. Unapologetic web ninja. Communicator.',
    education: 'High School',
  },
  {
    username: 'arnoldpal',
    email: 'palmer@gmail.com',
    password: 'password',
    state: 'Illinois',
    city: 'Chicago',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g93cba33c199271afc9093ab785c9c112c2755189d534a55e70d3dfc633da7fc7f2bf105dba1088c76a396106fb473790_640.jpg',
    birthday: '1990/8/12',
    bio: 'Evil coffee scholar. Analyst. Typical pop cultureaholic. Passionate reader. Social media guru. Professional troublemaker. Problem solver. Introvert.',
    education: "Bachelor's Degree",
  },
  {
    username: 'denzellllll',
    email: 'denz@gmail.com',
    password: 'password',
    state: 'Massachusetts',
    city: 'Boston',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g69b41a50682984f0e04b9720b4dc30d30e91cabaa59cdc4edf0dd41918f85cd798335f5b3d69811ad9b191d51839a79c_640.jpg',
    birthday: '1943/3/22',
    bio: 'Evil coffee scholar. Analyst. Typical pop cultureaholic. Passionate reader. Social media guru. Professional troublemaker. Problem solver. Introvert',
    education: "Bachelor's Degree",
  },
  {
    username: 'ryanrenolds',
    email: 'ren@gmail.com',
    password: 'password',
    state: 'Oaklahoma',
    city: 'Tulsa',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g1f3229025c3d5bfe285df1d4bad25c71ec473af8e98d80bb634561616ccd9788e5486c896768a6c1b04aeafa2fae4746_640.jpg',
    birthday: '1993/2/12',
    bio: 'Reader. Hardcore thinker. Explorer. Typical bacon scholar. Zombie fanatic. Lifelong writer. Social media ninja. Gamer.',
    education: "Bachelor's Degree",
  },
  {
    username: 'rachelray',
    email: 'rayray@gmail.com',
    password: 'password',
    state: 'Colorado',
    city: 'Boulder',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/gacb8cc9304c81ce7a7afe7f81cdee14d6c68624917b0483b025f5923a271b7a2f328bdf3c2d59a54223ff6cc969ced02_640.jpg',
    birthday: '1990/8/12',
    bio: 'Evil communicator. Writer. Introvert. Freelance zombie lover. Professional organizer. Music junkie. Falls down a lot. Troublemaker',
    education: "Master's Degree",
  },
  {
    username: 'lettucemaine',
    email: 'letuce@gmail.com',
    password: 'password',
    state: 'Colorado',
    city: 'Denver',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/ge18dafc748d9d09769ac4fbd789c2b4da6e0f2117410eea4c27f73065f185654161914966510076b981300fc7f636128_640.jpg',
    birthday: '1990/8/12',
    bio: 'Friendly social media trailblazer. Hipster-friendly internet expert. Reader',
    education: 'Doctoral Degree',
  },
  {
    username: 'vinceyounf',
    email: 'thevincey@gmail.com',
    password: 'password',
    state: 'Colorado',
    city: 'Colorado Springs',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g7e601fc028f2baf27b26aa65d75e26d74d7efe971c62e75b054072da44803395061aa0305e1edf1c208fbfccf1c6a039_640.jpg',
    birthday: '1969/8/12',
    bio: 'Internet fanatic. Subtly charming social media ninja. Total troublemaker. Reader. Incurable bacon fanatic. Wannabe tv buff',
    education: "Master's Degree",
  },
  {
    username: 'timber',
    email: 'tim@gmail.com',
    password: 'password',
    state: 'Colorado',
    city: 'Boulder',
    profile_image:
      'https://randompicturegenerator.com/img/people-generator/g482351495b890bc17fd5702f0c5feddeee3cf78bdfd61305cf29a144e45a9ed5bdf3463a54deb2db58537db6889f510c_640.jpg',
    birthday: '1990/8/12',
    bio: 'Creator. Explorer. Beer fanatic. Writer. Zombie expert. Social media practitioner. Hipster-friendly troublemaker. Web fan.',
    education: "Bachelor's Degree",
  },
  {
    username: 'shreder',
    email: 'snowplow@gmail.com',
    password: 'password',
    state: 'Florida',
    city: 'Tampa',
    profile_image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1999/9/22',
    bio: 'Creator. Explorer. Beer fanatic. Writer. Zombie expert. Social media practitioner. Hipster-friendly troublemaker. Web fan',
    education: "Bachelor's Degree",
  },
  {
    username: 'tombrady',
    email: 'tb12@gmail.com',
    password: 'password',
    state: 'Florida',
    city: 'Jacksonville',
    profile_image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1997/8/12',
    bio: 'CProne to fits of apathy. Falls down a lot. Bacon geek. Devoted twitter ninja. Proud music expert. Avid coffee practitioner. Pop culture specialist',
    education: 'High School',
  },
  {
    username: 'whodey',
    email: 'bengalsfan99@gmail.com',
    password: 'password',
    state: 'Ohio',
    city: 'Cincinatti',
    profile_image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1990/8/12',
    bio: 'Wannabe beer specialist. Travel nerd. Gamer. Zombie guru. Organizer. Social media trailblazer',
    education: "Bachelor's Degree",
  },
  {
    username: 'ncjker',
    email: 'cfe@gmail.com',
    password: 'password',
    state: 'Colorado',
    city: 'Denver',
    profile_image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1990/8/12',
    bio: 'Hipster-friendly zombieaholic. Twitter scholar. Total tv evangelist. Music fanatic',
    education: "Bachelor's Degree",
  },
  {
    username: 'pamalaAnder',
    email: 'baywatch@gmail.com',
    password: 'password',
    state: 'California',
    city: 'San Diego',
    profile_image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1990/12/12',
    bio: 'Web trailblazer. Extreme tv specialist. Coffee expert. Writer. Hipster-friendly twitter geek',
    education: "Bachelor's Degree",
  },
  {
    username: 'MArtinLawernce',
    email: 'mlawe@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Hollywood',
    profile_image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1985/6/4',
    bio: 'Music guru. Unable to type with boxing gloves on. Typical travel lover. Communicator."',
    education: 'Doctoral Degree',
  },
  {
    username: 'jimmyg',
    email: 'jimbo@gmail.com',
    password: 'password',
    state: 'California',
    city: 'San Fransisco',
    profile_image:
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Music guru. Unable to type with boxing gloves on. Typical travel lover. Communicator',
    education: "Master's Degree",
  },
  {
    username: 'donatello',
    email: 'turtleguy@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Callabasas',
    profile_image:
      'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: '"Hipster-friendly twitter enthusiast. Troublemaker. Professional coffee evangelist. Unapologetic problem solver',
    education: "Master's Degree",
  },
  {
    username: 'pollyp23',
    email: 'polly@gmail.com',
    password: 'password',
    state: 'California',
    city: 'La Jolla',
    profile_image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Hipster-friendly twitter enthusiast. Troublemaker. Professional coffee evangelist. Unapologetic problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'lollapolla',
    email: 'llopa@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Lake Tahoe',
    profile_image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Alcohol buff. Coffee lover. Music fan. Infuriatingly humble bacon enthusiast. Beer fanatic',
    education: "Master's Degree",
  },
  {
    username: 'jennlaw',
    email: 'jlaw@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Hollywood',
    profile_image:
      'https://images.unsplash.com/photo-1622031093531-f4e641788763?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Alcohol buff. Coffee lover. Music fan. Infuriatingly humble bacon enthusiast. Beer fanatic',
    education: "Bachelor's Degree",
  },
  {
    username: 'jlo432',
    email: 'jlo@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Los Angeles',
    profile_image:
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Food evangelist. Lifelong music guru. Reader. Subtly charming tv specialist. Pop culture geek. Avid travel advocate',
    education: "Master's Degree",
  },
  {
    username: 'user5u4i3o',
    email: 'userrr@gmail.com',
    password: 'password',
    state: 'Arkansas',
    city: 'Bentonville',
    profile_image:
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Coffee practitioner. Avid web trailblazer. Professional travel junkie. Passionate food geek. Writer',
    education: 'Doctoral Degree',
  },
  {
    username: 'neoprimo',
    email: 'nprimo@gmail.com',
    password: 'password',
    state: 'Arkasnas',
    city: 'Springdale',
    profile_image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Coffee practitioner. Avid web trailblazer. Professional travel junkie. Passionate food geek. Writer',
    education: 'High School',
  },
  {
    username: 'promcredate23',
    email: 'prompferom@gmail.com',
    password: 'password',
    state: 'Arkansas',
    city: 'Little Rock',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'promdcreate23',
    email: 'prompcrerom@gmail.com',
    password: 'password',
    state: 'Arkansas',
    city: 'Fayetteville',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'promcecrerdate23',
    email: 'promcerprom@gmail.com',
    password: 'password',
    state: 'Missippi',
    city: 'Jackson',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'promdatcrecree23',
    email: 'prompcerrom@gmail.com',
    password: 'password',
    state: 'Missippi',
    city: 'Southhaven',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'promcedate23',
    email: 'promprom@gmail1.com',
    password: 'password',
    state: 'Utah',
    city: 'Provo',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'procremdate233',
    email: 'promprom@gmail2.com',
    password: 'password',
    state: 'Utah',
    city: 'Salt Lake City',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'prcreomdate23',
    email: 'promprom@gmail3.com',
    password: 'password',
    state: 'Utah',
    city: 'Moab',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'pcreromdate23',
    email: 'promprom@gmail4.com',
    password: 'password',
    state: 'Washington',
    city: 'Seattle',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'prcreomdate223',
    email: 'promprom5@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Lebenon',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'procremdate23',
    email: 'promprom6@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'La Verne',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
  {
    username: 'prceromdate23',
    email: 'promprom7@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Memphis',
    profile_image:
      'https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1296&q=60',
    birthday: '1998/7/12',
    bio: 'Beer buff. Twitter geek. Gamer. Amateur creator. Hardcore food fan. Tv trailblazer. Problem solver',
    education: "Bachelor's Degree",
  },
];

const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;
