const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

try {

  const stage = core.getInput('stage');
  const status = core.getInput('status');
  const team_id = core.getInput('team_id');
  const custom = core.getInput('custom');
  const change_id = core.getInput('change_id');
  const pipeline_id = core.getInput('pipeline_id');
  const token = core.getInput('token');
  const github_event = core.getInput('github_event');
  const github_steps = core.getInput('github_steps');
  const github_runner = core.getInput('github_runner');

  console.log('github_event',github_event );
  console.log('github_steps',github_steps );
  console.log('github_runner',github_runner );

  const body = {
    change_id,
    custom,
    pipeline_id,
    stage,
    status,
    team_id
  };
  const opts = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  fetch("https://api.cto.sh/api/v1/events", opts)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));

  // Get the JSON webhook payload for the event that triggered the workflow
  const event_payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log('------ event payload -------------------------------------------------');
  console.log(`${event_payload}`);

} catch (error) {
  core.setFailed(error.message);
}
