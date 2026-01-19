🚀 Campus Placement Portal V2.0A high-performance, professional ecosystem designed to bridge the gap between students, faculty, and recruiters. Featuring a Neural Identity UI, real-time tracking, and automated placement workflows.✨ Key Features🛡️ Secure Identity Portal: Advanced registration system with role-based access control (Student/Faculty).🌓 Dynamic UX: Seamless Dark and Light mode integration with high-density kinetic backgrounds.📊 Placement Analytics: Real-time tracking of student eligibility and recruitment status.📋 Todo & Resource Management: Integrated task tracker and academic material repository.📱 Fully Responsive: Optimized for desktop, tablet, and mobile viewing.🛠️ Tech StackFrontendReact.js 18 - UI LogicMaterial UI (MUI) - Professional Component LibraryFramer Motion - High-level animations & transitionsReact Router Dom - Dynamic RoutingBackendNode.js & Express - Server-side architectureMongoDB & Mongoose - Database managementJWT & Bcrypt - Security and Authentication🚀 Installation & SetupFollow these steps to initialize the project environment:PrerequisitesNode.js (v16.x or higher)MongoDB Atlas account or local installationGitStep 1: Clone the RepositoryBashgit clone https://github.com/yourusername/campus-placement-portal.git
cd campus-placement-portal
Step 2: Backend ConfigurationBashcd backend
npm install
# Create a .env file and add:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
npm start
Step 3: Frontend ConfigurationBashcd ../frontend
npm install
npm start
📂 Project StructurePlaintextcampus-placement-portal/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Navbar, Cards)
│   │   ├── context/      # Auth & Theme Context
│   │   └── pages/        # Register, Login, Dashboard
├── backend/              # Node.js API
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API Endpoints
│   └── middleware/       # Auth & Error handling
└── README.md
📸 Screen PreviewsRegistration PortalStudent Dashboard🤝 ContributingFork the Project.Create your Feature Branch (git checkout -b feature/AmazingFeature).Commit your Changes (git commit -m 'Add some AmazingFeature').Push to the Branch (git push origin feature/AmazingFeature).Open a Pull Request.📄 LicenseDistributed under the MIT License. See LICENSE for more information.⭐ If you like this project, give it a star!
