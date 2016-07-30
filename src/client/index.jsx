require('../../node_modules/bootstrap/dist/css/bootstrap.min.css');
import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda'; // a utility library similar to lodash, but functional programming oriented.


let githubUserId = 'reactivize';

const url = `https://api.github.com/users/${githubUserId}/repos`;

/**
 * @component display report from github repo
 * 
 */
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      spinner: 'Waiting...',
      searchString: '',
      repoName: 'reactivize'

    };
  }


  componentWillMount() {
    console.log('githubapi.js: start: componentDidMount');
    this.setState({ spinner: 'Waiting...' });

    window.fetch(url)
      .then(function (response) {
        console.log('githubapi.js: fetch.then, response: ', response);
        return response.json();
      }).then(function (jsObj) {
        //console.log('githubapi.js: start: componentDidMount, jsObj: ', jsObj);
        const p = processData(jsObj);
        //console.log('githubapi.js: start: componentDidMount, jsObj p: ', p);
        this.setState({ repos: p, spinner: '' });
      }.bind(this));
  }


  handleSearch(evt) {
    this.setState({ searchString: evt.target.value });
  }


  render() {

    let repos = [];

    const searchStr = this.state.searchString.trim().toLowerCase();

    const cbFilter = (e) => e.name.toLowerCase().match(searchStr);

    if (searchStr.length > 0) { // user is searching if true
      repos = R.filter(cbFilter, this.state.repos);
    } else {
      repos = this.state.repos;
    }


    const cb = (e) => {
      return (<div style={{ marginBottom: 10 }} key={e.name}>
        Name: {e.name} <br />
        Fork count: {e.forksCount} <br />
        Language: {e.language} <br />
      </div>);
    };
    const repoItems = R.map(cb, repos);

    return (<div>
      <div className="jumbotron">
        <h2>Github Repos</h2>
      </div>

      <form
        className="form-horizontal"
        >

        <div className="form-group">

          <div className="row">
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                name="repoName"
                placeholder="Repo Name"
                value={this.state.repoName}
                />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-10">

              <input
                className="form-control"
                type="text"
                name="search"
                placeholder="Search"
                onChange={this.handleSearch.bind(this) }
                value={this.state.searchString}
                />
            </div>
          </div>

        </div>

        {repoItems}

      </form>
    </div>);


  }
}

ReactDOM.render(<App/>, document.querySelector('#myApp'));



//task: get this styling working
//ref: https://preactjs.com/repl
// const Result = ({ result }) => (
//   <div style={{
//     padding: 10,
//     margin: 10,
//     background: 'white',
//     boxShadow: '0 1px 5px rgba(0,0,0,0.5)'
//   }}>
//     <div>
//       <a href={result.html_url} target="_blank">
//         {result.full_name}
//       </a>
//       🌟<strong>{result.stargazers_count}</strong>
//     </div>
//     <p>{result.description}</p>
//   </div>
// );




/**
 * this is a functional pipeline that transforms the raw source data into the format required by the UI
 * note: the compose function is right-associative, so you read the order of the function params from the bottom up.
 * - i.e. compared with the Unix pipe operator, which is left-associative thus reads from left to right
 */
const processData = (repoData) => {

  const exclude = ['as', 'on'];

  const titleize = s => R.concat(R.toUpper(R.head(s)), R.toLower(R.tail(s)));

  const cbt = (e) => {
    if (R.contains(e, exclude)) {
      return e; //don't titleize if the word is in the exclude list
    }
    return titleize(e);
  };
  const titleizeByExclude = R.map(cbt);

  const titleizeWords = R.compose(
    R.join(' '), // [s] => s
    titleizeByExclude, // [s] -> [s]
    R.split('-') // s -> [s]
  );

  const cb = (e) => {
    return {
      name: titleizeWords(e.name),
      forksCount: e.forks_count,
      language: e.language,
      created: e.created_at
    };
  };

  const byForksDesc = (a, b) => b.forksCount - a.forksCount;

  const mapRepos = R.compose(
    R.sort(byForksDesc),
    R.map(cb)
  );

  return mapRepos(repoData);
};




/*
spec:

1. With React and the Github API,
- display the list of public repositories of the 7geese organization,
- ordered by fork count desc.

2. For each item show...
- repo name
- fork number
- language
- created date

3. Format the repository title
- to have hyphens replaced by spaces,
- and each word capitalized except: "as", "on"
Example: "this-is-a-test-on-javascript" becomes "This Is A Test on Javascript".
hubot-on-dotcloud
django-view-as

4. Add the ability to search for repos by name.


Sample:
---
Name: SG Tpie
Fork count: 4
Language: Javascript
---
Name: 7Geese Recognition Board
Fork count: 2
Language: Python
---
Name: Hubot on Dotcloud
Fork count: 0
Language: Shell
---
Name: Django Db Utils
Fork count: 0
Language: Python

 */
