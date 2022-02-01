import * as fs from 'fs';
import * as core from '@actions/core';
import { handleAction } from '../src/lib';

describe('Basic Tests', () => {
  it('Appending Raw Value Works As Expected', () => {
    const outputs: Record<string, string> = {};
    const existingValueData = `## 0.0.0

- Initial version.
`;
    const valueInData = `## v0.0.1
### 🪚 Refactors
- major overhaul
### 🔍 Tests
- covers at 100%
### 🧹 Chores
- adds makefile

`;
    const inputs: Record<string, string> = {
      file_target: 'changelog.md',
      value_in: valueInData,
      is_file: 'false',
      'changelog.md': existingValueData,
    };

    const getInputSpy = jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });
    const getBooleanInputSpy = jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
      return inputs[name]?.toLowerCase() === 'true';
    });
    const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error) => {
      throw message instanceof Error ? message : new Error(message);
    });
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
      return inputs[path];
    });
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation((path: string, data: string) => {
      outputs[path] = data;
    });
    const appendFileSyncSpy = jest.spyOn(fs, 'appendFileSync').mockImplementation((path: string, data: string) => {
      outputs[path] += data;
    });
    const renameSync = jest.spyOn(fs, 'renameSync').mockImplementation((oldPath: string, newPath: string) => {
      outputs[newPath] = outputs[oldPath];
      delete outputs[oldPath];
    });

    try {
      expect(handleAction).not.toThrow();

      expect(getInputSpy).toBeCalledTimes(2);
      expect(getBooleanInputSpy).toBeCalledTimes(1);
      expect(readFileSyncSpy).toBeCalledTimes(1);
      expect(writeFileSyncSpy).toBeCalledTimes(1);
      expect(appendFileSyncSpy).toBeCalledTimes(1);
      expect(renameSync).toBeCalledTimes(1);
      expect(setFailedSpy).toBeCalledTimes(0);
      expect(outputs[inputs['file_target']]).toBeDefined();
      expect(outputs[inputs['file_target']]).toContain(valueInData);
      expect(outputs[inputs['file_target']]).toContain(existingValueData);
      expect(outputs[inputs['file_target']]).toContain(valueInData + existingValueData);
    } finally {
      [
        getInputSpy,
        getBooleanInputSpy,
        setFailedSpy,
        readFileSyncSpy,
        writeFileSyncSpy,
        appendFileSyncSpy,
        renameSync,
      ].forEach((s) => {
        s.mockRestore();
      });
    }
  });

  it('Appending File Value Works As Expected', () => {
    const outputs: Record<string, string> = {};
    const existingValueData = `## 0.0.0

- Initial version.
`;
    const valueInData = `## v0.0.1
### 🪚 Refactors
- major overhaul
### 🔍 Tests
- covers at 100%
### 🧹 Chores
- adds makefile

`;
    const inputs: Record<string, string> = {
      file_target: 'changelog.md',
      value_in: 'temp_changelog.md',
      is_file: 'true',
      'changelog.md': existingValueData,
      'temp_changelog.md': valueInData,
    };

    const getInputSpy = jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name];
    });
    const getBooleanInputSpy = jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
      return inputs[name]?.toLowerCase() === 'true';
    });
    const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error) => {
      throw message instanceof Error ? message : new Error(message);
    });
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
      return inputs[path];
    });
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation((path: string, data: string) => {
      outputs[path] = data;
    });
    const appendFileSyncSpy = jest.spyOn(fs, 'appendFileSync').mockImplementation((path: string, data: string) => {
      outputs[path] += data;
    });
    const renameSync = jest.spyOn(fs, 'renameSync').mockImplementation((oldPath: string, newPath: string) => {
      outputs[newPath] = outputs[oldPath];
      delete outputs[oldPath];
    });

    try {
      expect(handleAction).not.toThrow();

      expect(getInputSpy).toBeCalledTimes(2);
      expect(getBooleanInputSpy).toBeCalledTimes(1);
      expect(readFileSyncSpy).toBeCalledTimes(2);
      expect(writeFileSyncSpy).toBeCalledTimes(1);
      expect(appendFileSyncSpy).toBeCalledTimes(1);
      expect(renameSync).toBeCalledTimes(1);
      expect(setFailedSpy).toBeCalledTimes(0);
      expect(outputs[inputs['file_target']]).toBeDefined();
      expect(outputs[inputs['file_target']]).toContain(valueInData);
      expect(outputs[inputs['file_target']]).toContain(existingValueData);
      expect(outputs[inputs['file_target']]).toContain(valueInData + existingValueData);
      console.info(outputs[inputs['file_target']]);
    } finally {
      [
        getInputSpy,
        getBooleanInputSpy,
        setFailedSpy,
        readFileSyncSpy,
        writeFileSyncSpy,
        appendFileSyncSpy,
        renameSync,
      ].forEach((s) => {
        s.mockRestore();
      });
    }
  });
});
