const puppeteer = require('puppeteer');

// exports.joinZoomMeeting = async function (name, proxy, meetingId, meetingPass, userAgent) {
//     console.log(`[${name}] Starting joinZoomMeeting...`);
//     // Prepare Puppeteer launch options
//     const args = [
//         '--use-fake-ui-for-media-stream', // Automatically allow mic/camera
//         '--use-fake-device-for-media-stream', // Use fake media device
//         '--allow-file-access-from-files',
//         '--allow-file-access',
//         '--allow-insecure-localhost',
//         '--no-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-extensions',
//         '--ignore-certificate-errors',
//         '--allow-running-insecure-content',
//         '--start-maximized',
//         '--disable-notifications'
//     ];
//     if (proxy) {
//         const proxyArg = proxy.startsWith('http') ? proxy : `http://${proxy}`;
//         args.push(`--proxy-server=${proxyArg}`);
//         console.log(`[${name}] Using proxy: ${proxyArg}`);
//     }

//     let browser;
//     try {
//         // console.log(`[${name}] About to launch Chrome (Puppeteer)`);
//         browser = await puppeteer.launch({
//             headless: false, // Show browser window
//             args: args,
//             defaultViewport: null
//         });
//         // console.log(`[${name}] Chrome launched`);

//         const pages = await browser.pages();
//         const page = pages[0];

//         await page.setUserAgent(userAgent);

//         await page.goto(`https://zoom.us/wc/join/${meetingId}`, { waitUntil: 'networkidle2' });
//         // console.log(`[${name}] Navigated to Zoom join page`);

//         await page.waitForSelector('#input-for-name', { timeout: 20000 });
//         // console.log(`[${name}] Found name input`);
//         await page.type('#input-for-name', name);
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // try {
//         //     await page.click('#onetrust-accept-btn-handler');
//         //     console.log(`[${name}] Clicked cookie consent`);
//         // } catch { console.log(`[${name}] No cookie consent button`); }
//         // try {
//         //     await page.click('#wc_agree1');
//         //     console.log(`[${name}] Clicked agree`);
//         // } catch { console.log(`[${name}] No agree button`); }

//         await page.waitForSelector('#input-for-pwd', { timeout: 20000 });
//         // console.log(`[${name}] Found password input`);
//         await page.type('#input-for-pwd', meetingPass);
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Ensure mic is muted
//         let audioMuted = false;
//         for (let i = 0; i < 5; i++) {
//             await page.waitForSelector('#preview-audio-control-button', { timeout: 30000 });
//             const audioBtn = await page.$('#preview-audio-control-button');
//             const audioLabel = await page.evaluate(el => el.getAttribute('aria-label'), audioBtn);
//             console.log(`[${name}] Audio aria-label (attempt ${i + 1}):`, audioLabel);

//             // Accept both "Unmute" and "Mute my microphone" as muted
//             if (
//                 audioLabel &&
//                 (
//                     audioLabel.toLowerCase().includes('unmute') ||
//                     audioLabel.toLowerCase().includes('mute my microphone')
//                 )
//             ) {
//                 console.log(`[${name}] Audio is muted`);
//                 audioMuted = true;
//                 break;
//             } else {
//                 await audioBtn.click();
//                 console.log(`[${name}] Muted audio (clicked)`);
//                 await new Promise(resolve => setTimeout(resolve, 1000)); // Give UI time to update
//             }
//         }
//         if (!audioMuted) {
//             throw new Error(`[${name}] Could not mute audio after several attempts`);
//         }

//         // Ensure video is off
//         let videoOff = false;
//         for (let i = 0; i < 5; i++) { // Try up to 5 times
//             await page.waitForSelector('#preview-video-control-button', { timeout: 30000 });
//             const videoBtn = await page.$('#preview-video-control-button');
//             const videoLabel = await page.evaluate(el => el.getAttribute('aria-label'), videoBtn);
//             console.log(`[${name}] Video aria-label:`, videoLabel);

