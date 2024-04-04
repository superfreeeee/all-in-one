.PHONY: test test-alloc bin install clean-bin

test:
	go test ./... -count=1

test-alloc:
	go build -gcflags="-m" test_alloc/main.go

# Go tutor 教程
test-tutor:
	go test ./tutor/... -v

bin: install
	$(shell go list -f '{{.Target}}')

install:
	go install

clean:
	go clean -i
