import { hasModPermissions } from '../middleware/moderator.middleware';
const User = require('../database/model/user.model'); // Assuming User model is in a models directory

const report = async (message) => {
    try {
        // Apply middleware to restrict access to moderators
        if (!await hasModPermissions(message)) {
        return; // Exit if user lacks permissions
        }

        // Extract command arguments
        const args = message.body.split(' ');
        const reportedUsername = args[1];

        // Get the chat and find the participant to be reported
        const chat = await message.getChat();
        const participantToReport = chat.participants.find(
        (participant) => participant.name === reportedUsername
        );

        if (!participantToReport) {
        await message.reply('Participant not found in the group.');
        return;
        }

        // Fetch user document from database
        const user = await User.findOne({ phoneNumber: participantToReport.id });

        // Handle potential errors
        if (!user) {
        await message.reply('Failed to retrieve user information.');
        return;
        }

        // Update strikes and handle consequences
        user.numberOfStrikes++;
        await user.save();

        await message.reply(`${participantToReport.mention()} has received a strike.`);

        if (user.numberOfStrikes >= 3) {
        await message.reply(`${participantToReport.mention()} has been removed from the group due to reaching 3 strikes.`);
        await chat.removeParticipant(participantToReport.id);
        }
    } catch (error) {
        console.error('Error handling report command:', error);
        await message.reply('An error occurred while processing the report command. Please try again later.');
    }
};

// Apply middleware to restrict access to the report command
export default hasModPermissions(report);




module.exports = {
    report
}