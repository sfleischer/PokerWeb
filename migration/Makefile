begin:
	source venv/bin/activate
init:
	virtualenv venv
	pip install -r requirements.txt
start:
	python server.py
test:
	python -m unittest discover -s tests -p "*_test.py"
clean:
	rm -r *.pyc