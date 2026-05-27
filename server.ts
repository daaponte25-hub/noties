import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { User, UserRole, UserStatus } from './src/Models/UserModel';

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'users.json');

// Ensure database folder and file exist with initial mock data
function initializeDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    const defaultUsers: User[] = [
      {
        id: 'admin-default-id',
        fullName: 'Administrador de Noties',
        email: 'admin@noties.com',
        password: 'admin', // En producción se hashearía, para desarrollo local se almacena legible o simple
        role: 'Administrador',
        status: 'Activo',
        createdAt: new Date().toISOString()
      },
      {
        id: 'teacher-1',
        fullName: 'Sonia Rodríguez',
        email: 'sonia.rodriguez@noties.edu',
        password: 'sonia',
        role: 'Docente',
        status: 'Activo',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rep-1',
        fullName: 'Carlos Gómez',
        email: 'carlos.gomez@noties.edu',
        password: 'carlos',
        role: 'Representante',
        status: 'Activo',
        createdAt: new Date().toISOString()
      }
    ];

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      console.log('Database initialized successfully with mock users.');
    } else {
      // If database file exists, parse and sanitize roles
      const rawData = fs.readFileSync(DB_FILE, 'utf-8');
      try {
        const users = JSON.parse(rawData) as any[];
        let altered = false;
        const sanitizedUsers = users.map(user => {
          if (user.role === 'Coordinador' || user.role === 'Estudiante') {
            user.role = 'Representante';
            altered = true;
          }
          return user;
        });
        if (altered) {
          fs.writeFileSync(DB_FILE, JSON.stringify(sanitizedUsers, null, 2), 'utf-8');
          console.log('Database sanitized list of users: transformed obsolete roles to Representante.');
        }
      } catch (parseErr) {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Read users from server
function readUsers(): User[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initializeDatabase();
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error) {
    console.error('Error reading backend database file:', error);
    return [];
  }
}

// Write users to database file
function writeUsers(users: User[]): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing backend database file:', error);
    return false;
  }
}

async function startServer() {
  initializeDatabase();
  const app = express();

  // Enable JSON request parsing
  app.use(express.json());

  // Log requests for debugging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // ==========================================
  // AUTH API ENDPOINTS
  // ==========================================

  // Perform login check
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'El correo y la contraseña son requeridos.' });
    }

    const users = readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'El correo electrónico no está registrado.' });
    }

    if (user.status === 'Inactivo') {
      return res.status(403).json({ success: false, message: 'Esta cuenta está desactivada. Contacta al administrador.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'La contraseña es incorrecta.' });
    }

    // Login successful
    const { password: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: safeUser
    });
  });

  // ==========================================
  // USERS MANAGEMENT CRUD ENDPOINTS
  // ==========================================

  // GET: List all users
  app.get('/api/users', (req, res) => {
    const users = readUsers();
    // Return users without passwords for security, or keep them for form editing if simple app (we will leave passwords as separate field or hide it)
    const secureUsers = users.map(({ password, ...user }) => ({
      ...user,
      hasPassword: !!password
    }));
    res.json(secureUsers);
  });

  // GET: Specific user details (including simple password for editing if needed, but safe)
  app.get('/api/users/:id', (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json(user);
  });

  // POST: Create dynamic user
  app.post('/api/users', (req, res) => {
    const { fullName, email, password, role, status } = req.body;

    if (!fullName || !email || !password || !role || !status) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const users = readUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return res.status(400).json({ message: 'El correo electrónico ya se encuentra registrado.' });
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullName,
      email,
      password,
      role: role as UserRole,
      status: status as UserStatus,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    const saved = writeUsers(users);

    if (!saved) {
      return res.status(500).json({ message: 'Error interno al guardar en el archivo JSON.' });
    }

    const { password: _, ...secureUser } = newUser;
    res.status(201).json(secureUser);
  });

  // PUT: Modify user
  app.put('/api/users/:id', (req, res) => {
    const { fullName, email, password, role, status } = req.body;
    const { id } = req.params;

    const users = readUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Check if email belongs to someone else
    if (email) {
      const duplicate = users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id);
      if (duplicate) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
      }
    }

    // Modify user fields
    const updatedUser = { ...users[index] };
    if (fullName) updatedUser.fullName = fullName;
    if (email) updatedUser.email = email;
    if (password !== undefined && password !== '') updatedUser.password = password;
    if (role) updatedUser.role = role as UserRole;
    if (status) updatedUser.status = status as UserStatus;

    users[index] = updatedUser;
    const saved = writeUsers(users);

    if (!saved) {
      return res.status(500).json({ message: 'Error al actualizar el usuario en base de datos.' });
    }

    const { password: _, ...secureUser } = updatedUser;
    res.json(secureUser);
  });

  // DELETE: Delete user (optional, but completes CRUD experience gracefully)
  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const users = readUsers();
    const filteredUsers = users.filter(u => u.id !== id);

    if (users.length === filteredUsers.length) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const saved = writeUsers(filteredUsers);
    if (!saved) {
      return res.status(500).json({ message: 'Error al eliminar el usuario de la DB.' });
    }

    res.json({ success: true, message: 'Usuario eliminado exitosamente.' });
  });

  // ==========================================
  // VITE DEVELOPMENT MIDDLEWARE OR PROD ROUTE
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Noties Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
