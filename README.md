# 🍩 Donut Expo — Siegel Companies

MVP del sistema de gestión de pedidos y expo para Pink Box Donuts.

## Stack
- **Backend**: FastAPI (Python) — deploy en Render
- **Frontend**: React + Vite + Tailwind — deploy en Netlify

## Rutas del Frontend
| Ruta | Pantalla |
|------|----------|
| `/foh` | FOH Screen — crear pedidos |
| `/expo` | Expo Queue — Kanban de estados |
| `/kds` | Donut KDS — Kitchen Display System |

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```
Docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

## Variables de Entorno
Ver `backend/.env.example` y `frontend/.env.example`.
Para producción con Revel real: cambiar `REVEL_MOCK=false` y agregar credenciales reales.
