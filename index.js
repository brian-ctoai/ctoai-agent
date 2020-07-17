const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const cloneDeep = require('lodash.clonedeep');
const has = require('lodash.has');
const EVENTS_API_URL = "https://api.cto.sh/api/v1/events";

try {

  // Events passthrough except for the ones we want to map to Change Initiated
  // and Change Succeeded
  const extractBody = (team_id,github) => {

    // Treat PR opened against master as Change Initiated
    if (github.context.eventName === "pull_request" &&
        github.context.payload.pull_request.base.ref === "master" && 
        github.context.payload.action === "opened") {
      return ({
        stage: "Change",
        status: "Initiated",
        change_id: github.context.payload.pull_request.head.ref,
        team_id,
        custom: JSON.stringify(github)
      });
    }

    // Treat PR merged to master as Change Succeeded
    if (github.context.eventName === "pull_request" &&
        github.context.payload.pull_request.base.ref === "master" && 
        github.context.payload.action === "closed") {
      return ({
        stage: "Change",
        status: "Succeeded",
        change_id: github.context.payload.pull_request.head.ref,
        team_id,
        custom: JSON.stringify(github)
      });
    }

    // look through a bunch of options that can be used as change_id, if they exist
    let change_id = "";

    if (has(github, ["context","ref"])) {
      change_id = github.context.ref;
    }

    if (has(github, ["context","payload","pull_request","head","ref"])) {
      change_id = github.context.payload.pull_request.head.ref;
    }

    // Store data for events that haven't already matched
    return ({
      stage: github.context.eventName,
      status: github.context.payload.action,
      change_id,
      team_id,
      custom: JSON.stringify(github)
    });

  }

  const constructBody = (
    change_id,
    custom,
    pipeline_id,
    stage,
    status,
    team_id
  ) => {
    return ({
      change_id,
      custom,
      pipeline_id,
      stage,
      status,
      team_id
    });
  }

  const sendEvent = (body, token, url) => {

    const opts = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error(err));
  }

  const getBody = (
    change_id,
    custom,
    github,
    pipeline_id,
    stage,
    status,
    team_id
  ) => {
    if (change_id || custom || pipeline_id || stage || status) {
      return constructBody(
        change_id,
        deepClone(custom),
        pipeline_id,
        stage,
        status,
        team_id
      );
    } else {
      return extractBody(team_id, deepClone(github));
    }
  }

  // mandatory params
  const team_id = core.getInput('team_id');
  const token = core.getInput('token');

  // optional params
  const change_id = core.getInput('change_id');
  const custom = core.getInput('custom');
  const pipeline_id = core.getInput('pipeline_id');
  const stage = core.getInput('stage');
  const status = core.getInput('status');

  const body = getBody(
    change_id,
    custom,
    github,
    pipeline_id,
    stage,
    status,
    team_id
  );

  sendEvent(body, token, EVENTS_API_URL);

} catch (error) {
  core.setFailed(error.message);
}
