const Joi = require('joi')
const express = require('express');
const courses = require('./courses.js')
const app = express();

app.use(express.json());

// const courses = [
//     {id: 1, name: 'course1'},
//     {id: 2, name: 'course2'},
//     {id: 3, name: 'course3'},
// ];

// Function to validate the client input 
const validateCourse = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(course);
}

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    //====Simple input validation======================================================
    // if (!req.body.name || req.body.name.length < 3) {
    //     //400 bad request
    //     res.status(400).send('Name is required and must be at least 3 characters long');
    //     return;
    // }
    //====Joi input validation=========================================================
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required(),
    // });
    // const result = schema.validate(req.body);
    // if (result.error) {
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // };
    //====Better Joi input validation
    const result = validateCourse(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    // Create the course
    const course = {
        id: courses.length +1,
        name: req.body.name,
    };
    // Add the course to courses
    courses.push(course);
    // Return the new course
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    // =====Hardcoded Validation===================================
    // const schema = Joi.object({
    //     name: Joi.string().min(3).required(),
    // });
    // const result = schema.validate(req.body);
    // =====Better validation=======================================
    const result = validateCourse(req.body);
    // Can use destructuring >>> const {error} = validateCourse(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    //Update course
    course.name = req.body.name;
    //Return updated course
    res.send(course);
});

app.get(`/api/courses/:id`, (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // Return 404 if it doesn't exists
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    // Return the course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // Return 404 if it doe't exists
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    // Delete the course
    const index = courses.indexOf(course); // Looks up the index of the element course in courses
    courses.splice(index, 1) // Deletes the element with the specified index
    // Return the deleted course
    res.send(course)
});

// PORT

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listenting on port ${port}...`));
