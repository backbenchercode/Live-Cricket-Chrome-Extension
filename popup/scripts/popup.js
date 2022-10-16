const haveLiveMatches = true;

if (haveLiveMatches) {
  document.getElementById("live-matches").style.display = "block";
  document.getElementById("no-live-matches").style.display = "none";
} else {
  document.getElementById("live-matches").style.display = "none";
  document.getElementById("no-live-matches").style.display = "block";
}

const fetchLiveMatches = async () => {
  const response = await fetch(
    "https://www.espncricinfo.com/live-cricket-score"
  );
  const html = await response.text();
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const nextData = document.querySelector("#__NEXT_DATA__");
  $("#espnDOM").append(nextData);
};

const extractLiveMatches = () => {
  const allMatches = JSON.parse(
    document.getElementById("__NEXT_DATA__").textContent
  )?.props?.editionDetails?.trendingMatches?.matches;

  console.log(allMatches);

  const allLiveMatches = allMatches.filter(
    (match) => match.status === "RESULT" && match.coverage === "Y"
  );

  const allLiveMatchesTransformed = allLiveMatches.map((match) => {
    const fixture = `${match.title}, ${match.ground.smallName}, ${new Date(
      match.startTime
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${match.series.longName}`;

    const team1FlagURL = `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci${match.teams[0].team.image.url}`;

    const team1Name = `${match.teams[0].team.name}`;

    const team2FlagURL = `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci${match.teams[1].team.image.url}`;

    const team2Name = `${match.teams[1].team.name}`;

    return {
      fixture,
      team1FlagURL,
      team1Name,
      team2FlagURL,
      team2Name,
    };
  });

  console.log(allLiveMatchesTransformed);

  return allLiveMatchesTransformed;
};

const renderPopupHTML = (liveMatches) => {
  $("#loading").hide();
  if (liveMatches?.length > 0) {
    $("#live-matches").show();
    $("#no-live-matches").hide();
    liveMatches.forEach((match) => {
      $("#live-matches").append(`
      <div class="match-box">
        <div class="live-text">Live</div>
        <div class="match-meta">
          ${match.fixture}
        </div>
        <div class="team-info">
          <div class="team-name">
            <div class="team-flag">
              <img src="${match.team1FlagURL}" />
            </div>
            <div class="country">${match.team1Name}</div>
          </div>
          <div class="team-score">
            <div class="runs">208/5</div>
          </div>
        </div>
        <div class="team-info">
          <div class="team-name">
            <div class="team-flag">
              <img src="${match.team2FlagURL}" alt="Country flag" />
            </div>
            <div class="country">${match.team2Name}</div>
          </div>
          <div class="team-score">
            <div class="overs">(13.3/20 ov, T: 209)</div>
            <div class="runs">208/5</div>
          </div>
        </div>
        <div class="match-progress">
          <div class="progress-text">
            Bangladesh need 90 runs in 36 balls.
          </div>
          <div class="follow-button">
            <button class="button">Follow</button>
          </div>
        </div>
      </div>
      `);
    });
  } else {
    $("#live-matches").hide();
    $("#no-live-matches").show();
  }
};

const loadLiveMatches = async () => {
  await fetchLiveMatches();
  const liveMatches = extractLiveMatches();
  renderPopupHTML(liveMatches);
};

loadLiveMatches();
