
const cron = require('node-cron');

//using cron to schedule a task to run 8:00 AM every day
//using whatsapp-web.js to send a message to a specific group

const timeZone = process.env.TIMEZONE;
const groupID = process.env.GROUP_ID;
const message = process.env.MESSAGE;

const morningCommit = cron.schedule('0 8 * * *', () => {
    console.log('running a task every day at 8:00 AM');
    
    //send message to group
}, {
    scheduled: true,
    timezone: timeZone
});
