const { joinZoomMeeting } = require("../Helpers/JoinZoomMeeting");


(async () => {
  await joinZoomMeeting(
    'TestBot',
    '115.72.0.233', // leave proxy blank for now
    '87652104448',
    'nn94QC',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
  );
})();