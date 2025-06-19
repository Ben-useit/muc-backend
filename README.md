# MUC – Backend App

Just a playground App to try some NodeJs / React features.

This is the NodeJs part.

**jsonwebtoken**, **mongoose**, **cookie-parser**, **email registration**

It comes with some test documents that will be displayed after signing in.

## Installation

### Required

1\. Local or cloud database

2\. To send email verifications: [Ethereal](https://ethereal.email/)

3\. .env file in the root directory:

MONGO_URI =

PORT = 3005

JWT_SECRET=

JWT_LIFETIME=

MAILER_FROM=

MAILER_HOST=smtp.ethereal.email &lt;br&gt;

MAILER_PORT=587

MAILER_USER=

MAILER_PASSWORD=

mdkir &lt;Project Directory&gt;  
cd &lt;Project Directory&gt;

git clone <https://github.com/Ben-useit/muc-backend.git>

cd muc-backend

git install

After creating a database connection run:

node populateDB.js

to create database entries that correspond to the documents.

### Important links

Frontend App : [MUC Frontend](https://github.com/Ben-useit/muc-frontend)
