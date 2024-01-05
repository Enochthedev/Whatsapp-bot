const hasAdminPermissions = async (message) => {
    const senderAdmin = await message.getSenderAdmin();
    if (!senderAdmin) {
        await message.reply('Only admins can use this command.');
      return false; // Deny access if not admin
    }
    return true; // Allow access if admin
};

const hasModPermissions = async (message) => {
    const senderAdmin = await message.getSenderAdmin();
    if (!senderAdmin) {
        await message.reply('Only mods can use this command.');
      return false; // Deny access if not admin
    }
    return true; // Allow access if admin
};