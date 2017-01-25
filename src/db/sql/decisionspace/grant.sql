INSERT INTO ${prefix#}_permission_decisionspace_user (user_id, decisionspace_id)
VALUES ($1, $2)
RETURNING user_id;
