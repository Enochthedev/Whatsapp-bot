import { Command } from '../types';
import { getRandomItem } from '../../utils/chat.utils';

// 8ball command
export const eightBallCommand: Command = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question',
  category: 'basic',
  aliases: ['8b', 'eightball'],
  handler: async ({ message, args }) => {
    if (args.length === 0) {
      await message.reply('Please ask a question! Example: /8ball Will I pass my exam?');
      return;
    }

    const responses = [
      'It is certain',
      'Without a doubt',
      'You may rely on it',
      'Yes definitely',
      'It is decidedly so',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      "Don't count on it",
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful',
    ];

    const response = getRandomItem(responses);
    await message.reply(`🎱 *Magic 8-Ball says:*\n\n"${response}"`);
  },
};

// Flip command
export const flipCommand: Command = {
  name: 'flip',
  description: 'Flip a coin',
  category: 'basic',
  aliases: ['coin', 'coinflip'],
  handler: async ({ message }) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    await message.reply(`🪙 *Coin Flip Result:* ${result}`);
  },
};

// Roll command
export const rollCommand: Command = {
  name: 'roll',
  description: 'Roll a dice (1-6)',
  category: 'basic',
  aliases: ['dice'],
  handler: async ({ message, args }) => {
    let sides = 6;

    if (args.length > 0) {
      const parsed = parseInt(args[0]);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
        sides = parsed;
      }
    }

    const result = Math.floor(Math.random() * sides) + 1;
    await message.reply(`🎲 *Dice Roll (1-${sides}):* ${result}`);
  },
};

// Choose command
export const chooseCommand: Command = {
  name: 'choose',
  description: 'Make a random choice between options',
  category: 'basic',
  aliases: ['pick', 'select'],
  handler: async ({ message, args }) => {
    if (args.length < 2) {
      await message.reply(
        'Please provide at least 2 options!\nExample: /choose pizza burger tacos'
      );
      return;
    }

    const choice = getRandomItem(args);
    await message.reply(`🤔 *I choose:* ${choice}`);
  },
};

// Quote command
export const quoteCommand: Command = {
  name: 'quote',
  description: 'Get a random motivational quote',
  category: 'basic',
  handler: async ({ message }) => {
    const quotes = [
      {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
      },
      {
        text: "Code is like humor. When you have to explain it, it's bad.",
        author: 'Cory House',
      },
      {
        text: 'First, solve the problem. Then, write the code.',
        author: 'John Johnson',
      },
      {
        text: 'Experience is the name everyone gives to their mistakes.',
        author: 'Oscar Wilde',
      },
      {
        text: 'In order to be irreplaceable, one must always be different.',
        author: 'Coco Chanel',
      },
      {
        text: 'The best way to predict the future is to invent it.',
        author: 'Alan Kay',
      },
      {
        text: 'Simplicity is the soul of efficiency.',
        author: 'Austin Freeman',
      },
      {
        text: 'Make it work, make it right, make it fast.',
        author: 'Kent Beck',
      },
    ];

    const quote = getRandomItem(quotes);
    await message.reply(`💭 *Quote of the moment*\n\n"${quote.text}"\n\n— ${quote.author}`);
  },
};

// Joke command
export const jokeCommand: Command = {
  name: 'joke',
  description: 'Get a programming joke',
  category: 'basic',
  handler: async ({ message }) => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the programmer quit his job? Because he didn't get arrays!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
      "Why do Java developers wear glasses? Because they can't C#!",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
      "Why did the developer go broke? Because he used up all his cache!",
      "What's a programmer's favorite hangout place? Foo Bar!",
      "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
    ];

    const joke = getRandomItem(jokes);
    await message.reply(`😂 ${joke}`);
  },
};

// Fact command
export const factCommand: Command = {
  name: 'fact',
  description: 'Get a random tech fact',
  category: 'basic',
  handler: async ({ message }) => {
    const facts = [
      'The first computer bug was an actual bug - a moth found in a computer in 1947.',
      'The first computer virus was created in 1983 and was called Elk Cloner.',
      "The 'QWERTY' keyboard layout was designed to slow down typists to prevent typewriter jams.",
      'The first domain name ever registered was symbolics.com on March 15, 1985.',
      'JavaScript was created in just 10 days by Brendan Eich in 1995.',
      'The first 1GB hard drive weighed over 500 pounds and cost $40,000.',
      'Python was named after Monty Python, not the snake.',
      'The first computer mouse was made of wood in 1964.',
    ];

    const fact = getRandomItem(facts);
    await message.reply(`💡 *Tech Fact*\n\n${fact}`);
  },
};

// Countdown command
export const countdownCommand: Command = {
  name: 'countdown',
  description: 'Start a countdown',
  category: 'basic',
  handler: async ({ message, args }) => {
    let count = 3;

    if (args.length > 0) {
      const parsed = parseInt(args[0]);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
        count = parsed;
      }
    }

    const chat = await message.getChat();
    await chat.sendMessage(`Starting countdown from ${count}...`);

    for (let i = count; i > 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await chat.sendMessage(`${i}...`);
    }

    await chat.sendMessage('🎉 GO!');
  },
};

// Export all fun commands
export const funCommands: Command[] = [
  eightBallCommand,
  flipCommand,
  rollCommand,
  chooseCommand,
  quoteCommand,
  jokeCommand,
  factCommand,
  countdownCommand,
];
