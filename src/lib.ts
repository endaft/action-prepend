import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

type PrependOptions = {
  fileTarget: string;
  valueIn: string;
  isFile: boolean;
  delimiter?: string;
};

function getOptions(): PrependOptions {
  return {
    fileTarget: core.getInput('file_target', { required: true }),
    isFile: core.getBooleanInput('is_file', { required: true }),
    valueIn: core.getInput('value_in', { required: true }),
    delimiter: core.getInput('delimiter', { required: false }),
  };
}

export function handleAction() {
  try {
    const opts = getOptions();
    const targetExt = path.extname(opts.fileTarget);
    const prependValue = opts.isFile ? fs.readFileSync(opts.valueIn, 'utf-8') : opts.valueIn;
    const tempFilePath = path.normalize(`./prepend-${Date.now()}.${targetExt}`);
    const finalFilePath = path.normalize(path.join(__dirname, opts.fileTarget));
    const delimiter = opts.delimiter ?? '';

    fs.writeFileSync(tempFilePath, prependValue + delimiter, 'utf-8');
    fs.appendFileSync(tempFilePath, fs.readFileSync(opts.fileTarget, 'utf-8'));
    fs.renameSync(tempFilePath, opts.fileTarget);

    core.info(`Wrote prepended update to ${finalFilePath}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}