//             if (videoLabel && videoLabel.toLowerCase().includes('start video')) {
//                 console.log(`[${name}] Video is off`);
//                 videoOff = true;
//                 break;
//             } else {
//                 await videoBtn.click();
//                 console.log(`[${name}] Turned off video`);
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//             }
//         }
//         if (!videoOff) {
//             throw new Error(`[${name}] Could not turn off video after several attempts`);
//         }

//         // await page.waitForSelector('#preview-audio-control-button', { timeout: 30000 });
//         // const audioBtn = await page.$('#preview-audio-control-button');
//         // const audioLabel = await page.evaluate(el => el.getAttribute('aria-label'), audioBtn);
//         // console.log(`[${name}] Audio aria-label:`, audioLabel);

//         // if (audioLabel && audioLabel.toLowerCase().includes('unmute')) {
//         //     console.log(`[${name}] Audio already muted`);
//         // } else {
//         //     await audioBtn.click();
//         //     console.log(`[${name}] Muted audio`);
//         // }
//         // await new Promise(resolve => setTimeout(resolve, 1000));

//         // await page.waitForSelector('#preview-video-control-button', { timeout: 30000 });
//         // const videoBtn = await page.$('#preview-video-control-button');
//         // const videoLabel = await page.evaluate(el => el.getAttribute('aria-label'), videoBtn);
//         // console.log(`[${name}] Video aria-label:`, videoLabel);

//         // if (videoLabel && videoLabel.toLowerCase().includes('stop video')) {
//         //     await videoBtn.click();
//         //     console.log(`[${name}] Stopped video`);
//         // } else {
//         //     console.log(`[${name}] Video already stopped`);
//         // }
//         // await new Promise(resolve => setTimeout(resolve, 1000));

//         // Now join the meeting
//         await page.waitForSelector('.preview-join-button', { timeout: 20000 });
//         await page.click('.preview-join-button');
//         console.log(`${name} Join Done`);
//         // Optionally: await page.waitForTimeout(5000);
//     } catch (err) {
//         console.error(`${name} failed to join:`, err.message);
//     } finally {
//         // Uncomment the next line if you want the browser to close automatically
//         // if (browser) await browser.close();
//     }
// };

