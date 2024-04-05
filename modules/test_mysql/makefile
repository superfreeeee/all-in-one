.PHONY: start startd stop login

# 前台启动
start:
	cd db && docker-compose up

# 后台启动
startd:
	cd db && docker-compose up -d

# 停止后台
stop:
	cd db && docker-compose down

# shell 访问
login:
	docker exec -it test_go_mysql env LANG=C.UTF-8 mysql -u dev -p
