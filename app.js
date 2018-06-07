window.addEventListener('load', () => {
  console.log('Ready to go!!');

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }


  const baseURL = 'http://localhost:3020/universities';

  const createUniversity = () => {
    event.preventDefault();
    console.log('createUniversity');
    const name = document.querySelector('#name').value;
    const state = document.querySelector('#state').value;
    const location = document.querySelector('#location').value;
    const poster_url = document.querySelector('#poster_url').value;
    const gpa = document.querySelector('#gpa').value;
    axios.post(baseURL, {
        name,
        state,
        location,
        poster_url,
        gpa,
        cost
      })
      .then(result => {
        showUniversity(result.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const newUniversity = () => {
    console.log('Display new university form.');
    document.querySelector('#app').innerHTML = `
      <form>
        <div class="form-group">
          <label for="name">name</label>
          <input type="text" id="name" class="form-control" />
        </div>
        <div class="form-group">
          <label for="state">state</label>
          <input type="text" id="state" class="form-control" />
        </div>
        <div class="form-group">
          <label for="location">location</label>
          <input type="text" id="location" class="form-control" />
        </div>
        <div class="form-group">
          <label for="poster_url">poster_url</label>
          <input type="text" id="poster_url" class="form-control" />
        </div>
        <div class="form-group">
          <label for="gpa">Poster URL</label>
          <input type="text" id="gpa" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary" id="create-university">Create</button>
      </form>
      `;
    document.querySelector('#create-university').addEventListener('click', createUniversity);
  }

  const showUniversity = university => {
    console.log('Show page for university:');
    console.log(university);
    document.querySelector('#app').innerHTML = `
      <div class="h3">${university.name}</div>
      <img src="${university.poster_url}" width="40%" />
      <table class="table table-striped">
        <tbody>
          <tr>
            <th scope="row">state</th>
            <td>${university.state}</td>
          </tr>
          <tr>
            <th scope="row">location</th>
            <td>${university.location}</td>
          </tr>
          <tr>
            <th scope="row">GPA</th>
            <td>${university.gpa}</td>
          </tr>
        </tbody>
      </table>
    `;
  }
  const updateUniversity = id => {
    event.preventDefault();
    console.log('createUniversity');
    const name = document.querySelector('#edit-name').value;
    const state = document.querySelector('#edit-state').value;
    const location = document.querySelector('#edit-location').value;
    const poster_url = document.querySelector('#edit-poster_url').value;
    const gpa = document.querySelector('#edit-gpa').value;
    axios.put(`${baseURL}/${id}`, {
        name,
        state,
        location,
        poster_url,
        gpa,
        cost
      })
      .then(result => {
        showUniversity(result.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const editUniversity = university => {
    document.querySelector('#app').innerHTML = `
      <form>
        <div class="form-group">
          <label for="edit-name">Name</label>
          <input type="text" id="edit-name" class="form-control" />
        </div>
        <div class="form-group">
          <label for="edit-state">State</label>
          <input type="text" id="edit-state" class="form-control" />
        </div>
        <div class="form-group">
          <label for="edit-location">Location</label>
          <input type="text" id="edit-location" class="form-control" />
        </div>
        <div class="form-group">
          <label for="edit-poster_url">Logo</label>
          <input type="text" id="edit-poster_url" class="form-control" />
        </div>
        <div class="form-group">
          <label for="edit-gpa">Gpa</label>
          <input type="text" id="edit-gpa" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary" id="update-university">Update</button>
      </form>
    `;
    document.querySelector('#edit-name').value = university.name;
    document.querySelector('#edit-state').value = university.state;
    document.querySelector('#edit-location').value = university.location;
    document.querySelector('#edit-poster_url').value = university.poster_url;
    document.querySelector('#edit-gpa').value = university.gpa;
    document.querySelector('#update-university').addEventListener('click', () => {
      updateUniversity(university.id);
    });
  }

  const deleteUniversity = id => {
    console.log('Deleting university no.', id);
    axios.delete(`${baseURL}/${id}`)
      .then(result => {
        allUniversities();
      })
      .catch(error => {
        console.error(error);
      });
  }
  const loadKeywords = keywords => {
    for (var i = 0; i < keywords.length; i++) {
      const columnEl = document.createElement('div');
      columnEl.className = 'col';
      const draggableEl = document.createElement('div');
      draggableEl.setAttribute('data-draggable', 'item');
      draggableEl.setAttribute('draggable', 'true');
      draggableEl.setAttribute('aria-grabbed', 'false');
      draggableEl.innerHTML = keywords[i];
      columnEl.appendChild(draggableEl);
      document.getElementById('listOfItemsContent').appendChild(columnEl)
    }
  }
  const allUniversities = () => {
    document.querySelector('#app').innerHTML = `
      <table class="table table-striped table-dark">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">State</th>
            <th scope="col">Location</th>
            <th scope="col">GPA</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="university-tbody"></tbody>
      </table>
      <br>
      <div>
      <button type="button" class="btn btn-success" id="new-university">Add a university</button>
      </div>
    `;
    document.querySelector('#new-university').addEventListener('click', newUniversity);
    axios.get(baseURL)

      .then(universities => {
        const allKeywords = universities.data.map(university => university.keywords).join(', ').split(', ');
        amountOfKeywords = allKeywords.length
        loadKeywords(allKeywords);
        universities.data.forEach(university => {
          const trEl = document.createElement('tr');
          trEl.innerHTML = `
            <td id="show-${university.id}">${university.name}</td>
            <td>${university.state}</td>
            <td>${university.location}</td>
            <td>${university.gpa}</td>
            <td><button type="button" class="btn btn-info btn-sm" id="edit-${university.id}">Edit</button>&nbsp;<button type="button" class="btn btn-danger btn-sm" id="delete-${university.id}">Delete</button></td>
          `;
          document.querySelector('#university-tbody').appendChild(trEl);
          document.querySelector(`#show-${university.id}`).addEventListener('click', () => {
            showUniversity(university);
          });
          document.querySelector(`#edit-${university.id}`).addEventListener('click', () => {
            editUniversity(university);
          });
          document.querySelector(`#delete-${university.id}`).addEventListener('click', () => {
            deleteUniversity(university.id);
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }


  document.querySelector('#app-start').addEventListener('click', allUniversities);
  allUniversities();
});

  (function() {
    if (!document.querySelectorAll || !('draggable' in document.createElement('span')) || window.opera) {
      return;
    }
    for (var
        target1 = document.querySelectorAll('[data-draggable="target1"]'),
        len = target1.length,
        i = 0; i < len; i++) {
      target1[i].setAttribute('aria-dropeffect', 'none');
    }
    for (var
        items = document.querySelectorAll('[data-draggable="item"]'),
        len = items.length,
        i = 0; i < len; i++) {
      items[i].setAttribute('draggable', 'true');
      items[i].setAttribute('aria-grabbed', 'false');
      items[i].setAttribute('tabindex', '0');
    }
    var selections = {
      items: [],
      owner: null,
      droptarget: null
    };

    function addSelection(item) {
      if (!selections.owner) {
        selections.owner = item.parentNode;
      } else if (selections.owner != item.parentNode) {
        return;
      }

      item.setAttribute('aria-grabbed', 'true');

      selections.items.push(item);
    }

    function removeSelection(item) {

      item.setAttribute('aria-grabbed', 'false');

      for (var len = selections.items.length, i = 0; i < len; i++) {
        if (selections.items[i] == item) {
          selections.items.splice(i, 1);
          break;
        }
      }
    }

    function clearSelections() {
      if (selections.items.length) {
        selections.owner = null;
        for (var len = selections.items.length, i = 0; i < len; i++) {
          selections.items[i].setAttribute('aria-grabbed', 'false');
        }
        selections.items = [];
      }
    }

    function hasModifier(e) {
      return (e.ctrlKey || e.metaKey || e.shiftKey);
    }

    function addDropeffects() {
      for (var len = target1.length, i = 0; i < len; i++) {
        if (
          target1[i] != selections.owner &&
          target1[i].getAttribute('aria-dropeffect') == 'none'
        ) {
          target1[i].setAttribute('aria-dropeffect', 'move');
          target1[i].setAttribute('tabindex', '0');
        }
      }
      for (var len = items.length, i = 0; i < len; i++) {
        if (
          items[i].parentNode != selections.owner &&
          items[i].getAttribute('aria-grabbed')
        ) {
          items[i].removeAttribute('aria-grabbed');
          items[i].removeAttribute('tabindex');
        }
      }
    }

    function clearDropeffects() {
      if (selections.items.length) {
        for (var len = target1.length, i = 0; i < len; i++) {
          if (target1[i].getAttribute('aria-dropeffect') != 'none') {
            target1[i].setAttribute('aria-dropeffect', 'none');
            target1[i].removeAttribute('tabindex');
          }
        }
        for (var len = items.length, i = 0; i < len; i++) {
          if (!items[i].getAttribute('aria-grabbed')) {
            items[i].setAttribute('aria-grabbed', 'false');
            items[i].setAttribute('tabindex', '0');
          } else if (items[i].getAttribute('aria-grabbed') == 'true') {
            items[i].setAttribute('tabindex', '0');
          }
        }
      }
    }

    function getContainer(element) {
      do {
        if (element.nodeType == 1 && element.getAttribute('aria-dropeffect')) {
          return element;
        }
      }
      while (element = element.parentNode);

      return null;
    }
    document.addEventListener('mousedown', function(e) {
      if (e.target.getAttribute('draggable')) {
        clearDropeffects();
        if (!hasModifier(e) &&
          e.target.getAttribute('aria-grabbed') == 'false'
        ) {
          clearSelections();
          addSelection(e.target);
        }
      } else if (!hasModifier(e)) {
        clearDropeffects();
        clearSelections();
      } else {
        clearDropeffects();
      }
    }, false);
    document.addEventListener('mouseup', function(e) {
      if (e.target.getAttribute('draggable') && hasModifier(e)) {
        if (e.target.getAttribute('aria-grabbed') == 'true') {
          removeSelection(e.target);
          if (!selections.items.length) {
            selections.owner = null;
          }
        } else {
          addSelection(e.target);
        }
      }

    }, false);
    document.addEventListener('dragstart', function(e) {
      if (selections.owner != e.target.parentNode) {
        e.preventDefault();
        return;
      }
      if (
        hasModifier(e) &&
        e.target.getAttribute('aria-grabbed') == 'false'
      ) {
        addSelection(e.target);
      }
      e.dataTransfer.setData('text', '');
      addDropeffects();
    }, false);
    document.addEventListener('keydown', function(e) {
      if (e.target.getAttribute('aria-grabbed')) {
        if (e.keyCode == 32) {
          if (hasModifier(e)) {
            if (e.target.getAttribute('aria-grabbed') == 'true') {
              if (selections.items.length == 1) {
                clearDropeffects();
              }
              removeSelection(e.target);
              if (selections.items.length) {
                addDropeffects();
              }
              if (!selections.items.length) {
                selections.owner = null;
              }
            } else {
              addSelection(e.target);
              addDropeffects();
            }
          } else if (e.target.getAttribute('aria-grabbed') == 'false') {
            clearDropeffects();
            clearSelections();
            addSelection(e.target);
            addDropeffects();
          } else {
            addDropeffects();
          }
          e.preventDefault();
        }
        if (e.keyCode == 77 && hasModifier(e)) {
          if (selections.items.length) {
            addDropeffects();
            if (selections.owner == target1[target1.length - 1]) {
              target1[0].focus();
            } else {
              for (var len = target1.length, i = 0; i < len; i++) {
                if (selections.owner == target1[i]) {
                  target1[i + 1].focus();
                  break;
                }
              }
            }
          }
          e.preventDefault();
        }
      }
      if (e.keyCode == 27) {
        if (selections.items.length) {
          clearDropeffects();
          selections.items[selections.items.length - 1].focus();
          clearSelections();
        }
      }
    }, false);
    var related = null;
    document.addEventListener('dragenter', function(e) {
      related = e.target;

    }, false);
    document.addEventListener('dragleave', function(e) {
      var droptarget = getContainer(related);
      if (droptarget == selections.owner) {
        droptarget = null;
      }
      if (droptarget != selections.droptarget) {
        if (selections.droptarget) {
          selections.droptarget.className =
            selections.droptarget.className.replace(/ dragover/g, '');
        }
        if (droptarget) {
          droptarget.className += ' dragover';
        }
        selections.droptarget = droptarget;
      }
    }, false);
    document.addEventListener('dragover', function(e) {
      if (selections.items.length) {
        e.preventDefault();
      }
    }, false);
    document.addEventListener('dragend', function(e) {
      if (selections.droptarget) {
        for (var len = selections.items.length, i = 0; i < len; i++) {
          selections.droptarget.appendChild(selections.items[i]);
        }
        e.preventDefault();
      }
      if (selections.items.length) {
        clearDropeffects();
        if (selections.droptarget) {
          clearSelections();
          selections.droptarget.className =
            selections.droptarget.className.replace(/ dragover/g, '');
          selections.droptarget = null;
        }
      }
    }, false);
  })();
