import os
import strformat
import html

proc exportQuiteType():void=
  let filename = "quiet-type.html"

  try:
    writeFile(filename, composeQuiteType())
    echo "Successfully wrote to file: ", filename
  except IOError:
    echo "Error: Could not write to file ", filename

exportQuiteType()
