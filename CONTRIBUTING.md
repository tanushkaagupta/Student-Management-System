# Contributing to StudentHub

Thank you for your interest in contributing to the **Student Management System (StudentHub)**! We welcome contributions to improve features, code quality, and documentation.

---

## Code of Conduct

Please treat all members of the community with respect and courtesy. Harassment or discriminatory behavior will not be tolerated.

---

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/Student-Management-System.git
   cd Student-Management-System
   ```
3. **Create a topic branch** from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

---

## Development Workflow

### Backend (FastAPI)
1. Set up a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
4. Run tests:
   ```bash
   pytest
   ```

### Frontend (React + Vite)
1. Install Node dependencies:
   ```bash
   cd project
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Verify linting and type checking before committing:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

---

## Submitting Pull Requests

1. Commit your changes with clear, descriptive commit messages.
2. Push your topic branch to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
3. Open a Pull Request against the `main` branch of the official repository.
4. Describe your changes clearly in the PR description, referencing any relevant issue numbers.

---

## Reporting Issues

If you find a bug or have a suggestion, please open an Issue on GitHub with:
- A descriptive title.
- Clear steps to reproduce the issue.
- Expected vs. actual behavior.
- Environment details (OS, Python version, Node.js version).
