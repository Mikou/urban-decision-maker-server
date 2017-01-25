INSERT INTO ${prefix#}_user
  (username, firstname, lastname, email, password, roles)
VALUES
  (${username}, ${firstname}, ${lastname}, ${email}, ${password}, ${roles})
RETURNING id;
