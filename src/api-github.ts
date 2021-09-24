import * as github from '@actions/github';
import { ghIssueCommentData } from './types';

const debug: string | boolean = process.env.GITHUB_API_DEBUG || true;
const githubToken: string | undefined = process.env.GITHUB_TOKEN;
const octokit = githubToken && github.getOctokit(githubToken);

/**
 * Add comment to issue discussion (link to trello board)
 */
const addIssueComment = async ({
  comment,
  issueNumber,
  repoOwner,
  repoName,
}: ghIssueCommentData): Promise<boolean> => {
  if (!octokit) {
    console.error('Octokit is not defined. Maybe GITHUB_TOKEN is not present or valid.');
    return false;
  }
  if (debug) {
    console.debug('GH api / addIssueComment', {
      issueNumber: issueNumber,
      repoOwner: repoOwner,
      repoName: repoName,
    });
  }

  const commentData = {
    body: comment,
    issue_number: issueNumber,
    owner: repoOwner,
    repo: repoName,
  };
  const response = await octokit.rest.issues.createComment(commentData);
  if (!response) {
    console.error(`Octokit createComment() error with this issue. Data used:`, commentData);
    return false;
  }
  return true;
};

export { addIssueComment };
