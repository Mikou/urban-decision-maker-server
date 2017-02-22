INSERT INTO ${prefix#}_featurecontenttype (name)
VALUES ($1)
RETURNING name;
