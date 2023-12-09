import { Probot } from "probot";
import { pullRequestHandler } from './handlers/pullRequestHandler'

export = (app: Probot) => {

  // register handlers here
  pullRequestHandler(app)

};
