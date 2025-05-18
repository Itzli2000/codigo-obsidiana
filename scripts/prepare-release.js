import shell from 'shelljs';
import chalk from 'chalk';

const RELEASE_TYPES = {
  '--patch': 'patch',
  '--minor': 'minor',
  '--major': 'major',
};

async function checkGitStatus() {
  const { stdout } = shell.exec('git status --porcelain', { silent: true });
  if (stdout) {
    shell.echo(chalk.red('🚨 Error: Working directory is not clean. Please commit or stash your changes first.'));
    shell.exit(1);
  }
}

async function validateReleaseType(releaseType) {
  if (!RELEASE_TYPES[releaseType]) {
    shell.echo(chalk.red(`🚨 Error: Invalid release type. Use one of: ${Object.keys(RELEASE_TYPES).join(', ')}`));
    shell.exit(1);
  }
}

async function validateIssueId(issueId) {
  if (!issueId) {
    shell.echo(chalk.red('🔠 Error: Please provide the issue id'));
    shell.echo(chalk.yellow('Example: yarn release:patch B-11111'));
    shell.exit(1);
  }
}

async function main() {
  try {
    // Check if git is installed
    if (!shell.which('git')) {
      shell.echo(chalk.red('🚨 Error: This script requires git to be installed'));
      shell.exit(1);
    }

    const releaseType = process.argv[2];
    const issueId = process.argv[3];

    // Validate inputs
    await validateReleaseType(releaseType);
    await validateIssueId(issueId);
    await checkGitStatus();

    shell.echo(chalk.blue('🖥️ Preparing release with:'));
    shell.echo(chalk.gray(`Release type: ${RELEASE_TYPES[releaseType]}`));
    shell.echo(chalk.gray(`Issue ID: ${issueId}`));

    // Create and checkout new branch
    const branchName = `build/${issueId}-prepare-${RELEASE_TYPES[releaseType]}-version`;
    shell.echo(chalk.blue(`\n📦 Creating branch: ${branchName}`));
    if (shell.exec(`git checkout -b ${branchName}`).code !== 0) {
      shell.echo(chalk.red('🚨 Error: Failed to create new branch'));
      shell.exit(1);
    }

    // Generate changelog
    shell.echo(chalk.blue('\n📖 Generating changelog...'));
    if (shell.exec(`yarn changelog ${releaseType} && git add CHANGELOG.md`).code !== 0) {
      shell.echo(chalk.red('🚨 Error: Failed to generate changelog'));
      shell.exit(1);
    }

    // Bump version
    shell.echo(chalk.blue('\n⬆️ Bumping package version...'));
    if (shell.exec(`yarn version ${RELEASE_TYPES[releaseType]} && git add package.json`).code !== 0) {
      shell.echo(chalk.red('🚨 Error: Failed to bump version'));
      shell.exit(1);
    }

    // Stage all changes
    shell.echo(chalk.blue('\n📦 Staging all changes...'));
    if (shell.exec('git add .').code !== 0) {
      shell.echo(chalk.red('🚨 Error: Failed to stage changes'));
      shell.exit(1);
    }

    // Commit changes
    shell.echo(chalk.blue('\n📝 Committing changes...'));
    const commitMessage = `chore: prepare ${RELEASE_TYPES[releaseType]} release for ${issueId}`;
    if (shell.exec(`git commit -m "${commitMessage}"`).code !== 0) {
      shell.echo(chalk.red('🚨 Error: Failed to commit changes'));
      shell.exit(1);
    }

    // Push branch
    shell.echo(chalk.blue('\n⬆️ Pushing branch...'));
    if (shell.exec(`git push -u origin ${branchName}`).code !== 0) {
      shell.echo(chalk.red('🚨 Error: Failed to push branch'));
      shell.exit(1);
    }

    shell.echo(chalk.green('\n✅ Release preparation completed successfully!'));
    shell.echo(chalk.yellow('\nNext steps:'));
    shell.echo(chalk.gray('1. Review the changes in the pushed branch'));
    shell.echo(chalk.gray('2. Create a pull request'));

  } catch (error) {
    shell.echo(chalk.red(`\n🚨 Unexpected error: ${error.message}`));
    shell.exit(1);
  }
}

main();