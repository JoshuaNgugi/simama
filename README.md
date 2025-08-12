# Simama Health Management Platform
### Tagline: Helping You Stand Strong Again

## 🚀 About
Simama is a modern, full-stack health management platform designed to streamline the interaction between Doctors, Patients, and Pharmacists. It provides a secure and intuitive environment for managing prescriptions, patient records, and enhancing communication within the healthcare ecosystem. Built with a focus on user experience and robust security, Simama aims to simplify healthcare processes and support well-being.

## ✨ Features
Simama offers a range of features tailored to its three primary user roles:

- Secure Authentication & Authorization:

    - Unified login for Doctors and Pharmacists

    - Role-based access control ensuring users can only access authorized sections of the application.

    - JWT-based authentication with secure cookie management.

- Intuitive User Interface:

    - Modern and clean design following a "Modern Wellness" theme with Tailwind CSS.

    - Animated elements and responsive layouts for a seamless experience across devices.

    - Professional icons using HeroIcons and React Icons.

- Role-Based Dashboards:

    - Doctor Dashboard: Overview of prescriptions created by the doctor, with ability to create new ones and delete existing ones.

    - Pharmacist Dashboard: Manage and fulfill pending prescriptions, with a confirmation modal for actions.

- Prescription Management (CRUD Operations):

    - Create: Doctors can create new prescriptions, dynamically selecting patients and drugs.

    - Read: All users can view relevant prescription lists; a dedicated Prescription Detail page provides comprehensive information for any specific prescription.

    - Update: Pharmacists can mark prescriptions as "Fulfilled".

    - Delete: Doctors can soft-delete prescriptions.

- Enhanced User Experience:

    - Toast notifications for real-time feedback on user actions (success, error, loading).

    - Client-side pagination for managing large lists of data, preventing clutter and improving performance.

## 🛠️ Technologies Used
- Next.js 13 (App Router): The React framework for production, providing server-side rendering, routing, and an efficient development experience.

- React: For building interactive user interfaces.

- TypeScript: For type safety and improved code quality.

- Tailwind CSS: A utility-first CSS framework for rapid and consistent styling.

- react-hook-form and Zod: For robust and type-safe form management and validation.

- Axios: For making HTTP requests to the backend API.

- js-cookie: For client-side cookie management to persist user sessions.

- react-hot-toast: For elegant and non-intrusive toast notifications.

- date-fns: For date formatting.

- @heroicons/react and react-icons: For a rich set of scalable vector icons.

- Google Fonts

## 📂 Project Structure
```
simama/
├── public/                  
├── src/
│   ├── app/                 
│   │   ├── (auth)/          
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── doctor/          
│   │   │   ├── layout.tsx   
│   │   │   ├── page.tsx     
│   │   │   └── prescriptions/
│   │   │       └── create/page.tsx 
│   │   ├── patient/         
│   │   │   ├── layout.tsx   
│   │   │   ├── page.tsx     
│   │   │   └── profile/page.tsx 
│   │   ├── pharmacist/      
│   │   │   ├── layout.tsx   
│   │   │   └── page.tsx     
│   │   ├── prescription/    
│   │   │   └── [id]/page.tsx
│   │   ├── globals.css      
│   │   ├── layout.tsx       
│   │   └── page.tsx         
│   ├── components/          
│   │   └── FulfillConfirmationModal.tsx 
│   ├── context/             
│   │   └── AuthContext.tsx
│   ├── features/            
│   │   └── auth/
│   │       ├── components/
│   │           ├── LoginForm.tsx
│   │           └── RegisterForm.tsx
│   ├── services/            
│   │   └── api.ts           
│   ├── middleware.ts        
├── tailwind.config.ts       
├── tsconfig.json            
└── package.json   
```          

## 🚀 Getting Started
Follow these steps to set up and run the Simama frontend application locally.

### Prerequisites
Node.js (v18.x or later)

npm (npm v8.x or later)

### Installation
1. Clone the repository:

`git clone https://github.com/JoshuaNgugi/simama`

`cd simama`

2. Install dependencies:

`npm install`

3. Ensure Backend is Running:
This frontend application relies on a separate ASP.NET Core Web API backend. 
Please see https://github.com/JoshuaNgugi/Simama.API for more on this.
Make sure your backend API is running and accessible at the base URL configured in `src/services/api.ts`.

4. Running the Application

`npm run dev`

Open in browser:
The application will be accessible at http://localhost:3000. Use the seeded values indicated in [this file](https://github.com/JoshuaNgugi/Simama.API/blob/master/DataSeeder.cs) to log in. 

## 🌟 Future Enhancements
- Enable patients to login into the system, view their health information and be notified of event changes (e.g., see doctor, lab results are ready, go to pharmacy)

- Add statics to patient dashboard e.g., let them see their vitals such as BP, HR, BMI, height and weight over a period of time

- User Profile Editing: Allow users to update their personal information from their respective profile pages.

- Search & Filtering: Implement search and filter functionalities on dashboards (e.g., filter prescriptions by status, search patients by name).

- Advanced Pagination: Transition to server-side pagination for extremely large datasets, where the backend handles data slicing.

- Messaging System: Develop a secure in-app messaging feature for direct communication between doctors and patients.

- Notifications: Implement a more comprehensive notification system for various events (e.g., new prescription, prescription fulfilled).

- Admin Dashboard: Create an admin panel for overall system management and registering health facilities

- HttpOnly Cookies: Enhance security by having the backend issue HttpOnly cookies for session management.