import strformat
import strutils 
import sequtils

proc loadFile(filename:string):string=
  var file:string

  try: 
    file = readFile(filename)
  except:
    echo fmt"failed to load {filename}"
    quit()

  return file

proc wrapInTag(tag:string, el:string, attributes:seq[string] = @[]):string=
  let
    attr: string = attributes.join(" ")
    open:string = fmt"<{tag} {attr}>"
    close:string = fmt"</{tag}>"
  return open & el & close

proc addMeta(attributes:seq[string]):string=
  return "<meta " & attributes.join(" ") & ">" 

proc loadTemplates():string=
  var templates:seq[string]

  let articleTemplate:        string = loadFile("src/templates/article.html")
  let articleLiTemplate:        string = loadFile("src/templates/article_li.html")

  templates.add(wrapInTag("script", el=articleTemplate, @["id='articleTmpl'","type='x-tmpl-mustache'"]))
  templates.add(wrapInTag("script", el=articleLiTemplate, @["id='articleLiTmpl'","type='x-tmpl-mustache'"]))

  return templates.join("\n")
  
proc composeQuiteType*():string=
  let 
    baseCSS:          string = loadFile("src/base/base.css")
    penCSS:           string = loadFile("src/editor/src/pen.css") 
    penJS:            string = loadFile("src/editor/src/pen.js") 
    mustacheJS:       string = loadFile("src/mustache/mustache.js") 
    markdownJS:       string = loadFile("src/editor/src/markdown.js")
    baseHTML:         string = loadFile("src/base/base.html")
    baseJS:           string = loadFile("src/base/base.js")

  let
    docType:        string = "<!DOCTYPE html>"

  let
    title:          string = wrapInTag("title",el="Self-Downloading Blog")
    charsetMeta:    string = addMeta(@["charset=\"UTF-8\""])
    viewportMeta:   string = addMeta(@["name=\"viewport\"", "content=\"width=device-width, initial-scale=1.0\""])
    meta:           string = charsetMeta & viewportMeta & title
    baseStyle:      string = wrapInTag("style",el=baseCSS)
    penStyle:       string = wrapInTag("style",el=penCSS)
    styles:         string = baseStyle & penStyle
    head:           string = meta & styles

  let
    penScript:      string = wrapInTag("script", el=penJS)
    mustacheScript: string = wrapInTag("script", el=mustacheJS)
    markdownScript: string = wrapInTag("script", el=markdownJS)
    baseScript:     string = wrapInTag("script", el=baseJS)
    scripts:        string = penScript & markdownScript & mustacheScript & baseScript 
    templateScripts:string = loadTemplates()
    body:           string = templateScripts & baseHtml & scripts

  let 
    document:       string = docType & wrapInTag("head",el = head) & wrapInTag("body",el=body)
    window:         string = wrapInTag("html",el=document, @["lang=\"en\""])

  return window


