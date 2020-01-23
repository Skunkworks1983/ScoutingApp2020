// const totalMatches = JSON.parse(localStorage.getItem('schedule')).length;

const scouts = [
  "Ian",
  "Joel",
  "Lucero",
  "Dillon",
  "Anthony",
  "Benji",
  "Bennett",
  "Caleb",
  "Cyrus",
  "Brien David",
  "Diana",
  "Jimmy",
  "Kai",
  "Kevin N.",
  "Kevin T.",
  "Kyle",
  "Nathan H.",
  "Nathan M.",
  "Perf",
  "Raphael",
  "Rhys",
  "Ryan",
  "Sam",
  "Tiffany",
  "Tri"
];

function populateScouts() {
  let scoutTable = $('#scouts');
  for (let i of scouts) {
    scoutTable.append(`<option value="${i}">${i}</option>`)
  }
}

function goToMatch() {
  let path = location.pathname.split('/');
  path.splice(path.length - 1, 1);
  setTimeout(() => location.href = `${location.protocol}${path.join('/')}/match.html`, 300);
}

function goToSettings() {
  let path = location.pathname.split('/');
  path.splice(path.length - 1, 1);
  setTimeout(() => location.href = `${location.protocol}${path.join('/')}/settings.html`, 300);
}

function populateInfo() {
  if (localStorage.key('scout') && localStorage.key('match')) {
    $('#matchNo').val(parseInt(localStorage.getItem('match')) + 1);
    $('#scouts').val(localStorage.getItem('scout'));
  }
}

function save() {
  let scoutTable = $('#scouts');
  if (scoutTable.val() !== 'test') {
    localStorage.setItem('scout', scoutTable.val());
    scoutTable.removeClass('is-invalid');
    scoutTable.addClass('is-valid');
    let matchNo = $('#matchNo');
    if (matchNo.val()) {
      localStorage.setItem('match', matchNo.val());
      goToMatch();
    } else {
      matchNo.addClass('is-invalid');
    }
  } else {
    scoutTable.addClass('is-invalid')
  }
}

$(document).ready(() => {
  populateScouts();
  populateInfo();
  $('#continue').click(() => {
    save();
  })

  $('#settingsNav').click(() => {
    goToSettings();
  })
})