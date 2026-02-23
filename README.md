OPTIMA: A Sales Forecaster and Product Promoter/Bundler

System Requirements

    Node.js
        Download Link: https://nodejs.org/
        Recommended Version: LTS (Long Term Support) version.

    Python
        Download Link: https://www.python.org/downloads/
        Recommended Version: Latest stable release.
        CRITICAL: If installing on Windows, you must check the box that says "Add Python to PATH" at the bottom of the very first installation screen.

Installation Instructions

    1. Node.js Environment (Express Web Server)
    Open a terminal, navigate to the root directory of the project (where the package.json file is located), and install the required modules:

    npm install


    2. Python Environment (FastAPI & Machine Learning)
    Open a terminal, navigate to the /python directory (where the requirements.txt file is located), and install the required libraries:

    pip install -r requirements.txt


Running the Application
Note: You must run both servers simultaneously in two separate terminal windows.

    1. Start the Express.js Web Server
    In your first terminal, navigate to the root directory and start the application:

    npm run devStart
    (Note: Your web dashboard will now be accessible, typically at http://localhost:3000)


    2. Start the FastAPI Engine
    In your second terminal, navigate to the /python folder and spin up the machine learning backend:

    fastapi dev main.py
    (Your AI engine will now be actively listening, typically at http://127.0.0.1:8000)