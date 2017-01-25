WITH decisionspace_id AS (
  INSERT INTO ${prefix#}_decisionspace (title, description, published)
         VALUES (${title}, ${description}, ${published})
         RETURNING id
) 
INSERT INTO ${prefix#}_decisionspace_user (user_id, decisionspace_id)
       VALUES (${author}, (SELECT id FROM decisionspace_id))
       RETURNING (SELECT id FROM decisionspace_id);
