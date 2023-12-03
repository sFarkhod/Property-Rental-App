# Project - Property Rental App


Welcome to **Property Rental App**! This guide will help you get started with setting up the environment and running the application locally.

## Prerequisites
Before you begin, make sure you have the following installed on your machine:

> Mobile App (Android and IOS)

- Node.js (version 15.0.0 or higher specific version used is 16.20.1)
- Yarn (optional, but recommended) or npm
- Expo CLI (version 6.3.10 or higher)
- React Native (version 0.70 or higher)

> Backend App

- Python (version 3.12.0 or higher)
- Virtual Environment(optional, but recommended)
- Django (version 4.2.7 or higher)

## Getting Started


1. **Clone the repository:**

   ```sh
   git clone https://github.com/sFarkhod/Property-Rental-App.git
   
   cd Property-Rental-App

1. **Take all the necessary environmental variables to .env file:**
    - For testing purposes we use all the information such as api keys, secret key for db, secret key for jwt decoding etc without hiding them. We recommend you to hide all the important information before start. 

## Running the Application

> Mobile App (Android and IOS)

1. **Install Dependencies:**

   ```sh
   npm install -g expo-cli

   yarn install or npm install
2. **Start the Development Server:**
    ```sh
    npm run android
3. **Access the Application:**
   - After running the code application would be automatically open in your emulator.

> Backend App

1. **Install Dependencies:**

   ```sh
   pip install -r requirements.txt
2. **Migrating the Database**
   ```sh
   python manage.py makemigrations admin
   
   python manage.py makemigrations propertyRentalBackend
   
   python manage.py migrate 
3. **Start the Development Server:**
    ```sh
     python manage.py runserver
4. **Access the Application:**
   - Open your web browser and visit http://127.0.0.1:8000/ to access the running application.

## Suggestions
1. **Use NGROK for local testing api:**
   - we use Ngrok for testing local api and we strongly recommend you too. It make work easier and watching your requests. Only pros it got that you need a strong internet.
2. **Change all the api links in the React Native:**
   - we use Ngrok Static Link for the application in the React Native app if you want to use Ngrok(or whatever service or server or hosting you want) you need to change the url to your desired url.
3. **Backend Documentation:**
   - You can check the api documentation in the swagger as well. You can access it after running the application in the following url http://localhost:8000/swagger/


## MEMBERS 

We have 4 members which would do specific part of an application

- Sokhibov Farkhod - SE12805
- Umarov Boburjon - SE12087
- Asilbek Mamatov - SE13982
- Nargiza Qaxramanova - SE12740
  
