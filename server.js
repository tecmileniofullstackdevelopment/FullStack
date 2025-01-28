const express      = require('express');
const bodyParser   = require('body-parser');
const app          = express();
const PORT         = 3000;
let history        = [];

app.use(bodyParser.json());
app.use(express.static('public'));
 


app.post('/calculate', (req, res) => {
    const { prev, current, operation } = req.body;
    const a = parseFloat(prev);
    const b = parseFloat(current);
    let result = 0;
    switch (operation) {
        case 'add':
            result = a + b;
            break;
        case 'subtract':
            result = a - b;
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'divide':
            result = b !== 0 ? a / b : 'Error';
            break;
    }
    history.push({ prev, current, operation, result });
    res.json({ result });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));