exports.joinZoomMeeting = async function (name, proxy, meetingId, meetingPass, userAgent, log = console.log) {
    console.log(`[${name}] Starting joinZoomMeeting...`);
    // Prepare Puppeteer launch options
    const args = [
        '--use-fake-ui-for-media-stream', // Automatically allow mic/camera
        '--use-fake-device-for-media-stream', // Use fake media device
        '--allow-file-access-from-files',
        '--allow-file-access',
        '--allow-insecure-localhost',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--ignore-certificate-errors',
        '--allow-running-insecure-content',
        '--start-maximized',
        '--disable-notifications',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
    ];
    if (proxy) {
        const proxyArg = proxy.startsWith('http') ? proxy : `http://${proxy}`;
        args.push(`--proxy-server=${proxyArg}`);
        console.log(`[${name}] Using proxy: ${proxyArg}`);
    }

    let browser;
    try {
        // console.log(`[${name}] About to launch Chrome (Puppeteer)`);
        browser = await puppeteer.launch({
            headless: true, // Show browser window
            executablePath: '/usr/bin/chromium', // Add this line for Docker
            args: args,
            defaultViewport: null
        });
        // console.log(`[${name}] Chrome launched`);

        const pages = await browser.pages();
        const page = pages[0];

        await page.setUserAgent(userAgent);

        await page.goto(`https://zoom.us/wc/join/${meetingId}`, { waitUntil: 'networkidle2' });
        // console.log(`[${name}] Navigated to Zoom join page`);

        await page.waitForSelector('#input-for-name', { timeout: 20000 });
        // console.log(`[${name}] Found name input`);
        await page.type('#input-for-name', name);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // try {
        //     await page.click('#onetrust-accept-btn-handler');
        //     console.log(`[${name}] Clicked cookie consent`);
        // } catch { console.log(`[${name}] No cookie consent button`); }
        // try {
        //     await page.click('#wc_agree1');
        //     console.log(`[${name}] Clicked agree`);
        // } catch { console.log(`[${name}] No agree button`); }

        await page.waitForSelector('#input-for-pwd', { timeout: 20000 });
        // console.log(`[${name}] Found password input`);
        await page.type('#input-for-pwd', meetingPass);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Ensure mic is muted
        let audioMuted = false;
        for (let i = 0; i < 5; i++) {
            await page.waitForSelector('#preview-audio-control-button', { timeout: 30000 });
            const audioBtn = await page.$('#preview-audio-control-button');
            const audioLabel = await page.evaluate(el => el.getAttribute('aria-label'), audioBtn);
            // console.log(`[${name}] Audio aria-label (attempt ${i + 1}):`, audioLabel);

            // Accept both "Unmute" and "Mute my microphone" as muted
            if (
                audioLabel &&
                (
                    audioLabel.toLowerCase().includes('unmute') ||
                    audioLabel.toLowerCase().includes('mute my microphone')
                )
            ) {
                // console.log(`[${name}] Audio is muted`);
                audioMuted = true;
                break;
            } else {
                await audioBtn.click();
                // console.log(`[${name}] Muted audio (clicked)`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Give UI time to update
            }
        }
        if (!audioMuted) {
            throw new Error(`[${name}] Could not mute audio after several attempts`);
        }

        // Ensure video is off
        let videoOff = false;
        for (let i = 0; i < 5; i++) { // Try up to 5 times
            await page.waitForSelector('#preview-video-control-button', { timeout: 30000 });
            const videoBtn = await page.$('#preview-video-control-button');
            const videoLabel = await page.evaluate(el => el.getAttribute('aria-label'), videoBtn);
            // console.log(`[${name}] Video aria-label:`, videoLabel);

            if (videoLabel && videoLabel.toLowerCase().includes('start video')) {
                // console.log(`[${name}] Video is off`);
                videoOff = true;
                break;
            } else {
                await videoBtn.click();
                // console.log(`[${name}] Turned off video`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        if (!videoOff) {
            throw new Error(`[${name}] Could not turn off video after several attempts`);
        }

        // await page.waitForSelector('#preview-audio-control-button', { timeout: 30000 });
        // const audioBtn = await page.$('#preview-audio-control-button');
        // const audioLabel = await page.evaluate(el => el.getAttribute('aria-label'), audioBtn);
        // console.log(`[${name}] Audio aria-label:`, audioLabel);

        // if (audioLabel && audioLabel.toLowerCase().includes('unmute')) {
        //     console.log(`[${name}] Audio already muted`);
        // } else {
        //     await audioBtn.click();
        //     console.log(`[${name}] Muted audio`);
        // }
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // await page.waitForSelector('#preview-video-control-button', { timeout: 30000 });
        // const videoBtn = await page.$('#preview-video-control-button');
        // const videoLabel = await page.evaluate(el => el.getAttribute('aria-label'), videoBtn);
        // console.log(`[${name}] Video aria-label:`, videoLabel);

        // if (videoLabel && videoLabel.toLowerCase().includes('stop video')) {
        //     await videoBtn.click();
        //     console.log(`[${name}] Stopped video`);
        // } else {
        //     console.log(`[${name}] Video already stopped`);
        // }
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Now join the meeting
        await page.waitForSelector('.preview-join-button', { timeout: 20000 });
        await page.click('.preview-join-button');
        log(`${name} Join Done`);
        // Optionally: await page.waitForTimeout(5000);
    } catch (err) {
        log(`${name} failed to join: ${err.message}`);
    } finally {
        // Uncomment the next line if you want the browser to close automatically
        // if (browser) await browser.close();
    }
};