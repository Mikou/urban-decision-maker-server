UPDATE ${prefix#}_user
SET username=${username}, firstname=${firstname}, lastname=${lastname}, email=${email}, roles=${roles}
WHERE id=${id} AND deleted=false
RETURNING id;
