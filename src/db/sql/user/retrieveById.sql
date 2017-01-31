SELECT id, username, firstname, lastname, email, roles, deleted, created_date 
FROM ${prefix#}_user WHERE deleted=false AND id=$1;
