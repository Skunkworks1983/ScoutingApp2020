// Keep readouts updated

$(document).ready(() => {
  for (let i of $('input[type="range"]')) {
    i.addEventListener('change', function () {
      document.getElementById(`${this.id}Readout`).innerHTML = this.value;
    });
  }
})