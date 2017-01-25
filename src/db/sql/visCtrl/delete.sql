UPDATE ${prefix#}_visctrl
SET deleted=true
WHERE id=$1
RETURNING id;
