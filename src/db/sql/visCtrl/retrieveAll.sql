SELECT title, url, description, created_date
FROM ${prefix#}_visctrl
WHERE deleted=false;
