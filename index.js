const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const EVENTS_API_URL = "https://api.cto.sh/api/v1/events";

const cloneDeep = require('lodash.clonedeep');
const has = require('lodash.has');

const sendEvent = require('./agent.js').sendEvent;
const constructBody = require('./agent.js').constructBody;

/*
const fetchWrapped =  (params) => {
  return (fetch(...params)
    .then(res => res.json()));
};
*/

try {

  let team_id;
  let token;
  let change_id;
  let custom;
  let pipeline_id;
  let stage;
  let status;

  if (process.env.CTOAI_ACTION_ENVIRONMENT === "dev") {
    console.log('env: dev');
    team_id = "team-id-123";
    token = process.env.PIPELINE_DASHBOARD_EVENTS_API_TOKEN;
    change_id = "change-id-abc123";
    custom = "{\"s\":[1,2,3],\"g\":4}";
    pipeline_id = "pipeline-id-hijk";
    stage = "test-stage-A";
    status = "test-status-B";
  } else {

    console.log('env: prd');
    // mandatory params
    team_id = core.getInput('team_id');
    token = core.getInput('token');

    // optional params
    change_id = core.getInput('change_id');
    custom = core.getInput('custom');
    pipeline_id = core.getInput('pipeline_id');
    stage = core.getInput('stage');
    status = core.getInput('status');
  }

  const body = constructBody(
    change_id,
    cloneDeep(custom),
    cloneDeep(github),
    pipeline_id,
    stage,
    status,
    team_id
  );

  //sendEvent(body, token, EVENTS_API_URL, fetchWrapped)
  sendEvent(body, token, EVENTS_API_URL, fetch)
    .then(res => console.log(res))
    .then(json => console.log(json))
    .catch(err => console.error(err));

} catch (error) {
  core.setFailed(error.message);
}
