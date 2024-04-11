document.getElementById('index').addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();

  console.log(e);
  console.log(window.location.href);
});
