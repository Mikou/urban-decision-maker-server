UPDATE ${prefix#}_decisionspace
SET deleted=true
WHERE id=$1
RETURNING id;
