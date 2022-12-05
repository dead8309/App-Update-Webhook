const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const needle = require('needle');
const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET,
});

webhooks.onAny(({ name }) => {
  console.log(name, "event received");
  
});

webhooks.on('release', ({ payload }) => {
    if (payload.action != 'published')
        return
    
    console.log(payload.release.name);

     needle('post', process.env.WEBHOOK, {
	     content: "<@&1010119741744087051>",
        embeds: [
            {
                title: payload.release.name,
                url: payload.release.html_url,
                description: payload.release.body.split('\n').join('\n'),
                timestamp: payload.release.published_at,
		footer: {
                icon_url: payload.release.author.avatar_url,
                text: "Kizzy"
		},
                color: 6647281,
                fields: [
                    {
                        name: "Download link",
                        value: `[Apk file](${payload.release.assets[0].browser_download_url})`
                    }
                ]
            }
        ]
    }, { json: true })
    .catch(err => console.error(err))
    
})
require("http").createServer(createNodeMiddleware(webhooks)).listen(process.env.PORT)
