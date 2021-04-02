import app from './app/app';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server up and runnning on port ${PORT}`));
