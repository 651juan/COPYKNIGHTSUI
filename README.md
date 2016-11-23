# Copy Knights User Interface.
The User Interface integrates with the Copy Knights API found [here](https://github.com/651juan/COPYKNIGHTSServer)

The User Interface uses angular and the command ```npm install``` must be run to download the required dependencies.

The User Interface can be run using ```npm start```

## The User Interface
On every page of the user interface there is a navigation bar located at the top of the page. This navigation bar allows the user to go to the home page by clicking the project title, go to the all articles page by clicking 'All Articles' or search by a keyword using the search bar.

### Home Page

In The home page we display the main industries that the copyright wiki uses.

### Articles Table

Wheather the user clicks on all articles, clicks on an industry from the main page or chooses to search by a keyword the UI shows the user the articles table page. Here the user can further refine his search using several filters or sort the articles by title, author or year. From this page the user can also visit the article page by clicking on the green 'View More Info' button next to each article.

### Article Page

Here the user can view a summary of the copyright wiki article. including a word cloud that is constructed for every article which can be clicked to search for a particular keyword. In the Article Page we also display a similar articles list where we find similar articles to the current article the user is viewing. At the bottom of the article page there is also a collapsable tree which illustrates the references this article makes to other articles and if those referenced articles also reference other articles these can also be seen here.