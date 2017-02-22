INSERT INTO ${prefix#}_componenttype (name, input_type, output_type)
VALUES ($1, $2, $3)
RETURNING name;
