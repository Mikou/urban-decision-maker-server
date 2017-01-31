-- The entire JSON tree must be constructed as a single nested set of statements
-- otherwise it is not possible to keep the operation within the same transaction
SELECT
  id, title, description, created_date, (
    SELECT array_agg(row_to_json(bs)) FROM
      (SELECT 
        id, title, description, gravity, created_date,
        (SELECT row_to_json(t) AS bundle FROM (
            SELECT url FROM ${prefix#}_visualization WHERE ${prefix#}_visualization.id=${prefix#}_bundle.id
        ) t) AS visualization, 
        (SELECT array_agg(row_to_json(t)) FROM (
            SELECT id, component_type AS "componentType", gravity FROM ${prefix#}_feature WHERE bundle_id=${prefix#}_bundle.id) t
        ) AS features
      FROM ${prefix#}_bundle 
      WHERE ${prefix#}_bundle.deleted=false 
        AND ${prefix#}_bundle.decisionspace_id=${prefix#}_decisionspace.id 
      ORDER BY ${prefix#}_bundle.gravity
      )
    AS bs
  ) AS bundles 
FROM ${prefix#}_decisionspace 
WHERE ${prefix#}_decisionspace.id=$1 AND ${prefix#}_decisionspace.deleted=false;
