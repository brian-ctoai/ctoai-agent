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
  const gh_event = core.getInput('gh_event');
  const gh_steps = core.getInput('gh_steps');
  const gh_runner = core.getInput('gh_runner');

  console.log('gh_event',gh_event );
  console.log('gh_steps',gh_steps );
  console.log('gh_runner',gh_runner );

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

  console.log('------ event payload ----------------------------------------------------------');
  console.log(JSON.stringify(github, undefined, 2));
  console.log('------ github.context.payload -------------------------------------------------');
  console.log(JSON.stringify(github.context.payload, undefined, 2));

} catch (error) {
  core.setFailed(error.message);
}
