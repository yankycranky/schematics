import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

// tslint:disable:max-line-length
describe('OktaDev Schematics: ng-add', () => {
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, './../collection.json'),
  );

  const defaultOptions: any = {
    project: 'bar',
    issuer: 'https://dev-737523.okta.com/oauth2/default',
    clientId: '0oaifymbuodpH8nAi0h7'
  };

  let appTree: UnitTestTree;

  // tslint:disable-next-line:no-any
  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.5.0',
  };

  // tslint:disable-next-line:no-any
  const appOptions: any = {
    name: 'authtest',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
  };

  beforeEach(() => {
    appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  });

  it('should create home component files', (done) => {
    const files = ['home.component.css', 'home.component.html', 'home.component.spec.ts', 'home.component.ts'];
    const homePath = '/projects/authtest/src/app/home/';
    schematicRunner.runSchematicAsync('ng-add', defaultOptions, appTree).toPromise().then(tree => {
      files.forEach(f => {
        const path = `${homePath}${f}`;
        expect(tree.exists(path)).toEqual(true);
      });
      done();
    }, done.fail);
  });

  it('should set the issuer & clientId in the app module file', (done) => {
    schematicRunner.runSchematicAsync('ng-add', defaultOptions, appTree).toPromise().then(tree => {
      const appModule = tree.readContent('/projects/authtest/src/app/app.module.ts');
      expect(appModule).toContain(`issuer: '${defaultOptions.issuer}'`);
      expect(appModule).toContain(`clientId: '${defaultOptions.clientId}'`);
      done();
    }, done.fail);
  });
});
