const chromium = require('chrome-aws-lambda');
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;


exports.handler = async (event, context, callback) => {
    let screenshotBuffer = null;
    let browser = null;
    let width = parseInt(event.queryStringParameters.width);

    if (isNaN(width))
        width = DEFAULT_WIDTH;

    let height = parseInt(event.queryStringParameters.height);

    if (isNaN(height))
        height = DEFAULT_HEIGHT;

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: { width, height },
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        let page = await browser.newPage();

        await page.goto(event.queryStringParameters.url);

        screenshotBuffer = await page.screenshot({encoding: 'base64'});
    } catch (error) {
        return {
            statusCode: 500,
            body: error
        };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/png'
        },
        isBase64Encoded: true,
        body: screenshotBuffer
    };
};
