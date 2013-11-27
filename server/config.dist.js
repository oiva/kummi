var config = {
  open311: {
    endpoint: 'https://pate.affecto.com/restWAR/open311/v1', // test API
    // endpoint: 'https://asiointi.hel.fi/palautews/rest/v1/', // production API
    api_key: '' // open 311 API key: get one from http://dev.hel.fi/apis/issuereporting
  },
  reittiopas: {
    host: 'api.reittiopas.fi',
    user: '', // reittiopas API username & password:
    pass: ''  // get from http://developer.reittiopas.fi/pages/en/account-request.php
  },

  db_name: '', // mongoDB database name / username / password
  db_user: '',
  db_passwd: ''
};

module.exports = config;