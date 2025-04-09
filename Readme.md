# Docker : Create Containers, images and orchestrate containers with compose

---

Let’s walk through “thinking in Docker” — especially when building a dynamic JavaScript app — and how Docker helps you at every stage of development and deployment. We’ll break it down into real-world steps so you can see how Docker fits in at each point.

##  🔄 First: What Does “Thinking in Docker” Mean?

It means designing, developing, and running your app in isolated containers that:

- Mimic production closely (same OS, same runtime)

- Run consistently anywhere (your laptop, cloud server, someone else's machine)

- Are easy to scale and manage

*So instead of installing Node, MySQL, etc. on your machine, you say:*

**"Let me spin up containers for everything this app needs."**

## 🧱 Let’s Build a Dynamic JS App in Docker (Step by Step)

Let’s say you’re building a dynamic To-Do web app with:

- Frontend: React

- Backend: Node.js + Express

- Database: PostgreSQL (or SQLite for dev)

## 🏗️ 1. Structure Your App
A typical project might look like:

```
/my-app
├── client/       # React frontend
├── server/       # Express backend
├── Dockerfile
├── docker-compose.yml

```

## 🐳 2. Dockerize Each Part

**✅ Backend Dockerfile (server/Dockerfile):**

```
FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install
CMD ["node", "src/index.js"]
EXPOSE 3000

```

**✅ Frontend Dockerfile (client/Dockerfile):**

```
FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn install && yarn build
EXPOSE 5173  # or 3000 if you're using create-react-app
CMD ["yarn", "dev"]

```

### Absolutely — let's break down your Dockerfile line by line, nice and clean 👇

1. **FROM node:lts-alpine**

  **🧱 This sets the base image for your container.**
  
  **node** = The official Node.js image.
  
  **lts** = "Long Term Support" version (e.g., Node 18 or 20, depending on the latest LTS).
  
  **alpine** = A super lightweight Linux distribution (~5MB), good for small, fast containers.

✅ It comes preinstalled with Node.js and npm/yarn.
*⚠️ Be careful: Alpine can sometimes have compatibility issues with certain native Node modules due to missing build tools.*

2. **WORKDIR /app**
   
  📁 This sets the working directory inside the container.
  
  Think of this like running cd /app.
  
  Any COPY, RUN, or CMD after this will run in /app.

3. **COPY . .**

  *📦 Copies files from your local machine into the container.*
  
    - The first . = your current folder (where the Dockerfile is)
    
    - The second . = the /app folder in the container (because of the WORKDIR)
  
  So basically: it takes your app's code and puts it inside the container at /app.

4. **RUN yarn install**

  🔧 Runs a command inside the container to install dependencies.

    - Uses Yarn (which is pre-installed in the node:lts-alpine image).
    
    - Reads package.json and yarn.lock to install everything your app needs.

🔍 This will install both dev + prod dependencies unless you pass --production.

5. **CMD ["node", "src/index.js"]**

   🚀 This is the command the container runs when it starts.

    - CMD takes an array (exec form), which avoids issues with shell parsing.
    
    - This runs your app with Node: node src/index.js.
  
  You can override this command with docker run myapp node otherScript.js.

  6. **EXPOSE 3000**

  🌐 Documents that the app listens on port 3000.

  Doesn't actually open the port by itself — it just declares it.
  
  You still need to map the port when you run the container:

     

## 🔀 3. Use Docker Compose to Orchestrate
docker-compose.yml makes it easy to spin up the entire app:

```
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5173:5173"
    volumes:
      - ./server:/app
    depends_on:
      - db

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app
      - frontend_node_modules:/app/node_modules  # fix ici
    working_dir: /app
    command: sh -c "npm install && npm run dev"  # 🛠️ assure que tout est installé

  db:
    image: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: todos
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
  frontend_node_modules:  # volume nommé ici

```

## 🚀 4. Develop in Docker

- Use docker-compose up --build to spin up the full stack.

- Code changes auto-refresh in containers if you mount volumes (volumes: - ./src:/app).

- You don’t need to install PostgreSQL or Node globally.

## 📦 5. Benefits During Development

Benefit	What It Means
**🧹 Clean:**	No messy installs on your machine
**🔁 Reproducible:** 	Everyone has the same dev setup
**🚢 Production-like:** 	Works exactly like in deployment
**🔐 Isolated:** 	Each app/service runs in its own container
**💾 Persistent:** 	Volumes save data (like DB) even if you rebuild containers

## 📤 6. Deploy With Docker

Once the app works, you can deploy it as-is:

- Build your images (docker build -t myapp-client ./client)

- Push to Docker Hub or your registry

- Run on a cloud VM, Docker Swarm, or Kubernetes

## 🔚 TL;DR - Thinking in Docker

🧠 Shift your mindset from:

**“How do I run this locally?”**

To:

**“How do I package this to run anywhere?”**

And use containers for:

- Each service (frontend, backend, db)

- Managing development + production parity

- Scaling easily

- Keeping your host OS clean


