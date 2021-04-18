from app import app, db
from routes import register_blueprints

db.create_all()
register_blueprints(app)
app.run()
