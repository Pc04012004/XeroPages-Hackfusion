myenv\Scripts\activate 
pip freeze > requirements.txt
celery -A backend control shutdown
# use the solo flag for now (in mvp/development)
celery -A backend worker --loglevel=info -P solo
celery -A backend  beat -l info
venv\Scripts\activate 