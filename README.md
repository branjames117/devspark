# devSpark

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

devSpark is a collaboration/networking/dating app created by developers, for developers. It uses socket.io to enable live chat and notifications, the Sequelize ORM for persistent user profiles, session data, and user searches, the Cloudinary API for storing user profile images, and Nodemailer to provide email notifications to users who request password changes.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Demonstration](#demonstration)
- [License](#license)
- [Contributing](#contributing)
- [Credits](#credits)
- [Questions](#questions)

## Installation

First, clone the repository to your local machine with `git clone <url>`. Then, install all required dependencies with `npm i`.

## Usage

Configure all applicable environment variables in an .env file in the root directory: DB_NAME, DB_USER, and DB_PW for Sequelize credentials, SECRET for session middleware, CLOUD_NAME, API_KEY, and API_SECRET for the Cloudinary API, GMAILPW, CLIENT_SECRET, CLIENT_ID, and REFRESH_TOKEN for the Nodemailer Gmail account configuration. Run the application with `node server`.

## Demonstration

A live demonstration of the project is hosted on Heroku [here](https://devsparkio.herokuapp.com/).

## License

[The MIT License](https://mit-license.org/)

Copyright © 2022 branjames117, Cody-Junier, ericc97, and belle-witch

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributing

This repository and its contributors follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md).

## Credits

This repository was created and is maintained by [branjames117](https://github.com/branjames117) (socket.io, Sequelize), [Cody-Junier](https://github.com/Cody-Junier) (Cloudinary, Sequelize), [ericc97](https://github.com/ericc97) (Nodemailer, Sequelize), and [belle-witch](https://github.com/belle-witch) (HTML, CSS).

## Questions

With any questions email the repository owner at [branjames117@gmail.com](mailto:branjames117@gmail.com) or his collaborators: [codyjunier@gmail.com](mailto:codyjunier@gmail.com), [ravenclaw946@gmail.com](mailto:ravenclaw946@gmail.com), need Eric's email address.
