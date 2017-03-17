SELECT 
  id, 
  content_type as "contentType", 
  decisionspace_id as "decisionspaceId", 
  bundle_id as "bundleId", 
  author_id as "authorId", 
  created_date as "createDate", 
  data 
FROM udm_featurecontent 
WHERE decisionspace_id=$1 AND bundle_id=$2
