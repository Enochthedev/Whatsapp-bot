# Command Module

The command module is a separate module in the Coffee-bot-whatsapp project that handles all the commands and their functionalities. It is separated from the main bot file for better organization and maintainability of the codebase.

## Why Separate the Command Module?

Separating the command module from the bot file has several benefits:

1. **Modularity**: By separating the command module, you can easily add, remove, or modify commands without affecting the main bot logic. Each command can be implemented as a separate function or class, making it easier to manage and test.

2. **Code Organization**: Keeping the command-related code in a separate module helps to keep the bot file clean and focused on the core functionality of the bot. It improves code readability and makes it easier for other developers to understand and contribute to the project.

3. **Reusability**: With a separate command module, you can reuse the command logic across different projects or even share it with the community. It promotes code reuse and reduces duplication.

## Boilerplate

To get started with the command module, you can use the following boilerplate code:
```
const command = async (message) => {
    try {
        // Command logic goes here
    } catch (error) {
        console.log(error);
    }
};
```
Then update the `module.exports` statement at the bottom of the file to export the command function:

