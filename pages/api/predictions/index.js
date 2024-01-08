export default async function handler(req, res) {
    console.log(req.body);
    console.log(process.env.REPLICATE_API_TOKEN);
    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            version:
                "8a89b0ab59a050244a751b6475d91041a8582ba33692ae6fab65e0c51b700328",

            input: req.body,
        }),
    });

    if (response.status !== 201) {
        let error = await response.json();
        console.log(error.detail);
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }

    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
}
