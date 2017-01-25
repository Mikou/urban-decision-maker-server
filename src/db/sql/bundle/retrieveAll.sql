SELECT 
  id, title, description, gravity, created_date,
  (SELECT row_to_json(t) AS bundle FROM (
      SELECT url FROM ${prefix#}_visualization WHERE ${prefix#}_visualization.id=${prefix#}_bundle.id
  ) t) AS visualization, 
  (SELECT array_agg(row_to_json(t)) FROM (
      SELECT id, component_type, gravity FROM udm_feature WHERE bundle_id=${prefix#}_bundle.id) t
  ) AS features
FROM ${prefix#}_bundle
