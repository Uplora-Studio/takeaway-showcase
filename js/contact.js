"use strict";
(function () {
  var form = document.querySelector('#contact > form');
  var button = document.getElementById('ctc');
  if (!form || !button) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var message = document.getElementById('message');
    var valid = typeof ctcValidation === 'function' ? ctcValidation() : true;

    if (!valid) return;

    form.reset();
    button.value = 'Demo message received';
    button.style.backgroundColor = '#2f8f46';

    var note = form.querySelector('.demo-success');
    if (!note) {
      note = document.createElement('p');
      note.className = 'form-note demo-success';
      form.insertBefore(note, form.firstChild.nextSibling);
    }
    note.textContent = 'This GitHub Pages version is a showcase only. To receive real enquiries, connect Formspree, Netlify Forms, or your own backend.';
  });
})();
