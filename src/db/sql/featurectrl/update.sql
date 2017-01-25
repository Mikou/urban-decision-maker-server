UPDATE ${prefix#}_featurectrl
SET title=$2, description=$3, component_type=$4
WHERE id=$1 AND deleted=false
RETURNING id;
