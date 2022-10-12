const haveLiveMatches = true;

if (haveLiveMatches) {
  document.getElementById("live-matches").style.display = "block";
  document.getElementById("no-live-matches").style.display = "none";
} else {
  document.getElementById("live-matches").style.display = "none";
  document.getElementById("no-live-matches").style.display = "block";
}
