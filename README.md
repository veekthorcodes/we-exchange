# Project Setup Instructions

Follow these steps to set up and run the project locally.

## Prerequisites

- Git
- Make
- Docker and Docker Compose

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/veekthorcodes/we-exchange.git   
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Set up environment variables:
   - Navigate to the `/backend` directory and create a `.env` file using `.env.example` as a template:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update `.env` file with your specific configuration values

4. Start the application:
   - Navigate to the root directory:
     ```bash
     cd ..
     ```
   - Run Docker Compose:
     ```bash
     docker-compose up --build
     ```

