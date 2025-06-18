const core = require('@actions/core');
const { WebClient } = require('@slack/web-api');
const axios = require('axios');

async function run() {
    try {
        const token = core.getInput('slack_token');
        const channel = core.getInput('channel_id');
        const imageTag = core.getInput('image_tag');

        const slack = new WebClient(token);

        const result = await slack.chat.postMessage({
            channel: channel,
            text: `📦 Docker image *${imageTag}* is ready for deployment. Please approve or reject.`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `📦 Docker image *${imageTag}* is ready for deployment.\nPlease choose an action:`
                    }
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: '✅ Approve'
                            },
                            style: 'primary',
                            value: 'approve',
                            action_id: 'approve'
                        },
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: '❌ Reject'
                            },
                            style: 'danger',
                            value: 'reject',
                            action_id: 'reject'
                        }
                    ]
                }
            ]
        });

        core.setOutput('ts', result.ts);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
