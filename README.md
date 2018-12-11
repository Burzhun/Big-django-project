# Mhealth 2.0

## Для локального стенда:
```
	docker-compose -f docker-compose.dev.yml up --build
```


## Для работы с проектом в контейнере:
```
	docker-compose -f docker-compose.dev.yml exec app bash
```

## Фикстуры были созданы командой:
```
	python3 manage.py dumpdata --exclude=contenttypes --exclude=auth.Permission --exclude=sessions --exclude=admin  --indent=4 --natural-foreign > app.json
```