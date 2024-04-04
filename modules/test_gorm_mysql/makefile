.PHONY: start startd stop login

# 前台启动
start:
	cd ../test_mysql && cd db && docker-compose up

# 后台启动
startd:
	cd ../test_mysql && cd db && docker-compose up -d

# 停止后台
stop:
	cd ../test_mysql && cd db && docker-compose down

# shell 访问
login:
	cd ../test_mysql && docker exec -it db_db_1 env LANG=C.UTF-8 mysql -u dev -p
