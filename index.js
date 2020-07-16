const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('fetch').fetchUrl;

try {
  const stage = core.getInput('stage');
  const status = core.getInput('status');
  const team_id = core.getInput('team_id');
  const custom = core.getInput('custom');
  const change_id = core.getInput('change_id');
  const pipeline_id = core.getInput('pipeline_id');
  console.log(stage,status,team_id,custom,change_id,pipeline_id);
  await fetch("http://www.example.com", function(e,m,b) {
    console.log("body.toString()");
  });

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}
