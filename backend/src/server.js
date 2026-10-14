const app = require('./app');
require('./db/database');

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
    console.log(`Salary Management API listening on port ${port}`);
});