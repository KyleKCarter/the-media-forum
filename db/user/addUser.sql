INSERT INTO users
(displayName, firstName, lastName, photo)
VALUES
($1, $2, $3, $4)
RETURNING *