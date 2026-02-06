# Mock Interviewer/Job Application Database
Mock Interviewer and Job Application Database is a versatile web application built using the MERN stack to help job seekers master their interviewing skills and manage their job application process. The platform integrates AI-powered features to create a seamless and efficient experience for users, making it easier for them to prepare for interviews, maintain their job applications, and navigate the competitive job market. With Mock Interviewer and Job Application Database, users can not only practice and analyze their performance in mock interviews, but also effectively organize and manage their job applications, ensuring that they stay on top of every opportunity that comes their way.

## Deployment
1. Create a .env folder in the root of the project with contents: PORT=5000, Mongo_URI<YOUR_KEY>, OPEN_AI_KEY=<YOUR_KEY>
### Docker
1. Run ```docker compose up --build```
2. Access web application on **http://localhost:3000/**
### Kubernetes
1. Run ``` kubectl apply -f .``` in the Kubernetes-app-deployment folder inside the project
2. Run ```kubectl create configmap my-config --from-env-file=../.env``` to add a configmap
3. Access web application on **http://localhost:31534/**
## Features
### Mock Interviewer
Practice your interview skills with our mock interview feature! Use our AI powered Interview Generator to Generate your own custom Interview. The User can then conduct their interview with Text-to-Speech that acts as the Interviewer and record their interview. At the end the User can save their recording to their very own media gallery!


### Media Gallery

### Application Database



## Prerequisites and Dependencies

- Node.js
- MongoDB
- Express.js
- React.js
- npm or yarn
- Must also have OpenAI authentication key
- Docker Desktop
- Kubernetes
