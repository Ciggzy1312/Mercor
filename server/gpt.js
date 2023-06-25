const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(config);

const gpt = async (req, res) => {

    const question = req.body.question;

    if (!question) return res.status(200).json({ error: "Question is required." })

    const prompt = question;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        temperature: 1,
    });

    const answer = response.data.choices[0].text;

    res.status(200).json({ question, answer });
};

module.exports = gpt;