/** TODO
 * - [x] Get current active tab
 * - [x] Check if youtube tab
 * - [x] get the id of video
 * - [x] call  youtube api for getting lenght of video
 * - [x] get with select the like button
 * - [ ] start a `timer` if the timer get 70 % of video like the video
 *
 */

chrome.tabs.onActivated.addListener(main);

async function main(tab) {
  const tabInformation = await getTabsInformation(tab.tabId);

  // Check if the current tab is a youtube video
  if (!isYoutubeVideo(tabInformation.url)) {
    console.log("Not a youtube video");
    return;
  }

  const videoId = getVideoId(tabInformation.url);
  const videoInformations = await getVideoInformations(videoId);
  console.log(
    "Video duration",
    videoInformations.items[0].contentDetails.duration
  );
  const videoDurationSecond = getVideoDurationSecond(
    videoInformations.items[0].contentDetails.duration
  );

  // Get button element
  const button = getLikeButtonElement();
  if (!button) {
    console.log("Like button not detected");
    return;
  }

  return;
}

async function getTabsInformation(tabId) {
  return await chrome.tabs.get(tabId);
}
// https://www.youtube.com/watch?v=tEAmVQT7ov8
function isYoutubeVideo(tabUrl) {
  if (tabUrl.includes("https://www.youtube.com/watch?v=")) {
    return true;
  }
  return false;
}

// https://regexr.com/3elkd
function getVideoId(tabUrl) {
  let regexExpression = "[^=]*$";
  let videoId = tabUrl.match(regexExpression);
  return videoId[0];
}

async function getVideoInformations(videoId) {
  const api_url = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=AIzaSyBZBbhkcP_2QrPMwD2z2jq--D_sTDzV3qs`;
  const rep = await fetch(api_url);
  const data = await rep.json();
  console.log(data);
  return data;
}

function getVideoDurationSecond(videoDurationIso8601PT) {
  console.log("iso", videoDurationIso8601PT);
  const secondes = convertISO8601ToSeconds(videoDurationIso8601PT);
  console.log("secondes", secondes);
  return secondes;
}

// https://stackoverflow.com/questions/19061360/how-to-convert-youtube-api-duration-iso-8601-duration-in-the-format-ptms-to
function convertISO8601ToSeconds(input) {
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0,
    minutes = 0,
    seconds = 0,
    totalseconds;

  if (reptms.test(input)) {
    var matches = reptms.exec(input);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = hours * 3600 + minutes * 60 + seconds;
  }

  return totalseconds;
}

function getLikeButtonElement() {
  const button = document.querySelector(
    "#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button"
  );
  if (!button) {
    return false;
  }
  return button;
}
