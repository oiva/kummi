Pysäkkikummi is a project started at [dev4transport](http://forumvirium.fi/tapahtuma/dev4transport-4-5102013). The goal of this project is to allow people to "adopt" HSL's public transport stops and to report when there are issues with the stop.

Issue reports can be sent to the city using Helsinki's [open311](http://open311.org/) API.

### Installation

Get the code and install dependencies:

    git clone https://github.com/oiva/kummi.git
    cd kummi
    npm install
    bower install

Setup config.js:

    cp server/config.dist.js server/config.js
    
Enter your credentials to `server/config.js`. You'll need:
* Open311 API key: http://dev.hel.fi/apis/issuereporting
* Reittiopas API key: http://developer.reittiopas.fi/pages/en/account-request.php
* A mongoDB database (not a final decision :) )

On OS X mongoDB can be installed with [Homebrew](http://brew.sh/): `brew install mongodb`
To create a databse called "kummi" and a user:

    db
    use kummi
    db.addUser({user: "kummi", pwd: "kummi", roles: ["readWrite"]})
    exit

### Development

Run `grunt`.
