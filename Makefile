NIM=nim
SRC=src/main.nim
BIN=build/main
DIST=dist
GENFILE=quiet-type.html

.PHONY: all run clean

all: $(BIN)

$(BIN): $(SRC)
	@mkdir -p build
	$(NIM) c -o:$(BIN) $(SRC)
	./$(BIN)
	@mkdir -p $(DIST)
	@mv $(GENFILE) $(DIST)/

clean:
	@rm -rf build $(GENFILE)
	@rm -rf build $(DIST)
