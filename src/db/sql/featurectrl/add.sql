WITH inserted_featurectrl AS (
  INSERT INTO ${prefix#}_featurectrl (title, description, component_type)
  VALUES ($1, $2, $3)
  RETURNING id
)
INSERT INTO ${prefix#}_featurectrl_user (user_id, featurectrl_id)
  VALUES ($4, (SELECT id FROM inserted_featurectrl))
  RETURNING (SELECT id FROM inserted_featurectrl)
