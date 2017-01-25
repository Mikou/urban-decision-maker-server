UPDATE ${prefix#}_featurectrl
SET deleted=true
WHERE id=$1
RETURNING id;
