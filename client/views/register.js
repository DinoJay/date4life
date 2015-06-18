 Template.register.events({
   'submit #register-form': function(e, t) {
     e.preventDefault();
     var email = t.find('#inputEmail').value;
     var username = t.find('#inputUsername').value;
     var password = t.find('#inputPassword').value;
     var age = t.find('#inputAge').value;
     var gender = $('input[name="inputGender"]:checked').val();

     console.log("email", email, "username", username, "password",
       password, "age", age, "gender", gender);

     Accounts.createUser({
      profile: {
       email: email,
       username: username,
       password: password,
       age: age,
       gender: gender,
      },
      password: password,
      username: username
     }, function(err) {
         console.log("err", err);
     });

     return false;
   }
 });
