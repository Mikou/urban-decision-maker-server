UPDATE ${prefix#}_bundle
SET deleted=true
WHERE id=$1
RETURNING id;
