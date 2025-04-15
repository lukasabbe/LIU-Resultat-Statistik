document.addEventListener('DOMContentLoaded', async () => {
    const courses = await (await fetch('https://liutentor.lukasabbe.com/api/courses')).json();
    autocomplete(document.getElementById('myInput'), courses.map(course => course));
});