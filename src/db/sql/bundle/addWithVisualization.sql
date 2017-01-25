WITH inserted_bundle AS (
  INSERT INTO ${prefix#}_bundle (_type, title, description, published, gravity, decisionspace_id)
         VALUES ('visualization', $1, $2, $3, 0, $4)
         RETURNING id
), inserted_bundle_user AS (
  INSERT INTO ${prefix#}_bundle_user (user_id, bundle_id)
       VALUES ($5, (SELECT id FROM inserted_bundle))
       RETURNING user_id
)
INSERT INTO ${prefix#}_visualization (url, bundle_id)
  VALUES ($6, (SELECT id FROM inserted_bundle))
  RETURNING id;

