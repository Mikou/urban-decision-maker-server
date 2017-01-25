WITH inserted_visctrl AS (
  INSERT INTO ${prefix#}_visctrl (title, description, url)
  VALUES ($1, $2, $3)
  RETURNING id
)
INSERT INTO ${prefix#}_visctrl_user (user_id, visctrl_id)
  VALUES ($4, (SELECT id FROM inserted_visctrl))
  RETURNING (SELECT id FROM inserted_visctrl)
