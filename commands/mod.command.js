import { hasModPermissions } from '../middleware/validate';

const kick = async (message) => {
    try {
        // Apply middleware to restrict access to moderators
        if (!await hasModPermissions(message)) {
        return; // Exit if user lacks permissions
        }
        // Extract command arguments
        const args = message.body.split(' ');
        const kickedUsername = args[1];
        // Get the chat and find the participant to be kicked
        const chat = await message.getChat();
        const participantToKick = chat.participants.find(
        (participant) => participant.name === kickedUsername
        );
        if (!participantToKick) {
        await message.reply('Participant not found in the group.');
        return;
        }

        // Inform the group about the action
        await message.reply(`${participantToKick.mention()} has been removed from the group. Thank you for keeping this group safe.`);

        // Asynchronously remove the participant to avoid blocking other operations
        chat.removeParticipant(participantToKick.id)
        .then(() => {
            console.log(`${kickedUsername} removed successfully.`);
        })
        .catch(async (error) => {
            console.error('Error removing participant:', error);
            await message.reply('Failed to remove participant. Please try again later.');
        });
    } catch (error) {
        console.error('Error handling kick command:', error);
        await message.reply('An error occurred while processing the kick command. Please try again later.');
    }
};



// Apply middleware to restrict access to the kick command
export default hasModPermissions(kick);
