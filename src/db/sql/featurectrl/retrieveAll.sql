SELECT 'featureCtrl' AS "type", title, component_type AS "componentType", description, created_date
FROM ${prefix#}_featurectrl
WHERE deleted=false;
