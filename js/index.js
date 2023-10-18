document.addEventListener('DOMContentLoaded', (event) => {
  const userList = document.querySelector('#user-list');
  const reposList = document.querySelector('#repos-list');

  const form = document.querySelector('#github-form');
  form.addEventListener('submit', formSubmission);

  function formSubmission(e) {
      e.preventDefault();
      const search = document.querySelector('#search').value;
      fetch(`https://api.github.com/search/users?q=${search}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json'
          }
      })
          .then(res => res.json())
          .then(data => {
              userList.innerHTML = '';
              reposList.innerHTML = '';

              for (const user of data.items) {
                  const listItem = document.createElement('li');
                  listItem.innerHTML = `
                  <img src='${user.avatar_url}' alt='${user.login}'/>
                  <a href='${user.html_url}' target='_blank'>${user.login}</a>
              `;

                  listItem.addEventListener('click', () => {
                      fetch(`https://api.github.com/users/${user.login}/repos`, {
                          method: 'GET',
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/vnd.github.v3+json'
                          }
                      })
                          .then(res => res.json())
                          .then(data => {
                              reposList.innerHTML = '';
                              for (const repo of data) {
                                  const listItem = document.createElement('li');
                                  listItem.innerHTML = `
                                  <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
                              `;

                                  reposList.appendChild(listItem);
                              }
                          });
                  });

                  userList.appendChild(listItem);
              }
          })
          .catch(err => {
              console.log(err);
          });
  }
});