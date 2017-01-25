DELETE FROM ${prefix#}_permission_decisionspace_user
WHERE user_id=$1 AND decisionspace_id=$2
RETURNING user_id;
