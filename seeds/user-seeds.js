const { User } = require('../models');

const userData = [
  {
    username: 'Brandon',
    email: 'brandon@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image_id:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '4/12/2001',
    bio: 'Im a high school student and freelance hero/vigilante. I like to work on coding projects related to security and data encryption',
    education: 'High School',
  },
  {
    username: 'Cody',
    email: 'cody@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image_id:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '4/12/2001',
    bio: 'Im a high school student and freelance hero/vigilante. I like to work on coding projects related to security and data encryption',
    education: 'High School',
  },
  {
    username: 'bachmeister',
    email: 'erlbach@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Silicon Valley',
    profile_image_id:
      'https://media.allure.com/photos/5a555213cacd0c487a51e915/3:2/w_2687,h_1791,c_limit/GettyImages-628741288.jpg',
    birthday: '4/20/1969',
    bio: 'Founder of Pied Piper. I am a highly distinguished businessman with a kick ass and take names mentality. I smoke the occasional joint and Im not afraid to tell it how it is. My coding career has taken a significant decline due to my carpel tunnel diagnoses. Currently looking for a team of engineers to design and build the next ebay.',
    education: 'High School',
  },
  {
    username: 'bigheadboi',
    email: 'nellybighetti@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Silicon Valley',
    profile_image_id:
      'https://www.themoviedb.org/t/p/original/sIyQYq2imu1V2RxRQ1zp70RSqTi.jpg',
    birthday: '3/20/1990',
    bio: "He is later removed from the Nucleus project due to his lack of technical knowledge, and has absolutely no responsibilities at Hooli. He was later promoted further to make it appear that he was the actual creator of Pied Piper while working at Hooli, but he is unaware of this. After a disastrous binding arbitration with Pied Piper, Gavin makes Big Head redundant and pays him $20 million in severance, which he blows through very quickly when Erlich tricks him into entering into a business arrangement with him, naming their firm, 'Bachmanity'",
    education: 'Doctoral Degree',
  },
  {
    username: 'bertram11',
    email: 'bman11@gmail.com',
    password: 'password',
    state: 'California',
    city: 'Silicon Valley',
    profile_image_id:
      'https://static.wikia.nocookie.net/comedybangbang/images/3/3e/Starr.jpg/revision/latest?cb=20130626165235',
    birthday: '12/12/1985',
    bio: 'online security expert, and as such is responsible for system administration and server configuration at Pied Piper',
    education: 'High School',
  },
  {
    username: 'chosen1',
    email: 'neo@gmail.com',
    password: 'password',
    state: 'Hawaii',
    city: 'Hilo',
    profile_image_id:
      'https://www.looper.com/img/gallery/lines-in-the-matrix-movies-that-mean-more-than-you-realized/intro-1564174093.jpg',
    birthday: '3/11/1999',
    bio: 'Im is a quiet man, who thinks more than he speaks. I also have no problem learning how to fight and holding his my own in a coding battle. I quickly rose to the responsibility of saving his friends when they are in danger, and he even begins to believe that he might be able to save the entire human race. Im looking for like minded individuals looking to free people from the Matrix',
    education: 'Doctoral Degree',
  },
  {
    username: 'joeschmo',
    email: 'joe@gmail.com',
    password: 'password',
    state: 'Alabama',
    city: 'Mobile',
    profile_image_id:
      'https://gray-wbko-prod.cdn.arcpublishing.com/resizer/f8tSoxdEapFr8yKkjW2Vx6wkzew=/1200x1200/smart/filters:quality(85)/cloudfront-us-east-1.images.arcpublishing.com/gray/I6GK2Z3AV5OQFGOCZSYRQ63RBU.jpg',
    birthday: '7/4/1995',
    bio: 'I have been studying web development since 2009 and I develop in both C# and PHP, though I primarily use C#. I am experienced in both front and back-end development, and I am proficient in HTML/HTML5, CSS/CSS3, LESS, SASS, XML, JavaScript, jQuery, AJAX, and SQL/MySQL/PostgreSQL, to name a few. I am also proficient in many non-web-based languages, including but not limited to Java, Scheme/Racket, C, ACL2 (LISP), and MIPS Assembly. I have also worked on some smaller Python projects, and have used the language to create one-time use tools for data processing and similar purposes',
    education: 'Masters Degree',
  },
  {
    username: 'boygenius12',
    email: 'jimmy@gmail.com',
    password: 'password',
    state: 'Tennessee',
    city: 'Nashville',
    profile_image_id:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-jimmy-neutron/l-intro-1602679825.jpg',
    birthday: '3/2/2000',
    bio: 'I am a Sitecore Certified Professional Web Developer, and have been developing enterprise solutions using the Sitecore content management system since 2012. I have worked on over ten different Sitecore solutions, ranging from a major travel engine',
    education: 'boot Camp Certification',
  },
  {
    username: 'hennythingispossible',
    email: 'hendog@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image_id:
      'https://cdn.shopify.com/s/files/1/0293/9277/products/Hennything_Is_Possible_Short_Sleeve_Crew_Tee_-_Black_MH_468x.jpg?v=1611964536',
    birthday: '4/20/1989',
    bio: 'Anything is possible. wanting to learn more about node js and how to build web apis ya hurddddd',
    education: 'Associates Degree',
  },
  {
    username: 'kimp',
    email: 'kimpossible@gmail.com',
    password: 'password',
    state: 'New York',
    city: 'New York',
    profile_image_id:
      'https://www.looper.com/img/gallery/things-only-adults-notice-in-kim-possible/intro-1632408403.jpg',
    birthday: '4/12/2001',
    bio: 'Im a high school student and freelance hero/vigilante. I like to work on coding projects related to security and data encryption',
    education: 'High School',
  },
];

const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;
