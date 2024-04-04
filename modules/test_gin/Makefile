test:
	echo 'test'

run:
	# PORT 环境变量定制启动端口
	PORT=8999 go run .

ping:
	curl localhost:8999/ping

post:
	curl localhost:8999/post --url-query id=1234 -X POST -d "name=manu&message=this_is_great" 
	@# curl localhost:8999/post -d "name=manu&message=this_is_great"

paramId:
	curl -X GET localhost:8999/param/111

test-albums:
	@echo "===================="
	@echo "> GetAlbums"
	curl http://localhost:8080/albums

	@echo "\n"
	@echo "===================="
	@echo "> PostAlbums"
	curl http://localhost:8080/albums \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"id": "4","title": "The Modern Sound of Betty Carter","artist": "Betty Carter","price": 49.99}'

	@echo "\n"
	@echo "===================="
	@echo "> GetAlbumByID"
	curl http://localhost:8080/albums/2