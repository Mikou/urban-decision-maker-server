SELECT id, title, description, published, created_date 
FROM ${prefix#}_decisionspace
WHERE deleted=false;
