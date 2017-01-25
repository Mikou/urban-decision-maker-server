WITH u AS (
  DELETE FROM ${prefix#}_user WHERE id=$1 RETURNING id
)
DELETE FROM ${prefix#}_decisionspace_user WHERE user_id=(SELECT id FROM u)
RETURNING (SELECT id FROM u);
