//importing dependencies

const {User} = require('../models')

//defining data to seed

  // Define array of data to seed
  const userData = [
    {
        user_name: 'erhanbelanger7',
        email: 'erhan.belanger25@gmail.com',
        password: 'codfamous',
    },
    {
        user_name: 'dannyman',
        email: 'dafish@aol.com',
        password: 'cougars',
    },
    {
        user_name: 'GenghisRah',
        email: 'yerp@yahurd.com',
        password: 'whootywhoo',
    }
];

//creating bulk data from the array
const seedUser = () => User.bulkCreate(userData);

module.exports = seedUser