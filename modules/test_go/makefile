.PHONY: test bin install clean-bin

test:
	go test ./... -count=1

bin: install
	$(shell go list -f '{{.Target}}')

install:
	go install

clean:
	go clean -i
