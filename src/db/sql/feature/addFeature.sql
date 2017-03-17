INSERT INTO ${prefix#}_feature (bundle_id, component_type, gravity) 
  VALUES ($1, $2, $3)
  RETURNING id
