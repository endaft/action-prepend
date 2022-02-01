import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

type PrependOptions = {
  fileTarget: string;
  valueIn: string;
  isFile: boolean;
  workspace: string;
};

function getOptions(): PrependOptions {
  return {
    fileTarget: core.getInput('file_target', { required: true }),
    isFile: core.getBooleanInput('is_file', { required: true }),
    valueIn: core.getInput('value_in', { required: true, trimWhitespace: false }),
    workspace: process.env.GITHUB_WORKSPACE,
  };
}

export function handleAction() {
  try {
    const opts = getOptions();
    const targetExt = path.extname(opts.fileTarget);
    const prependValue = opts.isFile ? fs.readFileSync(opts.valueIn, 'utf-8') : opts.valueIn;
    const tempFilePath = path.normalize(`./prepend-${Date.now()}.${targetExt}`);
    const finalFilePath = path.normalize(path.join(opts.workspace, opts.fileTarget));

    fs.writeFileSync(tempFilePath, prependValue, 'utf-8');
    fs.appendFileSync(tempFilePath, fs.readFileSync(opts.fileTarget, 'utf-8'));
    fs.renameSync(tempFilePath, finalFilePath);

    core.info(`Wrote prepended update to ${finalFilePath}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}
