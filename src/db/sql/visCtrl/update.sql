UPDATE ${prefix#}_visctrl
SET title=$2, description=$3, url=$4
WHERE id=$1 AND deleted=false
RETURNING id;
