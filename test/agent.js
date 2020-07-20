const cloneDeep = require("lodash.clonedeep");
const sendEvent = require("../agent.js").sendEvent;
const constructBody = require("../agent.js").constructBody;
const extractBody = require("../agent.js").extractBody;
const assert = require("assert").strict;

const fetch = () => {
  const out = {
    id: 1107,
    stage: "test-stage-A",
    status: "test-status-B",
    team_id: "team-id-123",
    pipeline_id: "pipeline-id-hijk",
    change_id: "change-id-abc123",
    custom: { g: 4, s: [1, 2, 3] },
    timestamp: "2020-07-17T19:24:29.100Z",
  };
  return new Promise((success) => success(JSON.stringify(out)));
};

const test_extract_body = (function test_extract_body() {
  const github_context = {
    context: {
      payload: {
        action: "closed",
        pull_request: {
          base: {
            ref: "master",
          },
          head: {
            ref: "branch1",
          },
        },
      },
      eventName: "pull_request",
      ref: "master",
    },
  };

  const actual = extractBody("team-id-123", github_context);
  const expected = {
    stage: "Change",
    status: "Succeeded",
    change_id: "branch1",
    team_id: "team-id-123",
    custom: {
      context: {
        payload: {
          action: "closed",
          pull_request: { base: { ref: "master" }, head: { ref: "branch1" } },
        },
        eventName: "pull_request",
        ref: "master",
      },
    },
  };
  assert.deepStrictEqual(actual, expected);
  console.log("[ OK ]", arguments.callee.name);
})();

// When user supplies no input, GitHub supplies empty/null/undef values for various
// params. These empty params need to be detected and then the GitHub object
// values used instead to infer the event info.
const test_construct_body_pr_closed = (function test_construct_body_pr_closed() {
  const github_pull_request_closed = {
    context: {
      payload: {
        action: "closed",
        pull_request: {
          base: {
            ref: "master",
          },
          head: {
            ref: "branch1",
          },
        },
      },
      eventName: "pull_request",
      ref: "master",
    },
  };

  const actual = constructBody(
    "",
    "",
    github_pull_request_closed,
    "",
    null,
    undefined,
    "team-id-test1"
  );

  const expected = {
    stage: "Change",
    status: "Succeeded",
    change_id: "branch1",
    team_id: "team-id-test1",
    custom: {
      context: {
        payload: {
          action: "closed",
          pull_request: {
            base: {
              ref: "master",
            },
            head: {
              ref: "branch1",
            },
          },
        },
        eventName: "pull_request",
        ref: "master",
      },
    },
  };

  assert.deepStrictEqual(actual, expected);
  console.log("[ OK ]", arguments.callee.name);
})();

// when the user supplies no input, resulting in empty params
const test_construct_body_pr_opened = (function test_construct_body_pr_opened() {
  const github_pull_request_opened = {
    context: {
      payload: {
        action: "opened",
        pull_request: {
          base: {
            ref: "master",
          },
          head: {
            ref: "branch1",
          },
        },
      },
      eventName: "pull_request",
      ref: "master",
    },
  };

  const actual = constructBody(
    "",
    null,
    github_pull_request_opened,
    undefined,
    "",
    "",
    "team-id-test1"
  );

  const expected = {
    stage: "Change",
    status: "Initiated",
    change_id: "branch1",
    team_id: "team-id-test1",
    custom: {
      context: {
        payload: {
          action: "opened",
          pull_request: {
            base: {
              ref: "master",
            },
            head: {
              ref: "branch1",
            },
          },
        },
        eventName: "pull_request",
        ref: "master",
      },
    },
  };
  assert.deepStrictEqual(actual, expected);
  console.log("[ OK ]", arguments.callee.name);
})();

// Even when given the PR opened metadata from GitHub,
// the user supplied data should overwrite it.
const test_construct_body_user_action = (function test_construct_body_user_action() {
  const github_pull_request_opened = {
    context: {
      payload: {
        action: "opened",
        pull_request: {
          base: {
            ref: "master",
          },
          head: {
            ref: "branch1",
          },
        },
      },
      eventName: "pull_request",
      ref: "master",
    },
  };

  const actual = constructBody(
    "change-id-abc123",
    '{"s":[1,2,3],"g":4}',
    github_pull_request_opened,
    "pipeline-id-hijk",
    "test-stage-A",
    "test-status-B",
    "team-id-123"
  );

  expected = {
    change_id: "change-id-abc123",
    custom: '{"s":[1,2,3],"g":4}',
    pipeline_id: "pipeline-id-hijk",
    stage: "test-stage-A",
    status: "test-status-B",
    team_id: "team-id-123",
  };

  assert.deepStrictEqual(actual, expected);
  console.log("[ OK ]", arguments.callee.name);
})();
