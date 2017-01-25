SELECT title, component_type, description, created_date
FROM ${prefix#}_featurectrl
WHERE deleted=false;
