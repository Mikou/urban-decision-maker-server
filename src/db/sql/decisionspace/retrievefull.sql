-- The entire JSON tree must be constructed as a single nested set of statements
-- otherwise it is not possible to keep the operation within the same transaction
SELECT
  id, title, description, created_date, (
    SELECT array_agg(row_to_json(bs)) FROM
      (SELECT 
        id, title, description, gravity, created_date,
        -- find visualization -----------------------------------------------------------------
        (SELECT row_to_json(t) AS bundle FROM (
            SELECT url FROM ${prefix#}_visualization WHERE ${prefix#}_visualization.id=${prefix#}_bundle.id
        ) t) 
        AS visualization, 
        -- // find visualization --------------------------------------------------------------

        -- find features ----------------------------------------------------------------------
          (WITH feature AS (
            SELECT id, component_type, bundle_id, (
              SELECT input_type 
              FROM udm_componenttype 
              WHERE 
                udm_componenttype.name=udm_feature.component_type
              AND
                udm_feature.bundle_id = udm_bundle.id
            ) AS input_type
            FROM udm_feature
            WHERE udm_feature.bundle_id = udm_bundle.id
          ) 
          SELECT array_agg(row_to_json(f)) 
          FROM (
            SELECT id, component_type AS "componentType", (
              -- find feature content ---------------------------------------------------------
              SELECT array_agg(row_to_json(t2)) FROM (
                (SELECT id, bundle_id, content_type, data 
                 FROM udm_featurecontent 
                 WHERE udm_featurecontent.content_type = feature.input_type 
                 AND udm_featurecontent.bundle_id = feature.bundle_id) 
              ) t2
              -- // find feature content ------------------------------------------------------
            ) AS payload
              FROM feature
          ) f ) 
        AS features
        -- // find features -------------------------------------------------------------------

        --(SELECT array_agg(row_to_json(t)) FROM (
        --    SELECT id, component_type AS "componentType", gravity, (
        --        SELECT 0 --content -- TODO: select all relative feature contents
        --    ) AS content
        --    FROM ${prefix#}_feature WHERE bundle_id=${prefix#}_bundle.id) t
        --) AS features

      FROM ${prefix#}_bundle 
      WHERE ${prefix#}_bundle.deleted=false 
        AND ${prefix#}_bundle.decisionspace_id=${prefix#}_decisionspace.id 
      ORDER BY ${prefix#}_bundle.gravity
      )
    AS bs
  ) AS bundles 
FROM ${prefix#}_decisionspace 
WHERE ${prefix#}_decisionspace.id=$1 AND ${prefix#}_decisionspace.deleted=false;
