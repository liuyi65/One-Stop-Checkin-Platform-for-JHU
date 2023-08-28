FROM python:3

WORKDIR /app

ENV FLASK_APP = app.py

ENV FLASK_ENV = development

COPY ./requirements.txt .

RUN python -m pip install -r requirements.txt

# RUN pip install mysql-connector-python

COPY . .


# CMD ["python", "app.py"]
# RUN coverage run -m pytest && coverage report -m
