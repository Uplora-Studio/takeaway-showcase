"use strict";
(function () {
  var form = document.querySelector('#news form');
  var button = document.getElementById('subs');
  var email = document.getElementById('subs_email');
  var error = document.querySelector('.subs-error');
  if (!form || !button || !email || !error) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = typeof subsValidation === 'function' ? subsValidation() : true;
    if (!valid) {
      error.textContent = 'Please enter a valid email address.';
      return;
    }
    error.textContent = 'Thanks. This newsletter box is now in showcase mode only.';
    error.style.color = '#ffffff';
    form.reset();
  });
})();
