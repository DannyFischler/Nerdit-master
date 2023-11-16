const loginFormHandler = async (event) => {

  event.preventDefault();

  //collecting values from login form
  const email = document.querySelector('#inputEmail').value.trim();
  const password = document.querySelector('#inputPassword').value.trim();

  //execute login
  if (email && password) {
    //sending post request to api
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // redirect browser to profile page to notify that signin was a success
      alert(`Sign in successful. HELLO!!!!`);
      document.location.replace('/');
    } 
    else {
      alert(`${response.statusText} \n Please make sure you have entered the correct crendentials. If you have not signed up before, please use the link provided below the signin window to register.`);
    }
  }
};

document
  //listening for a click on the sign up button
  .querySelector('#log-in-button')
  //send info to server and get resonse when clicke to run fucntion above
  .addEventListener('click', loginFormHandler);