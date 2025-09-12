# 🧠 InsightCopilot – AI-Powered Document Analysis

**InsightCopilot** is a powerful AI-powered assistant that helps users analyze and extract insights from uploaded documents such as PDFs, images, and spreadsheets. Built using Django on the backend, and Tailwind/HTML on the frontend.

---

## 📁 Project Structure

```
developer1503-ai-insight/
├── app.html                        # Frontend UI (can be integrated with Django templates)
├── index.html                     # Landing page
└── insight_copilot/               # Django project root
    ├── manage.py
    ├── apps/                      # Custom Django app
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── views.py
    │   └── migrations/
    └── insight_copilot/           # Django config module
        ├── settings.py
        ├── urls.py
        ├── wsgi.py
        └── asgi.py
```

---

## 🚀 Features

- 📄 Upload documents (PDFs, images, spreadsheets)
- 🧠 AI-powered analysis and summarization
- 📊 Extracted insights and visualizations
- 🌙 Light/Dark theme toggle (if using Tailwind)
- ⚙️ Extensible backend API (Django)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/developer1503-ai-insight.git
cd developer1503-ai-insight
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:

```bash
pip install django
```

### 4. Apply Migrations

```bash
python manage.py migrate
```

### 5. Run Development Server

```bash
python manage.py runserver
```

Visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🗂️ Template Integration

If `app.html` is a custom frontend:

1. Move it to a `templates/` directory.
2. Update `settings.py`:

   ```python
   TEMPLATES = [
       {
           'BACKEND': 'django.template.backends.django.DjangoTemplates',
           'DIRS': [BASE_DIR / "templates"],
           ...
       },
   ]
   ```

3. Add a view in `apps/views.py`:

   ```python
   from django.shortcuts import render

   def home(request):
       return render(request, 'app.html')
   ```

4. Add URL in `insight_copilot/urls.py`:

   ```python
   from django.urls import path
   from apps import views

   urlpatterns = [
       path('', views.home, name='home'),
   ]
   ```

---

## 🧪 Testing

To run tests:

```bash
python manage.py test
```

---

## 📦 Deployment

You can deploy this on platforms like:

- **Render** – Fullstack Django hosting
- **Vercel** – Frontend hosting only (e.g., export static build)
- **Railway** / **Heroku** – Full backend deployment

---

## 👨‍💻 Author

- **Vedant Shinde** – [@developer1503](https://github.com/developer1503)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
