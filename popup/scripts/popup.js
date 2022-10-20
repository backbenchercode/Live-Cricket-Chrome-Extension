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
    (match) => match.status === "Live" && match.coverage === "Y"
  );

  console.log(allLiveMatches);

  const allLiveMatchesTransformed = allLiveMatches.map((match) => {
    const fixture = `${match.title}, ${match.ground.smallName}, ${new Date(
      match.startTime
    ).toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${match.series.longName}`;

    const team1FlagURL = `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci${match.teams[0].team.image.url}`;

    const team1Name = `${match.teams[0].team.longName}`;

    const team2FlagURL = `https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci${match.teams[1].team.image.url}`;

    const team2Name = `${match.teams[1].team.longName}`;

    matchUrl = `https://www.espncricinfo.com/series/${match.series.slug}-${match.series.objectId}/${match.slug}-${match.objectId}/live-cricket-score`;

    matchId = match.objectId;

    return {
      fixture,
      team1FlagURL,
      team1Name,
      team2FlagURL,
      team2Name,
      matchUrl,
      matchId,
    };
  });

  console.log(allLiveMatchesTransformed);

  return allLiveMatchesTransformed;
};

const renderScores = async (matchId, matchUrl) => {
  if (!matchUrl) return;
  const response = await fetch(matchUrl);
  const html = await response.text();
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const nextData = document.querySelector("#main-container");
  $("#espnDOM").html(nextData);

  let scores = [];
  const scoreElements = $(
    "div.ds-text-compact-m.ds-text-typo-title.ds-text-right.ds-whitespace-nowrap"
  );
  scoreElements.each(function () {
    scores.push($(this).html());
  });

  $(`#id-${matchId} #team1-score`).html(scores[0]);
  $(`#id-${matchId} #team2-score`).html(scores[1]);

  const progressText = $(
    "p.ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title"
  ).html();
  $(`#id-${matchId} .progress-text`).html(progressText);
};

const renderPopupHTML = (liveMatches) => {
  $("#loading").hide();
  if (liveMatches?.length > 0) {
    $("#live-matches").show();
    $("#no-live-matches").hide();
    liveMatches.forEach((match) => {
      $("#live-matches").append(`
      <div class="match-box" id="id-${match.matchId}">
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
          <div class="team-score" id="team1-score">

          </div>
        </div>
        <div class="team-info">
          <div class="team-name">
            <div class="team-flag">
              <img src="${match.team2FlagURL}" alt="Country flag" />
            </div>
            <div class="country">${match.team2Name}</div>
          </div>
          <div class="team-score" id="team2-score">

          </div>
        </div>
        <div class="match-progress">
          <div class="progress-text" id="progress-text">
            
          </div>
          <div class="toggle-notification">
            <span>Notify Score Updates </span>
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      `);
      setInterval(() => {
        renderScores(match.matchId, match.matchUrl);
      }, 5000);
      renderScores(match.matchId, match.matchUrl);
    });
  } else {
    $("#live-matches").hide();
    $("#no-live-matches").show();
  }
};

const loadLiveMatches = async () => {
  const showallMatches = false;
  if (showallMatches) {
    await fetchLiveMatches();
    const liveMatches = extractLiveMatches();
    renderPopupHTML(liveMatches);
    await renderScores();
  } else {
    //renderMatchDetails();
    $("#live-matches").hide();
    $("#no-live-matches").hide();
  }
};

loadLiveMatches();
