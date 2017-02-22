-- REMOVE OLD TABLES
-- m:m
DROP TABLE IF EXISTS udm_decisionspace_comment;
DROP TABLE IF EXISTS udm_user_comment;
DROP TABLE IF EXISTS udm_decisionspace_user;
DROP TABLE IF EXISTS udm_decisionspace_feature;
DROP TABLE IF EXISTS udm_permission_decisionspace_user;
DROP TABLE IF EXISTS udm_vis_user;
DROP TABLE IF EXISTS udm_visctrl_user;
DROP TABLE IF EXISTS udm_featurectrl_user;
DROP TABLE IF EXISTS udm_decisionspace_bundle;
DROP TABLE IF EXISTS udm_bundle_user;
-- simple tables:
DROP TABLE IF EXISTS udm_visctrl;
DROP TABLE IF EXISTS udm_featurectrl;
DROP TABLE IF EXISTS udm_feature;
DROP TABLE IF EXISTS udm_componenttype;
DROP TABLE IF EXISTS udm_featurecontent;
DROP TABLE IF EXISTS udm_featurecontenttype;

DROP TABLE IF EXISTS udm_visualization;
DROP TABLE IF EXISTS udm_bundle;
DROP TABLE IF EXISTS udm_decisionspace;
DROP TABLE IF EXISTS udm_comment;
DROP TABLE IF EXISTS udm_user;
-- CREATE NEW SCHEMA
CREATE TABLE udm_user (
  id SERIAL    PRIMARY KEY,
  username     varchar (50)  NOT NULL,
  firstname    varchar (50)  NOT NULL,
  lastname     varchar (50)  NOT NULL,
  email        varchar (50)  NOT NULL,
  password     char    (128) NOT NULL,
  roles        varchar (50)  NOT NULL,
  deleted      boolean       NOT NULL DEFAULT FALSE,
  created_date timestamp     NOT NULL DEFAULT now()
);
CREATE TABLE udm_decisionspace (
  id SERIAL    PRIMARY KEY,
  title        varchar (50)  NOT NULL,
  description  varchar (256),
  published    boolean       NOT NULL DEFAULT false,
  deleted      boolean       NOT NULL DEFAULT false,
  created_date timestamp     NOT NULL DEFAULT now()
);
CREATE TABLE udm_visctrl (
  id SERIAL    PRIMARY KEY,
  title        varchar (50)   NOT NULL,
  url          varchar (128)  NOT NULL,
  description  varchar (240),
  deleted      boolean        NOT NULL DEFAULT false,
  created_date timestamp      NOT NULL DEFAULT now()
);
CREATE TABLE udm_featurectrl (
  id SERIAL    PRIMARY KEY,
  title        varchar (50)   NOT NULL,
  description  varchar (240),
  component_type varchar (32) NOT NULL,
  deleted      boolean        NOT NULL DEFAULT false,
  created_date timestamp      NOT NULL DEFAULT now()
);
CREATE TABLE udm_bundle (
  id SERIAL         PRIMARY KEY,
  _type             varchar (20),
  title             varchar (50)   NOT NULL,
  description       varchar (256),
  decisionspace_id  integer,
  published         boolean       NOT NULL DEFAULT false,
  deleted           boolean       NOT NULL DEFAULT false,
  parent_id         integer,
  gravity           integer       NOT NULL,
  created_date      timestamp     NOT NULL DEFAULT now(),
  FOREIGN KEY       (decisionspace_id) REFERENCES udm_decisionspace(id),
  FOREIGN KEY       (parent_id)        REFERENCES udm_bundle(id)
);
CREATE TABLE udm_visualization (
  id SERIAL    PRIMARY KEY,
  url          varchar (128)  NOT NULL,
  created_date timestamp     NOT NULL DEFAULT now(),
  -- one to one relationship with bundle
  bundle_id    integer NOT NULL DEFAULT 0,
  UNIQUE(bundle_id),
  FOREIGN KEY (bundle_id) REFERENCES udm_bundle(id)
);
CREATE TABLE udm_featurecontenttype(
  name varchar(32) PRIMARY KEY
);
CREATE TABLE udm_componenttype(
  name        varchar(32) PRIMARY KEY,
  output_type varchar(32),
  input_type  varchar(32),
  FOREIGN KEY (output_type) REFERENCES udm_featurecontenttype(name),
  FOREIGN KEY (input_type)  REFERENCES udm_featurecontenttype(name)
);
CREATE TABLE udm_feature (
  id SERIAL    PRIMARY KEY,
  decisionspace_id  integer,
  bundle_id         integer,
  --title           varchar (50)   NOT NULL,
  --description     varchar (256),
  component_type    varchar (32)  NOT NULL,
  gravity           integer       NOT NULL,
  --FOREIGN KEY       (decisionspace_id) REFERENCES udm_decisionspace(id),
  FOREIGN KEY       (component_type) REFERENCES udm_componenttype(name),
  FOREIGN KEY       (bundle_id)      REFERENCES udm_bundle(id)
);
CREATE TABLE udm_featurecontent (
  id SERIAL    PRIMARY KEY,
  content_type     varchar(32),
  decisionspace_id integer,
  bundle_id        integer,
  author_id        integer,
  data             json,
  created_date     timestamp     NOT NULL DEFAULT now(),
  FOREIGN KEY      (decisionspace_id) REFERENCES udm_decisionspace(id),
  FOREIGN KEY      (bundle_id)        REFERENCES udm_bundle(id),
  FOREIGN KEY      (author_id)        REFERENCES udm_user(id),
  FOREIGN KEY      (content_type)     REFERENCES udm_featurecontenttype(name)
);
CREATE TABLE udm_comment (
  id SERIAL    PRIMARY KEY,
  topic        varchar (50)   NOT NULL,
  message      text           NOT NULL,
  created_date timestamp      NOT NULL DEFAULT now()
);
-- m:m
CREATE TABLE udm_decisionspace_user (
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  decisionspace_id  integer  REFERENCES udm_decisionspace (id) NOT NULL,
  PRIMARY KEY(user_id, decisionspace_id)
);
CREATE TABLE udm_permission_decisionspace_user (
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  decisionspace_id  integer  REFERENCES udm_decisionspace (id) NOT NULL,
  PRIMARY KEY(user_id, decisionspace_id)
);
CREATE TABLE udm_bundle_user (
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  bundle_id         integer  REFERENCES udm_bundle (id)        NOT NULL,
  PRIMARY KEY(user_id, bundle_id)
);
CREATE TABLE udm_vis_user (
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  visualization_id  integer  REFERENCES udm_visualization (id) NOT NULL,
  PRIMARY KEY(user_id, visualization_id)
);
CREATE TABLE udm_visctrl_user (
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  visctrl_id        integer  REFERENCES udm_visctrl (id)       NOT NULL,
  PRIMARY KEY(user_id, visctrl_id)
);
CREATE TABLE udm_featurectrl_user (
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  featurectrl_id    integer  REFERENCES udm_featurectrl (id)   NOT NULL,
  PRIMARY KEY(user_id, featurectrl_id)
);
CREATE TABLE udm_decisionspace_comment (
  comment_id        integer  REFERENCES udm_comment (id)       NOT NULL,
  decisionspace_id  integer  REFERENCES udm_decisionspace (id) NOT NULL,
  PRIMARY KEY(comment_id, decisionspace_id)
);
CREATE TABLE udm_user_comment (
  comment_id        integer  REFERENCES udm_comment (id)       NOT NULL,
  user_id           integer  REFERENCES udm_user (id)          NOT NULL,
  PRIMARY KEY(user_id, comment_id)
);
