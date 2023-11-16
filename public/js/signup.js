const signUpFormHandler = async (event) => {

  console.log('button clicked')

  event.preventDefault();

  //collecting values from signup form
  const email = document.querySelector("#inputNewEmail").value.trim();
  const user_name = document.querySelector("#inputNewUserName").value.trim();
  const password = document.querySelector("#inputNewPassword").value.trim();

  console.log("values captured as vairables are" + email + user_name + password)

  //if values are present when button is pressed
  if (email && password.length > 7 && user_name) {

      //sending POST request to API endpoint
      const response = await fetch('/api/users/signup', {
          method: 'POST',
          body: JSON.stringify({ email, user_name, password }),
          headers: { 'Content-Type': 'application/json' },
      });

      //sending message and redirecting to dashboard page if correct
      if (response.ok) {
          alert(`Your now signed up! Click ok to view blogs, create and edit your own blogs, and leave comments!`)
          document.location.replace('/');
      } 
      else {
          alert(response.statusText);
      }
  }
  else {
      alert (`please ensure your password is at least 8 characters long`)
  }
};

document
//listening for a click with the sign up button id
.querySelector('#sign-up-button')
//run function above to send info to the server and get a response once clicked
.addEventListener('click', signUpFormHandler);