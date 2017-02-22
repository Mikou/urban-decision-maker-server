--CREATE TABLE udm_featuredata (
--  id SERIAL    PRIMARY KEY,
--  feature_type varchar(32),
--  parent_type  varchar(32),
--  parent_id    integer,
--  author_id    integer,
--  data         json,
--  FOREIGN KEY  (parent_id) REFERENCES udm_bundle(id),
--  FOREIGN KEY  (author_id) REFERENCES udm_user(id)
--);

--  id SERIAL    PRIMARY KEY,
--  feature_type     varchar(32),
--  decisionspace_id integer,
--  bundle_id        integer,
--  author_id        integer,
--  data             json,
--  FOREIGN KEY  (decisionspace_id) REFERENCES udm_decisionspace(id),
--  FOREIGN KEY  (bundle_id)        REFERENCES udm_bundle(id),
--  FOREIGN KEY  (author_id)        REFERENCES udm_user(id)

INSERT INTO ${prefix#}_featurecontent (decisionspace_id, bundle_id, content_type, author_id, data)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id;
