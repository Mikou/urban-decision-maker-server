INSERT INTO ${prefix#}_feature (bundle_id, component_type, gravity) 
VALUES ($1, $2, (SELECT COUNT(*) FROM ${prefix#}_feature WHERE ${prefix#}_feature.bundle_id=$1));
