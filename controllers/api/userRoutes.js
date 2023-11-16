//importing dependencies

const router = require('express').Router();
const { User } = require('../../models');

//getting routes

 //bringing up the login page when user clicks login nav button
 router.get('/login', async (req, res) => {  
    try{
        //rendering the login screen and status when they are logged in
        res.render('login', {
            logged_in: req.session.logged_in
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//bringin up the signup page if user needs to create a new login
router.get('/signup', async (req, res) => {
    try{
        //rendering the login screen and status when they are logged in
        res.render('signup', {
            logged_in: req.session.logged_in
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//post route

 //posting new user info to the db
        //route
        router.post('/signup', async (req, res) => {
            try { 
                //creating a new user based on submitted information
                const userData = await User.create(req.body);
                console.log(`user data created`);

                //saving information about the session, now that user is logged in
                req.session.save(() => {
                    req.session.user_id = userData.id;
                    req.session.user_name = userData.user_name;
                    req.session.logged_in = true;
            
                    //sending back success response
                    res.status(200).json(userData);
                });
            } 
            //sending fail message if error
            catch (err) {
                res.status(400).json(err);
            }
        });


    //route to login user and compare credentials
    router.post('/login', async (req, res) => {
        try {

            console.log(`trying login route with credentials ${JSON.stringify(req.body)}`)
        
            //setting userData equal to the user email submitted
            const userData = await User.findOne({ where: { email: req.body.email } });
            console.log(`user data found is ${userData.email} and ${userData.password} and ${userData.user_name}`);
        
            //if user data is not provided, sending message to provide it
            if (!userData) {
                console.log(`into if no user data block`)
                res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
                return;
            }
            else {
                console.log(`into else block...`)
                //setting validPassword to be equal to the passwordcheck completed against the db and the body (NOT EXECUTING THIS!)
                const validPassword = await userData.checkPassword(req.body.password);
                console.log(`valid password result it ${validPassword}`); 
            
                //if password entered does not match password in db...notify them and return error
                if (!validPassword) {
                    res
                    .status(400)
                    .json({ message: 'Incorrect email or password, please try again' });
                    return;
                }
            
                //if everythign passes then provide message saying they are logged in, and save the session while setting the session user id
                req.session.save(() => {
                    req.session.user_id = userData.id;
                    req.session.user_name = userData.user_name;
                    req.session.logged_in = true;
                    res.json({ user: userData, message: 'You are now logged in!' });
                });
            }
            
        } 
        //logging error incase of any failure
        catch (err) {
          res.status(400).json(err);
        }

    });

    //logging out the user and ending the session
     router.post('/logout', (req, res) => {
        if (req.session.logged_in) {
          req.session.destroy(() => {
            res.status(204).end();
          });
        } else {
          res.status(404).end();
        }
      });

      module.exports = router;