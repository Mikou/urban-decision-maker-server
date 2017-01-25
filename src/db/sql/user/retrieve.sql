SELECT id, username, firstname, lastname, email, roles, deleted, created_date 
FROM ${prefix#}_user WHERE deleted=false, id=$1;
