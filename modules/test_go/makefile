.PHONY: test test-alloc bin install clean-bin

test:
	go test ./... -count=1

test-alloc:
	go build -gcflags="-m" test_alloc/main.go

# Go tutor 教程
test-tutor:
	go test ./tutor/... -v

# 模糊测试
# -fuzz=Fuzz 指向 f.Fuzz
# -fuzztime  指定运行时间
test-fuzz:
	go test ./test_fuzz -fuzz=Fuzz -fuzztime=10s

bin: install
	$(shell go list -f '{{.Target}}')

install:
	go install

clean:
	go clean -i
