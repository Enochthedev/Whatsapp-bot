// command.test.bot.js

const command = require('./command/command.js');
const mockMessage = {
    reply: jest.fn()
};
const mockArgs = ['arg1', 'arg2'];

describe('Bot Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should execute the command', () => {
        command.execute(mockMessage, mockArgs);
        expect(mockMessage.reply).toHaveBeenCalled();
    });
});