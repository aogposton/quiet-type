// document elements
const database = document.getElementById('database');
const articleList = document.getElementById('articleList')

// nicknames
const articleListAttr = (article_title) => `li[article_title='${article_title}']`
const articleAttr = (article_title) => `article[article_title='${article_title}']`

// templates
const articleTmpl = document.getElementById('articleTmpl').innerHTML;


function remove_article_from_database(article_title) {
  console.log(articleAttr(article_title))
  database.querySelector(articleAttr(article_title)).remove()
}

function remove_article_from_article_list(article_title) {
  console.log(articleListAttr(article_title))
  articleList.querySelector(articleListAttr(article_title)).remove()
}

function delete_article(article_title) {
  if (!article_exists(article_title)) {
    console.log('no article exists')
    return
  }

  remove_article_from_article_list(article_title)
  remove_article_from_database(article_title)
}

function article_exists(article_title) {
  return database.querySelectorAll(articleAttr(article_title)).length
}

function addPostoToDatabase(article_title, article_content) {
  const newArticle = Mustache.render(articleTmpl, {
    article_title,
    article_content,
  });

  database.insertAdjacentHTML("beforeend", newArticle);
}

function addPostToArticleList(article_title) {
  const template = document.getElementById('articleLiTmpl').innerHTML;
  const newArticleLi = Mustache.render(template, {
    article_title,
  });

  articleList.insertAdjacentHTML("beforeend", newArticleLi);
}

function addPost() {
  let article_title = document.getElementById('editorTitle').value;
  const content = document.getElementById('editorContent').innerHTML;

  if (!article_title || !content) {
    alert('Please enter both a title and content for your post.');
    return;
  }

  if (article_exists(article_title)) {
    article_title = `${article_title}_copy`
    document.getElementById('editorTitle').value = article_title
  }
  addPostoToDatabase(article_title, content)
  addPostToArticleList(article_title)

  calibrateEventHandlers()
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function saveBlog() {
  // Get the entire HTML content of the current document
  // This will include any dynamically added posts
  const htmlContent = document.documentElement.outerHTML;

  // Create a Blob from the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor (<a>) element
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my_self_saving_blog.html'; // Suggested filename for the downloaded file

  // Append the anchor to the body (it doesn't need to be visible)
  document.body.appendChild(a);

  // Programmatically click the anchor to trigger the download
  a.click();

  // Clean up by revoking the Object URL and removing the anchor
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Your blog has been saved! Please overwrite the old file.');
}


// config
var options = {
  // toolbar: document.getElementById('custom-toolbar'),
  editor: document.querySelector('[data-toggle="pen"]'),
  debug: true,
  list: [
    'insertimage', 'blockquote', 'h2', 'h3', 'p', 'code', 'insertorderedlist', 'insertunorderedlist', 'inserthorizontalrule',
    'indent', 'outdent', 'bold', 'italic', 'underline', 'createlink'
  ]
};

// create editor
var pen = window.pen = new Pen(options);

pen.focus();

// toggle editor mode
document.querySelector('#mode').addEventListener('click', function() {
  var text = this.textContent;

  if (this.classList.contains('disabled')) {
    this.classList.remove('disabled');
    pen.rebuild();
  } else {
    this.classList.add('disabled');
    pen.destroy();
  }
});

// export content as markdown
document.querySelector('#tomd').addEventListener('click', function() {
  var text = pen.toMd();
  document.body.innerHTML = '<a href="javascript:location.reload()">&larr;back to editor</a><br><br><pre>' + text + '</pre>';
});

// toggle editor mode
document.querySelector('#hinted').addEventListener('click', function() {
  var pen = document.querySelector('.pen')

  if (pen.classList.contains('hinted')) {
    pen.classList.remove('hinted');
    this.classList.add('disabled');
  } else {
    pen.classList.add('hinted');
    this.classList.remove('disabled');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Code to execute when the DOM is ready
  console.log("DOM is ready!");
  calibrateEventHandlers()
});

// function populateArticleList() {
//   const databaseDiv = document.getElementById('database'); // Get the div with ID "database"
//   const articleList = document.getElementById('articleList'); // Get the div with ID "database"
//
//   if (!databaseDiv) {
//     console.error('Div with ID "database" not found.');
//     return;
//   }
//
//   const articles = databaseDiv.querySelectorAll('article'); // Find all <article> elements within the div
//
//   const ul = document.createElement('ul');
//
//   articles.forEach(article => {
//     const li = document.createElement('li'); // Create a new list item
//     const articleTitle = article.innerText.trim().split('\n')[0]; // Takes the first line as title
//
//     li.textContent = articleTitle; // Set the list item's text content to the article's title
//     ul.appendChild(li); // Add the list item to the unordered list
//   });
//
//   articleList.appendChild(ul);
// }

// populateArticleList();

