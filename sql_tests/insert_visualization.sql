-- create a decision space

WITH 
  user_id          AS (
    INSERT INTO udm_user(username, firstname, lastname, email, password, roles, deleted)
      VALUES('testuser', 'John', 'Malkovich', 'john.malkovich@udm.dk', 's3cr2t', '[admin]', false)
    RETURNING id
  ), 
  decisionspace_id AS (
    INSERT INTO udm_decisionspace(name, description)
      VALUES ('test space', 'This decision space was created for test purposes')
    RETURNING id
  )

-- relate the decision space to a particular user
INSERT INTO udm_decisionspace_user (user_id, decisionspace_id)
  VALUES ((SELECT id FROM user_id), (SELECT id FROM decisionspace_id));

-- create a widget
WITH
  res_widget AS (
    INSERT INTO udm_widget (title) 
      VALUES ('my test widget')
    RETURNING id
  )

INSERT INTO udm_visualization(name, url, widget_id)
  VALUES ('test visualization', 'http://www.dummyvis.dk', (SELECT id FROM res_widget));
  

SELECT * FROM udm_visualization JOIN udm_widget ON udm_visualization.widget_id = udm_widget.id;

-- clean up
DELETE FROM udm_visualization WHERE name = 'test visualization';
DELETE FROM udm_widget WHERE title = 'my test widget';


WITH
  res_user AS (
    SELECT id FROM udm_user WHERE username = 'testuser'
  ),
  res_decisionspace AS (
    SELECT id FROM udm_decisionspace WHERE name='test space'
  )

DELETE 
  FROM udm_decisionspace_user 
  WHERE 
    user_id IN (
      SELECT id FROM udm_user WHERE username = 'testuser'
    )
  AND
    decisionspace_id IN (
      SELECT id FROM udm_decisionspace WHERE name = 'test space'
    );

DELETE FROM udm_user WHERE username = 'testuser';
DELETE FROM udm_decisionspace WHERE name = 'test space';


