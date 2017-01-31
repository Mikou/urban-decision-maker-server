SELECT exists(
  SELECT * 
  FROM ${prefix#}_decisionspace 
    JOIN ${prefix#}_decisionspace_user 
    ON ${prefix#}_decisionspace.id = ${prefix#}_decisionspace_user.decisionspace_id 
  WHERE ${prefix#}_decisionspace.id=$2 
    AND ${prefix#}_decisionspace_user.user_id=$1
);
