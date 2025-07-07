const fs = require('fs');
const { loadProxies } = require('../Utils/proxyManager');
const { catchAsyncError } = require('../MiddleWares/catchAsyncError');
const { joinZoomMeeting } = require('../Helpers/JoinZoomMeeting');

exports.start = catchAsyncError(async function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    function sendLog(msg) {
        res.write(`data: ${msg}\n\n`);
    }

    const { meetingId, meetingPass } = req.body;
    const count = Number(req.body.count);
    const userAgent = process.env.USER_AGENT || "...";
    if (!meetingId || !meetingPass || !Number.isInteger(count) || count <= 0) {
        sendLog('Invalid request');
        return res.end();
    }

    try {
        const proxies = await loadProxies('proxies.txt');
        let names = fs.readFileSync('name.txt', 'utf-8')
            .split('\n')
            .map(name => name.trim())
            .filter(Boolean)
            .slice(0, count);

        // Sequential for live logs
        // for (let i = 0; i < names.length; i++) {
        //     const name = names[i];
        //     const proxy = proxies[i % proxies.length] || '';
        //     await joinZoomMeeting(name, proxy, meetingId, meetingPass, userAgent, sendLog);
        // }
        // await Promise.all(names.map((name, i) => {
        //     const proxy = proxies[i % proxies.length] || '';
        //     console.log("Calling joinZoomMeeting for", name, "with proxy", proxy);
        //     return joinZoomMeeting(name, '', meetingId, meetingPass, userAgent); // try with '' for proxy
        // }));

        await Promise.all(
            names.map((name, i) => {
                const proxy = proxies[i % proxies.length] || '';
                return new Promise(resolve => {
                    setTimeout(async () => {
                        console.log("Calling joinZoomMeeting for", name, "with proxy", proxy);
                        await joinZoomMeeting(name, proxy, meetingId, meetingPass, userAgent, sendLog);
                        resolve();
                    }, i * 5000); // 5 seconds delay between each start
                });
            })
        );

        sendLog('DONE');
        res.end();
    } catch (err) {
        sendLog(`ERROR: ${err.message}`);
        res.end();
    }
});

// exports.start = catchAsyncError(async function (req, res, next) {
//     console.log("Controller called", req.body);
//     const { meetingId, meetingPass } = req.body;
//     const count = Number(req.body.count);
//     const userAgent = process.env.USER_AGENT || "...";
//     if (!meetingId || !meetingPass || !Number.isInteger(count) || count <= 0) {
//         return res.status(400).json({ success: false, message: 'meetingId, meetingPass, and a positive integer count are required in the request body.' });
//     }

//     try {
//         const proxies = await loadProxies('proxies.txt');
//         let names = fs.readFileSync('name.txt', 'utf-8')
//             .split('\n')
//             .map(name => name.trim())
//             .filter(Boolean)
//             .slice(0, count);

//         await Promise.all(
//             names.map((name, i) => {
//                 const proxy = proxies[i % proxies.length] || '';
//                 return new Promise(resolve => {
//                     setTimeout(async () => {
//                         console.log("Calling joinZoomMeeting for", name, "with proxy", proxy);
//                         await joinZoomMeeting(name, proxy, meetingId, meetingPass, userAgent, sendLog);
//                         resolve();
//                     }, i * 5000); // 5 seconds delay between each start
//                 });
//             })
//         );

//         res.status(200).json({ success: true, message: "User Joined Successfully" });
//     } catch (err) {
//         console.error("Error in controller:", err);
//         res.status(500).send(`Error starting bot: ${err.message}`);
//     }
// });