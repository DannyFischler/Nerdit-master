// importing dependencies

const {Blog} = require('../models')

//defining data to input

 //data array to seed
 const blogData = [
    {
        title: 'carolinacougars (pass)',
        content: 'I am the best call of duty player ever',
        user_id: 1

    },
    {
        title: 'Bioshock',
        content: 'You can suck the life out of children in this game 10/10',
        user_id: 2
    },
    {
        title: 'Fatal Frame',
        content: 'One of the scariest games I have ever played 12/10',
        user_id: 3
    }
];

//bulk creating the data
const seedBlog = () => Blog.bulkCreate(blogData);

module.exports = seedBlog;