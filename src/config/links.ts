/**
 * Centralized external link registry.
 *
 * All hardcoded URLs (GitLab, install scripts, Hive ecosystem) live here so we
 * can update or audit them in one place instead of grepping the codebase.
 */
export const LINKS = {
  GITLAB: "https://gitlab.syncad.com/hive/clive",
  GITLAB_README: "https://gitlab.syncad.com/hive/clive#readme",
  GITLAB_INSTALL: "https://gitlab.syncad.com/hive/clive#install",
  GITLAB_ISSUES: "https://gitlab.syncad.com/hive/clive/-/issues",
  GITLAB_RELEASES: "https://gitlab.syncad.com/hive/clive/-/releases",
  GITLAB_LICENSE: "https://gitlab.syncad.com/hive/clive/-/blob/master/LICENSE.md",
  INSTALL_SCRIPT: "https://gtg.openhive.network/get/clive/start_clive.sh",
  HIVE: "https://hive.io",
  HIVE_DOCS: "https://developers.hive.io/",
  BEEKEEPER: "https://gitlab.syncad.com/hive/beekeepy",
  WAX: "https://gitlab.syncad.com/hive/wax",
} as const;
