UPDATE ${prefix#}_decisionspace
SET title=${title}, description=${description}, published=${published}
WHERE id=${id} AND deleted=false
RETURNING id;
